import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const serviceRequests = await prisma.serviceRequest.findMany({
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        category: {
          select: {
            title: true,
          },
        },
        subcategory: {
          select: {
            title: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Transform the data to match the frontend interface
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const transformedRequests = serviceRequests.map((request: any) => ({
      id: request.id,
      serviceType: request.subcategory?.title || request.category.title,
      description: request.description,
      budget: request.budget?.toString() || '0',
      urgency: 'normal', // Default urgency since it's not in the schema
      location: request.location,
      status: request.status.toLowerCase().replace('_', ' '),
      createdAt: request.createdAt.toISOString(),
      user: {
        firstName: request.user.firstName,
        lastName: request.user.lastName,
        email: request.user.email,
        phone: request.user.phone,
      },
    }));

    return NextResponse.json(transformedRequests);
  } catch (error) {
    console.error('Error fetching service requests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch service requests' },
      { status: 500 }
    );
  }
}
