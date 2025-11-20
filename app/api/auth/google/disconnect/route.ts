import { NextResponse } from 'next/server';
import { disconnectGoogleCalendar } from '@/lib/google-calendar';
import { prisma } from '@/lib/prisma';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Get user ID from header
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Find user
    const user = await prisma.users.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Disconnect Google Calendar
    await disconnectGoogleCalendar(user.id);

    return NextResponse.json({ 
      message: 'Google Calendar disconnected successfully' 
    });
  } catch (error) {
    console.error('Google Calendar disconnect error:', error);
    return NextResponse.json(
      { error: 'Failed to disconnect Google Calendar' },
      { status: 500 }
    );
  }
}
