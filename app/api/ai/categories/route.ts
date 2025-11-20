import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Fetch all categories with subcategories for AI training
export async function GET(request: NextRequest) {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      include: {
        subcategories: {
          where: { isActive: true },
          orderBy: { title: 'asc' }
        }
      },
      orderBy: { title: 'asc' }
    });

    // Format for AI consumption
    const formattedData = categories.map(category => ({
      id: category.id,
      title: category.title,
      description: category.description,
      slug: category.slug,
      subcategories: category.subcategories.map(sub => ({
        id: sub.id,
        title: sub.title,
        description: sub.description,
        slug: sub.slug
      }))
    }));

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error('Error fetching categories for AI:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
