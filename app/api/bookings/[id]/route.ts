import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { BookingStatus } from '@prisma/client';
import { updateCalendarEvent, deleteCalendarEvent } from '@/lib/google-calendar';

// Validation schema for updates
const updateBookingSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().optional(),
  startTime: z.string().datetime().optional(),
  endTime: z.string().datetime().optional(),
  location: z.string().optional(),
  notes: z.string().optional(),
  status: z.enum(['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW']).optional(),
  cancellationReason: z.string().optional(),
});

// GET - Get single booking
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = request.headers.get('x-user-id');
    const { id } = await params;
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const booking = await prisma.booking.findFirst({
      where: {
        id,
        OR: [
          { customerId: userId },
          { providerId: userId }
        ]
      },
      include: {
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            address: true,
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
            businessAddress: true,
            serviceType: true,
          }
        }
      }
    });

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ booking });
  } catch (error) {
    console.error('Get booking error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch booking' },
      { status: 500 }
    );
  }
}

// PUT - Update booking
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = request.headers.get('x-user-id');
    const { id } = await params;
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validation = updateBookingSchema.safeParse(body);

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

    // Check if booking exists and user has permission
    const existingBooking = await prisma.booking.findFirst({
      where: {
        id,
        OR: [
          { customerId: userId },
          { providerId: userId }
        ]
      }
    });

    if (!existingBooking) {
      return NextResponse.json(
        { error: 'Booking not found or unauthorized' },
        { status: 404 }
      );
    }

    const { title, description, startTime, endTime, location, notes, status, cancellationReason } = validation.data;

    // Calculate new duration if times changed
    let duration = existingBooking.duration;
    if (startTime && endTime) {
      const start = new Date(startTime);
      const end = new Date(endTime);
      duration = Math.round((end.getTime() - start.getTime()) / 60000);
    }

    // Update booking in database
    const updateData: {
      title?: string;
      description?: string;
      startTime?: Date;
      endTime?: Date;
      duration?: number;
      location?: string;
      notes?: string;
      status?: BookingStatus;
      cancellationReason?: string;
    } = {};
    
    if (title) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (startTime) updateData.startTime = new Date(startTime);
    if (endTime) updateData.endTime = new Date(endTime);
    if (startTime && endTime) updateData.duration = duration;
    if (location !== undefined) updateData.location = location;
    if (notes !== undefined) updateData.notes = notes;
    if (status) updateData.status = status as BookingStatus;
    if (cancellationReason !== undefined) updateData.cancellationReason = cancellationReason;

    const booking = await prisma.booking.update({
      where: { id },
      data: updateData,
      include: {
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

    // Update Google Calendar event if exists
    if (existingBooking.googleEventId && existingBooking.customerId === userId) {
      try {
        const calendarUpdate: {
          summary?: string;
          description?: string;
          location?: string;
          startTime?: Date;
          endTime?: Date;
        } = {};
        
        if (title) calendarUpdate.summary = title;
        if (description !== undefined) calendarUpdate.description = description;
        if (location !== undefined) calendarUpdate.location = location;
        if (startTime) calendarUpdate.startTime = new Date(startTime);
        if (endTime) calendarUpdate.endTime = new Date(endTime);

        await updateCalendarEvent(userId, existingBooking.googleEventId, calendarUpdate);
      } catch (calendarError) {
        console.error('Failed to update calendar event:', calendarError);
        // Continue - booking is still updated
      }
    }

    return NextResponse.json({
      message: 'Booking updated successfully',
      booking
    });
  } catch (error) {
    console.error('Update booking error:', error);
    return NextResponse.json(
      { error: 'Failed to update booking' },
      { status: 500 }
    );
  }
}

// DELETE - Cancel/Delete booking
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = request.headers.get('x-user-id');
    const { id } = await params;
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if booking exists and user has permission
    const booking = await prisma.booking.findFirst({
      where: {
        id,
        OR: [
          { customerId: userId },
          { providerId: userId }
        ]
      }
    });

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found or unauthorized' },
        { status: 404 }
      );
    }

    // Delete Google Calendar event if exists
    if (booking.googleEventId && booking.customerId === userId) {
      try {
        await deleteCalendarEvent(userId, booking.googleEventId);
      } catch (calendarError) {
        console.error('Failed to delete calendar event:', calendarError);
        // Continue - booking will still be deleted
      }
    }

    // Delete booking from database
    await prisma.booking.delete({
      where: { id }
    });

    return NextResponse.json({
      message: 'Booking deleted successfully'
    });
  } catch (error) {
    console.error('Delete booking error:', error);
    return NextResponse.json(
      { error: 'Failed to delete booking' },
      { status: 500 }
    );
  }
}
