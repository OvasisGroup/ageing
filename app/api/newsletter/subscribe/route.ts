import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Initialize Prisma client
const prisma = new PrismaClient();

// Type assertion to handle potential TypeScript caching issues
type NewsletterRecord = { id: string; email: string; name?: string | null; isActive: boolean };
type PrismaWithNewsletter = PrismaClient & {
  newsletterSubscription: {
    findUnique: (args: { where: { email: string } }) => Promise<NewsletterRecord | null>;
    create: (args: { data: { email: string; name?: string | null } }) => Promise<NewsletterRecord>;
    update: (args: { where: { email: string }; data: { isActive?: boolean; name?: string; updatedAt?: Date } }) => Promise<NewsletterRecord>;
  };
};

const typedPrisma = prisma as PrismaWithNewsletter;

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json();

    // Validate required fields
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingSubscription = await typedPrisma.newsletterSubscription.findUnique({
      where: { email }
    });

    if (existingSubscription) {
      if (existingSubscription.isActive) {
        return NextResponse.json(
          { error: 'This email is already subscribed to our newsletter' },
          { status: 409 }
        );
      } else {
        // Reactivate subscription
        await typedPrisma.newsletterSubscription.update({
          where: { email },
          data: { 
            isActive: true,
            name: name || existingSubscription.name,
            updatedAt: new Date()
          }
        });
      }
    } else {
      // Create new subscription
      await typedPrisma.newsletterSubscription.create({
        data: {
          email,
          name: name || null
        }
      });
    }

    console.log('Newsletter subscription saved:', { email, name, subscribedAt: new Date() });

    return NextResponse.json(
      { 
        message: 'Successfully subscribed to newsletter!',
        email: email
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe. Please try again.' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}