import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient() as any;

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const provider = await prisma.user.findUnique({
      where: {
        id,
        role: 'PROVIDER',
      },
      select: {
        id: true,
        businessName: true,
        email: true,
        phone: true,
        address: true,
        zipCode: true,
        description: true,
        vettedStatus: true,
        serviceType: true,
        yearsOfExperience: true,
        profilePhoto: true,
        licenseNumber: true,
        certifications: true,
      },
    });

    if (!provider) {
      return NextResponse.json({ error: 'Provider not found' }, { status: 404 });
    }

    // Calculate average rating from reviews
    const reviews = await prisma.review.findMany({
      where: { providerId: id },
      select: { rating: true },
    });

    const averageRating = reviews.length > 0
      ? reviews.reduce((sum: number, review: { rating: number }) => sum + review.rating, 0) / reviews.length
      : null;

    return NextResponse.json({
      ...provider,
      bio: provider.description,
      rating: averageRating,
      totalReviews: reviews.length,
      isVerified: provider.vettedStatus === 'VETTED',
    });
  } catch (error) {
    console.error('Error fetching provider:', error);
    return NextResponse.json({ error: 'Failed to fetch provider' }, { status: 500 });
  }
}
