import { NextRequest, NextResponse } from 'next/server';
import { generatePricingRecommendation } from '@/lib/openai';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { serviceType, location } = await request.json();

    if (!serviceType) {
      return NextResponse.json({ error: 'Service type required' }, { status: 400 });
    }

    // Get provider experience
    const provider = await prisma.users.findUnique({
      where: { id: userId },
      select: { yearsOfExperience: true },
    });

    if (!provider) {
      return NextResponse.json({ error: 'Provider not found' }, { status: 404 });
    }

    // Mock market data (in production, this would query actual market data)
    const marketData = {
      avgPrice: 45,
      competitors: 12,
    };

    const pricing = await generatePricingRecommendation(
      serviceType,
      provider.yearsOfExperience || 0,
      location || 'General area',
      marketData
    );

    return NextResponse.json(pricing);
  } catch (error) {
    console.error('Pricing recommendation error:', error);
    return NextResponse.json({ error: 'Failed to generate pricing recommendation' }, { status: 500 });
  }
}
