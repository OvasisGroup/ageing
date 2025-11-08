/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

// Initialize Prisma client with custom typing for inquiry model
const prisma = new PrismaClient() as any;

// Validation schema for inquiry submission
const inquirySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().max(20, 'Phone must be less than 20 characters').optional(),
  subject: z.string().max(200, 'Subject must be less than 200 characters').optional(),
  message: z.string().min(10, 'Message must be at least 10 characters').max(1000, 'Message must be less than 1000 characters'),
});

// POST: Create a new inquiry
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the request body
    const validation = inquirySchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: validation.error.issues 
        },
        { status: 400 }
      );
    }

    const { name, email, phone, subject, message } = validation.data;

    // Create the inquiry in the database
    const inquiry = await prisma.inquiry.create({
      data: {
        name,
        email,
        phone: phone || 'Not provided',
        subject: subject || 'General Inquiry',
        message,
        status: 'PENDING', // Default status
        priority: 'MEDIUM', // Default priority
      },
    });

    return NextResponse.json(
      { 
        message: 'Inquiry submitted successfully',
        inquiry: {
          id: inquiry.id,
          name: inquiry.name,
          email: inquiry.email,
          phone: inquiry.phone,
          subject: inquiry.subject,
          status: inquiry.status,
          priority: inquiry.priority,
          createdAt: inquiry.createdAt,
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error creating inquiry:', error);
    return NextResponse.json(
      { error: 'Failed to submit inquiry. Please try again later.' },
      { status: 500 }
    );
  }
}

// GET: Retrieve all inquiries (for admin use)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    // Build the where clause
    const where = status ? { status: status.toUpperCase() as 'PENDING' | 'REVIEWED' | 'RESPONDED' | 'CLOSED' } : {};

    // Get all inquiries for the admin dashboard
    const inquiries = await prisma.inquiry.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    // Return all inquiries
    return NextResponse.json(inquiries);

  } catch (error) {
    console.error('Error fetching inquiries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch inquiries' },
      { status: 500 }
    );
  }
}