import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateId } from '@/lib/utils';

// GET - List all service requests for the authenticated user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const serviceRequests = await prisma.service_requests.findMany({
      where: {
        userId: userId
      },
      include: {
        categories: true,
        subcategories: true,
        users: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(serviceRequests);
  } catch (error) {
    console.error('Error fetching service requests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch service requests' },
      { status: 500 }
    );
  }
}

// POST - Create a new service request
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      categoryId,
      subcategoryId,
      title,
      description,
      location,
      locationLat,
      locationLng,
      budget,
      serviceDate,
      status = 'PENDING'
    } = body;

    // Validate required fields
    if (!userId || !categoryId || !title || !description || !location || !serviceDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create the service request
    const serviceRequest = await prisma.service_requests.create({
      data: {
        id: generateId(),
        userId,
        categoryId,
        subcategoryId: subcategoryId || null,
        title,
        description,
        location,
        locationLat: locationLat ? parseFloat(locationLat) : null,
        locationLng: locationLng ? parseFloat(locationLng) : null,
        budget: budget ? parseFloat(budget) : null,
        serviceDate: new Date(serviceDate),
        status,
        updatedAt: new Date(),
      },
      include: {
        categories: true,
        subcategories: true,
        users: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    return NextResponse.json(serviceRequest, { status: 201 });
  } catch (error) {
    console.error('Error creating service request:', error);
    return NextResponse.json(
      { error: 'Failed to create service request' },
      { status: 500 }
    );
  }
}
