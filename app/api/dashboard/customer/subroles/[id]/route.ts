import { NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

// Validation schema for updating subrole users
const updateSubRoleSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  password: z.string().min(8).optional(),
  permissions: z.array(z.string()).optional(),
  parentUserId: z.string().cuid(),
});

// GET - Get a single subrole user
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const parentUserId = searchParams.get('parentUserId');

    if (!parentUserId) {
      return NextResponse.json(
        { error: 'Parent user ID is required' },
        { status: 400 }
      );
    }

    const subRoleUser = await prisma.user.findFirst({
      where: {
        id,
        parentUserId,
      },
      select: {
        id: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        subRole: true,
        permissions: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!subRoleUser) {
      return NextResponse.json(
        { error: 'Subrole user not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(subRoleUser, { status: 200 });
  } catch (error) {
    console.error('Get subrole user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH - Update a subrole user
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validationResult = updateSubRoleSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationResult.error.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message,
          })),
        },
        { status: 400 }
      );
    }

    const { firstName, lastName, phone, email, password, permissions, parentUserId } = validationResult.data;

    // Verify the subrole user belongs to this parent
    const existingUser = await prisma.user.findFirst({
      where: {
        id,
        parentUserId,
      },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: 'Subrole user not found or unauthorized' },
        { status: 404 }
      );
    }

    // Check if email is being changed and is already taken
    if (email && email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email },
      });
      if (emailExists) {
        return NextResponse.json(
          { error: 'Email already exists' },
          { status: 409 }
        );
      }
    }

    // Prepare update data
    const updateData: {
      firstName?: string;
      lastName?: string;
      phone?: string;
      email?: string;
      permissions?: string[];
      password?: string;
    } = {
      firstName,
      lastName,
      phone,
      email,
      permissions,
    };

    // Hash new password if provided
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    // Update the subrole user
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        subRole: true,
        permissions: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(
      {
        message: 'Subrole user updated successfully',
        user: updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update subrole user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Remove a subrole user
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const parentUserId = searchParams.get('parentUserId');

    if (!parentUserId) {
      return NextResponse.json(
        { error: 'Parent user ID is required' },
        { status: 400 }
      );
    }

    // Verify the subrole user belongs to this parent
    const existingUser = await prisma.user.findFirst({
      where: {
        id,
        parentUserId,
      },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: 'Subrole user not found or unauthorized' },
        { status: 404 }
      );
    }

    // Delete the subrole user
    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: 'Subrole user deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete subrole user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
