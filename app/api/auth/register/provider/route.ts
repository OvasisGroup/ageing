import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

// Validation schema for provider registration data
const providerRegisterSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters long')
    .max(20, 'Username must be at most 20 characters long')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  email: z.string()
    .email('Please enter a valid email address')
    .toLowerCase(),
  password: z.string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  firstName: z.string()
    .min(2, 'First name must be at least 2 characters long')
    .max(50, 'First name must be at most 50 characters long'),
  lastName: z.string()
    .min(2, 'Last name must be at least 2 characters long')
    .max(50, 'Last name must be at most 50 characters long'),
  phone: z.string()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number'),
  businessName: z.string()
    .min(2, 'Business name must be at least 2 characters long')
    .max(100, 'Business name must be at most 100 characters long'),
  businessAddress: z.string()
    .min(10, 'Business address must be at least 10 characters long')
    .max(200, 'Business address must be at most 200 characters long'),
  licenseNumber: z.string()
    .min(5, 'License number must be at least 5 characters long')
    .max(50, 'License number must be at most 50 characters long')
    .optional(),
  serviceType: z.enum(['HOME_CARE', 'MEDICAL_CARE', 'COMPANIONSHIP', 'HOUSEKEEPING', 'TRANSPORTATION', 'OTHER'])
    .default('OTHER'),
  yearsOfExperience: z.number()
    .min(0, 'Years of experience cannot be negative')
    .max(50, 'Years of experience must be realistic')
    .optional(),
  description: z.string()
    .min(50, 'Description must be at least 50 characters long')
    .max(1000, 'Description must be at most 1000 characters long')
    .optional()
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the request data
    const validationResult = providerRegisterSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationResult.error.issues.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        },
        { status: 400 }
      );
    }

    const { 
      username, 
      email, 
      password, 
      firstName, 
      lastName, 
      phone, 
      businessName, 
      businessAddress, 
      licenseNumber, 
      serviceType, 
      yearsOfExperience, 
      description 
    } = validationResult.data;

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email },
          { username: username }
        ]
      }
    });

    if (existingUser) {
      return NextResponse.json(
        {
          error: existingUser.email === email 
            ? 'An account with this email already exists' 
            : 'Username is already taken'
        },
        { status: 409 }
      );
    }

    // Hash the password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new provider user in database
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role: 'PROVIDER',
        firstName,
        lastName,
        phone: phone || null,
        businessName: businessName || null,
        businessAddress: businessAddress || null,
        licenseNumber: licenseNumber || null,
        serviceType: serviceType || null,
        yearsOfExperience: yearsOfExperience || null,
        description: description || null,
      },
      select: {
        id: true,
        username: true,
        email: true,
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
        createdAt: true,
        updatedAt: true,
      }
    });
    
    return NextResponse.json(
      {
        message: 'Provider account created successfully',
        user: newUser
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Provider registration error:', error);
    
    // Handle Prisma unique constraint violations
    if (error && typeof error === 'object' && 'code' in error) {
      if (error.code === 'P2002') {
        return NextResponse.json(
          { error: 'Username or email already exists' },
          { status: 409 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}