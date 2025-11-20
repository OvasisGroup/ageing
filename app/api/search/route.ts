import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query || query.trim() === '') {
      return NextResponse.json({
        categories: [],
        subcategories: [],
        providers: []
      });
    }

    const searchTerm = query.trim().toLowerCase();

    // Search for categories
    const categories = await prisma.categories.findMany({
      where: {
        AND: [
          { isActive: true },
          {
            OR: [
              { title: { contains: searchTerm, mode: 'insensitive' } },
              { description: { contains: searchTerm, mode: 'insensitive' } }
            ]
          }
        ]
      },
      include: {
        subcategories: {
          where: { isActive: true }
        }
      },
      take: 10
    });

    // Search for subcategories
    const subcategories = await prisma.subcategories.findMany({
      where: {
        AND: [
          { isActive: true },
          {
            OR: [
              { title: { contains: searchTerm, mode: 'insensitive' } },
              { description: { contains: searchTerm, mode: 'insensitive' } }
            ]
          }
        ]
      },
      include: {
        categories: true
      },
      take: 10
    });

    // Search for providers (by business name, service type, or name)
    const providers = await prisma.users.findMany({
      where: {
        AND: [
          { role: 'PROVIDER' },
          { vettedStatus: 'VETTED' }, // Only show vetted providers
          {
            OR: [
              { businessName: { contains: searchTerm, mode: 'insensitive' } },
              { serviceType: { contains: searchTerm, mode: 'insensitive' } },
              { firstName: { contains: searchTerm, mode: 'insensitive' } },
              { lastName: { contains: searchTerm, mode: 'insensitive' } },
              { description: { contains: searchTerm, mode: 'insensitive' } }
            ]
          }
        ]
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        businessName: true,
        serviceType: true,
        description: true,
        profilePhoto: true,
        yearsOfExperience: true,
        address: true,
        zipCode: true,
        vettedStatus: true
      },
      take: 20
    });

    return NextResponse.json({
      categories,
      subcategories,
      providers,
      query: searchTerm
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Failed to perform search' },
      { status: 500 }
    );
  }
}
