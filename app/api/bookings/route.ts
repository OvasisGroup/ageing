import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { createCalendarEvent, hasGoogleCalendar } from '@/lib/google-calendar';

// Validation schema
const createBookingSchema = z.object({
  providerId: z.string(),
  categoryId: z.string(), // Changed from serviceType enum to categoryId
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().optional(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  location: z.string().optional(),
  budget: z.string().optional().transform(val => val ? parseFloat(val) : undefined),
  notes: z.string().optional(),
});

// GET - List bookings for current user
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user role to determine which bookings to show
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get bookings based on user role
    const bookings = user.role === 'PROVIDER' 
      ? await prisma.booking.findMany({
          where: { providerId: userId },
          include: {
            category: true,
            customer: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
              }
            },
            provider: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                businessName: true,
                email: true,
                phone: true,
              }
            }
          },
          orderBy: { startTime: 'desc' }
        })
      : await prisma.booking.findMany({
          where: { customerId: userId },
          include: {
            category: true,
            customer: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
              }
            },
            provider: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                businessName: true,
                email: true,
                phone: true,
              }
            }
          },
          orderBy: { startTime: 'desc' }
        });

    return NextResponse.json({ bookings });
  } catch (error) {
    console.error('Get bookings error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}

// POST - Create new booking
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validation = createBookingSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed',
          details: validation.error.issues.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        },
        { status: 400 }
      );
    }

    const { providerId, categoryId, title, description, startTime, endTime, location, budget, notes } = validation.data;

    // Verify provider exists
    const provider = await prisma.user.findFirst({
      where: {
        id: providerId,
        role: 'PROVIDER'
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        businessName: true,
        email: true,
      }
    });

    if (!provider) {
      return NextResponse.json(
        { error: 'Provider not found' },
        { status: 404 }
      );
    }

    // Get customer info
    const customer = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        firstName: true,
        lastName: true,
        email: true,
      }
    });

    if (!customer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }

    // Calculate duration in minutes
    const start = new Date(startTime);
    const end = new Date(endTime);
    const duration = Math.round((end.getTime() - start.getTime()) / 60000);

    // Create booking in database
    const booking = await prisma.booking.create({
      data: {
        customerId: userId,
        providerId,
        categoryId,
        title,
        description,
        startTime: start,
        endTime: end,
        duration,
        location,
        budget,
        notes,
        status: 'PENDING',
      },
      include: {
        category: true,
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          }
        },
        provider: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            businessName: true,
            email: true,
            phone: true,
          }
        }
      }
    });

    // Create Google Calendar event if user has connected calendar
    let googleEventId: string | null = null;
    const hasCalendar = await hasGoogleCalendar(userId);
    
    if (hasCalendar) {
      try {
        const bookingWithCategory = booking as typeof booking & { category: { title: string } };
        const event = await createCalendarEvent(userId, {
          summary: `${title} - ${provider.businessName || `${provider.firstName} ${provider.lastName}`}`,
          description: description || `Booking with ${provider.businessName || `${provider.firstName} ${provider.lastName}`}\n\nService: ${bookingWithCategory.category.title}\n\n${notes || ''}`,
          location: location,
          startTime: start,
          endTime: end,
          attendees: [provider.email],
          reminders: {
            useDefault: false,
            overrides: [
              { method: 'email', minutes: 24 * 60 }, // 1 day before
              { method: 'popup', minutes: 30 }, // 30 minutes before
            ],
          },
        });

        googleEventId = event.id || null;

        // Update booking with Google Calendar event ID
        await prisma.booking.update({
          where: { id: booking.id },
          data: { googleEventId }
        });
      } catch (calendarError) {
        console.error('Failed to create calendar event:', calendarError);
        // Continue without calendar event - booking is still created
      }
    }

    return NextResponse.json(
      { 
        message: 'Booking created successfully',
        booking: { ...booking, googleEventId },
        calendarAdded: !!googleEventId
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create booking error:', error);
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}
