import { NextRequest, NextResponse } from 'next/server';
import { generatePublicAssistantResponse } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages format' }, { status: 400 });
    }

    const response = await generatePublicAssistantResponse(messages);

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Public AI Chat error:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}
