import { NextRequest, NextResponse } from 'next/server';
import { getAuthUrl } from '@/lib/google-calendar';

export async function GET(request: NextRequest) {
  try {
    // Get user ID from header or query parameter
    const userId = request.headers.get('x-user-id') || request.nextUrl.searchParams.get('userId');
    
    if (!userId) {
      console.error('Google Calendar connect: No user ID provided');
      return NextResponse.json(
        { error: 'Unauthorized - Please log in first' },
        { status: 401 }
      );
    }

    console.log('Generating Google Calendar auth URL for user:', userId);

    // Generate Google OAuth URL with userId in state
    const authUrl = getAuthUrl(userId);

    return NextResponse.json({ authUrl });
  } catch (error) {
    console.error('Google Calendar connect error:', error);
    return NextResponse.json(
      { error: 'Failed to generate authorization URL' },
      { status: 500 }
    );
  }
}
