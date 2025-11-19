import { NextRequest, NextResponse } from 'next/server';
import { generateCarePlan } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { seniorAge, conditions, mobilityLevel, currentServices } = await request.json();

    if (!seniorAge || !conditions || !mobilityLevel) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const carePlan = await generateCarePlan(
      seniorAge,
      conditions,
      mobilityLevel,
      currentServices || []
    );

    return NextResponse.json(carePlan);
  } catch (error) {
    console.error('Care plan generation error:', error);
    return NextResponse.json({ error: 'Failed to generate care plan' }, { status: 500 });
  }
}
