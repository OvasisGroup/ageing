import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const providers = await prisma.user.findMany({
      where: {
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
        averageRating: true,
        totalReviews: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Transform the data to match the frontend interface
    const transformedProviders = providers.map((provider) => ({
      id: provider.id,
      businessName: provider.businessName || 'Unnamed Provider',
      email: provider.email,
      phone: provider.phone,
      address: provider.address,
      city: null, // Not in schema yet
      state: null, // Not in schema yet
      zipCode: provider.zipCode,
      bio: provider.description,
      rating: provider.averageRating,
      totalReviews: provider.totalReviews,
      profilePhoto: provider.profilePhoto,
      isVerified: provider.vettedStatus === 'VETTED',
      yearsOfExperience: provider.yearsOfExperience,
      categories: provider.serviceType ? [{ id: provider.serviceType, title: provider.serviceType }] : [],
    }));

    return NextResponse.json(transformedProviders);
  } catch (error) {
    console.error('Error fetching providers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch providers' },
      { status: 500 }
    );
  }
}
