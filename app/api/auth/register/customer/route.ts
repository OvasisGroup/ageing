import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { generateOTP, getOTPExpiry, sendVerificationEmail } from '@/lib/email';

// Validation schema for customer registration data
const customerRegisterSchema = z.object({
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
    .min(10, 'Phone number must be at least 10 characters')
    .max(20, 'Phone number must be at most 20 characters'),
  address: z.string()
    .min(5, 'Address must be at least 5 characters long')
    .max(200, 'Address must be at most 200 characters long'),
  zipCode: z.string()
    .regex(/^[0-9]{5}(-[0-9]{4})?$/, 'Please enter a valid ZIP code (e.g., 12345 or 12345-6789)'),
  subRole: z.enum(['FAMILY_MEMBER', 'CAREGIVER'])
    .optional(),
  parentCustomerEmail: z.string()
    .email('Please enter a valid parent customer email')
    .toLowerCase()
    .optional()
}).refine((data) => {
  // If subRole is provided, parentCustomerEmail must also be provided
  if (data.subRole && !data.parentCustomerEmail) {
    return false;
  }
  return true;
}, {
  message: 'Parent customer email is required when registering as a family member or caregiver',
  path: ['parentCustomerEmail']
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the request data
    const validationResult = customerRegisterSchema.safeParse(body);
    
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

    const { username, email, password, firstName, lastName, phone, address, zipCode, subRole, parentCustomerEmail } = validationResult.data;

    // If registering as a subrole, verify parent customer exists
    let parentUserId: string | null = null;
    if (subRole && parentCustomerEmail) {
      const parentCustomer = await prisma.user.findUnique({
        where: { email: parentCustomerEmail },
        select: { id: true, role: true }
      });

      if (!parentCustomer) {
        return NextResponse.json(
          { error: 'Parent customer account not found with that email address' },
          { status: 404 }
        );
      }

      if (parentCustomer.role !== 'CUSTOMER') {
        return NextResponse.json(
          { error: 'The provided email must belong to a customer account' },
          { status: 400 }
        );
      }

      parentUserId = parentCustomer.id;
    }

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

    // Generate OTP for email verification
    const otp = generateOTP();
    const otpExpiry = getOTPExpiry();

    // Create new customer user in database
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role: 'CUSTOMER',
        firstName,
        lastName,
        phone: phone || null,
        address: address || null,
        zipCode: zipCode || null,
        subRole: subRole || null,
        parentUserId: parentUserId,
        emailVerified: false,
        verificationToken: otp,
        verificationTokenExpiry: otpExpiry,
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        subRole: true,
        firstName: true,
        lastName: true,
        phone: true,
        address: true,
        zipCode: true,
        parentUserId: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    // Send verification email
    await sendVerificationEmail(email, otp, username);
    
    return NextResponse.json(
      {
        message: 'Customer account created successfully. Please check your email for the verification code.',
        user: newUser,
        requiresVerification: true
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Customer registration error:', error);
    
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