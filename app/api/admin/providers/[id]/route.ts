/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Initialize Prisma client with custom typing for user model
const prisma = new PrismaClient() as any;

// GET: Retrieve a specific provider by ID (for admin use only)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: providerId } = await params;
    
    // Find all providers first and then filter by ID (temporary workaround)
    const providers = await prisma.users.findMany({
      where: {
        role: 'PROVIDER',
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
      },
    });

    const provider = providers.find((p: any) => p.id === providerId);

    if (!provider) {
      return NextResponse.json(
        { error: 'Provider not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(provider);
  } catch (error) {
    console.error('Error fetching provider:', error);
    return NextResponse.json(
      { error: 'Failed to fetch provider' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// PUT: Update a specific provider by ID (for admin use only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: providerId } = await params;
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

    // Check if provider exists and is actually a provider
    const existingProviders = await prisma.users.findMany({
      where: { 
        id: providerId,
        role: 'PROVIDER'
      },
      select: { id: true }
    });

    if (existingProviders.length === 0) {
      return NextResponse.json(
        { error: 'Provider not found' },
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
        NOT: { id: providerId }
      },
      select: { id: true, username: true, email: true }
    });

    if (conflictingUsers.length > 0) {
      return NextResponse.json(
        { error: 'Username or email already exists' },
        { status: 400 }
      );
    }

    // Update the provider
    const updatedProvider = await prisma.users.update({
      where: { id: providerId },
      data: {
        username,
        email,
        firstName: firstName || null,
        lastName: lastName || null,
        phone: phone || null,
        role: role || 'PROVIDER',
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

    return NextResponse.json(updatedProvider);
  } catch (error) {
    console.error('Error updating provider:', error);
    return NextResponse.json(
      { error: 'Failed to update provider' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// DELETE: Delete a specific provider by ID (for admin use only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: providerId } = await params;
    
    // In a real application, you would verify admin authentication here
    // For now, we'll assume the request is authenticated
    
    // Check if provider exists and is actually a provider
    const existingProviders = await prisma.users.findMany({
      where: { 
        id: providerId,
        role: 'PROVIDER'
      },
      select: { id: true, role: true }
    });

    if (existingProviders.length === 0) {
      return NextResponse.json(
        { error: 'Provider not found' },
        { status: 404 }
      );
    }

    // Delete the provider
    await prisma.users.delete({
      where: { id: providerId }
    });

    return NextResponse.json(
      { message: 'Provider deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting provider:', error);
    return NextResponse.json(
      { error: 'Failed to delete provider' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}