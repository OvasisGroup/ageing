import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// PUT - Update user vetted status (Admin only)
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    // TODO: Get admin ID from session/JWT token
    const adminId = request.headers.get('x-user-id');

    if (!adminId) {
      return NextResponse.json(
        { error: 'Admin authentication required' },
        { status: 401 }
      );
    }

    // Verify admin role
    const admin = await prisma.user.findUnique({
      where: { id: adminId },
      select: { role: true },
    });

    if (!admin || admin.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const { id: userId } = await params;
    const body = await request.json();
    const { vettedStatus, notes } = body;

    // Validate vetted status
    const validStatuses = ['NOT_VETTED', 'PENDING_REVIEW', 'VETTED', 'REJECTED'];
    if (!vettedStatus || !validStatuses.includes(vettedStatus)) {
      return NextResponse.json(
        { error: 'Invalid vetted status' },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true, vettedStatus: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Only providers can be vetted
    if (user.role !== 'PROVIDER') {
      return NextResponse.json(
        { error: 'Only providers can be vetted' },
        { status: 400 }
      );
    }

    // Update vetted status
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        vettedStatus,
        vettedAt: new Date(),
        vettedBy: adminId,
      },
      select: {
        id: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        businessName: true,
        vettedStatus: true,
        vettedAt: true,
        vettedBy: true,
      },
    });

    // TODO: Send email notification to provider about status change
    console.log(`User ${userId} vetted status updated to ${vettedStatus} by admin ${adminId}`);
    if (notes) {
      console.log(`Admin notes: ${notes}`);
    }

    return NextResponse.json({
      message: 'Vetted status updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Update vetted status error:', error);
    return NextResponse.json(
      { error: 'Failed to update vetted status' },
      { status: 500 }
    );
  }
}

// GET - Get user verification details (Admin only)
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    // TODO: Get admin ID from session/JWT token
    const adminId = request.headers.get('x-user-id');

    if (!adminId) {
      return NextResponse.json(
        { error: 'Admin authentication required' },
        { status: 401 }
      );
    }

    // Verify admin role
    const admin = await prisma.user.findUnique({
      where: { id: adminId },
      select: { role: true },
    });

    if (!admin || admin.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const { id: userId } = await params;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        emailVerified: true,
        role: true,
        firstName: true,
        lastName: true,
        phone: true,
        businessName: true,
        businessAddress: true,
        licenseNumber: true,
        serviceType: true,
        yearsOfExperience: true,
        description: true,
        profilePhoto: true,
        vettedStatus: true,
        vettedAt: true,
        vettedBy: true,
        insuranceProvider: true,
        insurancePolicyNumber: true,
        insuranceExpiryDate: true,
        insuranceDocuments: true,
        workersCompProvider: true,
        workersCompPolicyNumber: true,
        workersCompExpiryDate: true,
        workersCompDocuments: true,
        certifications: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get vetting admin details if available
    let vettedByAdmin = null;
    if (user.vettedBy) {
      vettedByAdmin = await prisma.user.findUnique({
        where: { id: user.vettedBy },
        select: {
          id: true,
          username: true,
          email: true,
          firstName: true,
          lastName: true,
        },
      });
    }

    return NextResponse.json({
      user,
      vettedByAdmin,
    });
  } catch (error) {
    console.error('Get verification details error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch verification details' },
      { status: 500 }
    );
  }
}
