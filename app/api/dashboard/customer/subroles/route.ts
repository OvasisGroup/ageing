import { NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

// Validation schema for adding subrole users
const addSubRoleSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().optional(),
  subRole: z.enum(['FAMILY_MEMBER', 'CAREGIVER']),
  permissions: z.array(z.string()).optional(),
  parentUserId: z.string().cuid(),
});

// POST - Add a family member or caregiver
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validationResult = addSubRoleSchema.safeParse(body);

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

    const { username, email, password, firstName, lastName, phone, subRole, permissions, parentUserId } = validationResult.data;

    // Check if parent user exists and is a CUSTOMER
    const parentUser = await prisma.user.findUnique({
      where: { id: parentUserId },
      select: { id: true, role: true },
    });

    if (!parentUser) {
      return NextResponse.json(
        { error: 'Parent user not found' },
        { status: 404 }
      );
    }

    if (parentUser.role !== 'CUSTOMER') {
      return NextResponse.json(
        { error: 'Only customers can add family members or caregivers' },
        { status: 403 }
      );
    }

    // Check for existing username or email
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { email },
        ],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: existingUser.username === username ? 'Username already exists' : 'Email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create subrole user
    const newSubRoleUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone,
        role: 'CUSTOMER',
        subRole,
        parentUserId,
        permissions: permissions || [],
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
      },
    });

    return NextResponse.json(
      {
        message: `${subRole === 'FAMILY_MEMBER' ? 'Family member' : 'Caregiver'} added successfully`,
        user: newSubRoleUser,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Add subrole user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET - List all family members and caregivers for a customer
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const parentUserId = searchParams.get('parentUserId');

    if (!parentUserId) {
      return NextResponse.json(
        { error: 'Parent user ID is required' },
        { status: 400 }
      );
    }

    // Verify parent user exists and is a CUSTOMER
    const parentUser = await prisma.user.findUnique({
      where: { id: parentUserId },
      select: { id: true, role: true },
    });

    if (!parentUser) {
      return NextResponse.json(
        { error: 'Parent user not found' },
        { status: 404 }
      );
    }

    if (parentUser.role !== 'CUSTOMER') {
      return NextResponse.json(
        { error: 'Only customers can list family members or caregivers' },
        { status: 403 }
      );
    }

    // Get all subrole users for this customer
    const subRoleUsers = await prisma.user.findMany({
      where: {
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
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(
      {
        subRoleUsers,
        count: subRoleUsers.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('List subrole users error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
