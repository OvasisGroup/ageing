import { NextRequest, NextResponse } from 'next/server';
import { generateServiceRecommendations } from '@/lib/openai';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { currentNeeds, location } = await request.json();

    // Get user's service history
    const bookings = await prisma.service_requests.findMany({
      where: { userId: userId },
      include: { categories: true },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    const userHistory = bookings.map((b) => b.categories?.title || 'General Service');

    const recommendations = await generateServiceRecommendations(
      userHistory,
      currentNeeds || 'General senior care',
      location || 'General area'
    );

    return NextResponse.json({ recommendations });
  } catch (error) {
    console.error('Service recommendations error:', error);
    return NextResponse.json({ error: 'Failed to generate recommendations' }, { status: 500 });
  }
}
