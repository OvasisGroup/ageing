/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient() as any;

// GET: Retrieve all users (for admin use only)
export async function GET() {
  try {
    // In a real application, you would verify admin authentication here
    // For now, we'll assume the request is authenticated
    
    const users = await prisma.users.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        businessName: true,
        businessAddress: true,
        licenseNumber: true,
        serviceType: true,
        yearsOfExperience: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}