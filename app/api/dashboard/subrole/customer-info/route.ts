import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 401 }
      );
    }

    // Get the current user with their parent relationship
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        subRole: true,
        parentUserId: true,
        parentUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            address: true,
            zipCode: true,
          }
        }
      }
    });

    if (!currentUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Verify user has a subrole and parent customer
    if (!currentUser.subRole || !currentUser.parentUserId || !currentUser.parentUser) {
      return NextResponse.json(
        { error: 'Not authorized. User must be a family member or caregiver linked to a customer.' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      customer: currentUser.parentUser,
      subRole: currentUser.subRole
    });

  } catch (error) {
    console.error('Error fetching customer info:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
