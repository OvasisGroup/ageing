import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { unlink } from 'fs/promises';
import path from 'path';

export async function DELETE(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 401 }
      );
    }

    // Get user with related data
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        customerBookings: true,
        providerBookings: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check for active bookings
    const hasActiveBookings = [...user.customerBookings, ...user.providerBookings].some(
      booking => booking.status === 'CONFIRMED' || booking.status === 'PENDING'
    );

    if (hasActiveBookings) {
      return NextResponse.json(
        { error: 'Cannot delete account with active bookings. Please cancel all bookings first.' },
        { status: 400 }
      );
    }

    // Delete profile photo if exists
    if (user.profilePhoto) {
      try {
        const photoPath = path.join(process.cwd(), 'public', user.profilePhoto);
        await unlink(photoPath);
      } catch (error) {
        console.error('Error deleting profile photo:', error);
        // Continue with account deletion even if photo deletion fails
      }
    }

    // Delete insurance documents
    if (user.insuranceDocuments && user.insuranceDocuments.length > 0) {
      for (const doc of user.insuranceDocuments) {
        try {
          const docPath = path.join(process.cwd(), 'public', doc);
          await unlink(docPath);
        } catch (error) {
          console.error('Error deleting insurance document:', error);
        }
      }
    }

    // Delete workers comp documents
    if (user.workersCompDocuments && user.workersCompDocuments.length > 0) {
      for (const doc of user.workersCompDocuments) {
        try {
          const docPath = path.join(process.cwd(), 'public', doc);
          await unlink(docPath);
        } catch (error) {
          console.error('Error deleting workers comp document:', error);
        }
      }
    }

    // Delete certification documents
    if (user.certifications && Array.isArray(user.certifications)) {
      for (const cert of user.certifications) {
        const certObj = cert as { document?: string };
        if (certObj.document) {
          try {
            const docPath = path.join(process.cwd(), 'public', certObj.document);
            await unlink(docPath);
          } catch (error) {
            console.error('Error deleting certification document:', error);
          }
        }
      }
    }

    // Delete user (cascade will handle related records)
    await prisma.user.delete({
      where: { id: userId }
    });

    return NextResponse.json({
      success: true,
      message: 'Account deleted successfully'
    });

  } catch (error) {
    console.error('Account deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete account' },
      { status: 500 }
    );
  }
}
