import { NextRequest, NextResponse } from 'next/server';
import { generateProviderResponse } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { context, customerMessage, tone } = await request.json();

    if (!context || !customerMessage) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const response = await generateProviderResponse(context, customerMessage, tone || 'professional');

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Response generator error:', error);
    return NextResponse.json({ error: 'Failed to generate response' }, { status: 500 });
  }
}
