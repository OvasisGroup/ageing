/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Initialize Prisma client with custom typing for user model
const prisma = new PrismaClient() as any;

// GET: Retrieve a specific user by ID (for admin use only)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: userId } = await params;
    
    // Find all users first and then filter by ID (temporary workaround)
    const users = await prisma.users.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        dateOfBirth: true,
        businessName: true,
        businessAddress: true,
        licenseNumber: true,
        serviceType: true,
        yearsOfExperience: true,
        description: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const user = users.find((u: any) => u.id === userId);

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// PUT: Update a specific user by ID (for admin use only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: userId } = await params;
    const body = await request.json();
    
    // In a real application, you would verify admin authentication here
    // For now, we'll assume the request is authenticated
    
    // Validate required fields
    const {
      username,
      email,
      firstName,
      lastName,
      phone,
      role,
      dateOfBirth,
      businessName,
      businessAddress,
      licenseNumber,
      serviceType,
      yearsOfExperience,
      description
    } = body;

    // Check if user exists
    const existingUsers = await prisma.users.findMany({
      where: { id: userId },
      select: { id: true }
    });

    if (existingUsers.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check for unique constraints (username and email)
    const conflictingUsers = await prisma.users.findMany({
      where: {
        OR: [
          { username: username },
          { email: email }
        ],
        NOT: { id: userId }
      },
      select: { id: true, username: true, email: true }
    });

    if (conflictingUsers.length > 0) {
      return NextResponse.json(
        { error: 'Username or email already exists' },
        { status: 400 }
      );
    }

    // Update the user
    const updatedUser = await prisma.users.update({
      where: { id: userId },
      data: {
        username,
        email,
        firstName: firstName || null,
        lastName: lastName || null,
        phone: phone || null,
        role,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        businessName: businessName || null,
        businessAddress: businessAddress || null,
        licenseNumber: licenseNumber || null,
        serviceType: serviceType || null,
        yearsOfExperience: yearsOfExperience ? parseInt(yearsOfExperience) : null,
        description: description || null,
        updatedAt: new Date()
      },
      select: {
        id: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        dateOfBirth: true,
        businessName: true,
        businessAddress: true,
        licenseNumber: true,
        serviceType: true,
        yearsOfExperience: true,
        description: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// DELETE: Delete a specific user by ID (for admin use only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: userId } = await params;
    
    // In a real application, you would verify admin authentication here
    // For now, we'll assume the request is authenticated
    
    // Check if user exists
    const existingUsers = await prisma.users.findMany({
      where: { id: userId },
      select: { id: true, role: true }
    });

    if (existingUsers.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const user = existingUsers[0];

    // Prevent deletion of admin users (safety measure)
    if (user.role === 'ADMIN') {
      return NextResponse.json(
        { error: 'Cannot delete admin users' },
        { status: 403 }
      );
    }

    // Delete the user
    await prisma.users.delete({
      where: { id: userId }
    });

    return NextResponse.json(
      { message: 'User deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}