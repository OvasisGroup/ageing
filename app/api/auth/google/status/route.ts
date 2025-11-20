import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has Google Calendar tokens
    const user = await prisma.users.findUnique({
      where: { id: userId },
      select: {
        googleCalendarRefreshToken: true,
        googleCalendarAccessToken: true,
      }
    });

    const isConnected = !!(user?.googleCalendarRefreshToken || user?.googleCalendarAccessToken);

    return NextResponse.json({ isConnected });
  } catch (error) {
    console.error('Error checking calendar status:', error);
    return NextResponse.json({ error: 'Failed to check status' }, { status: 500 });
  }
}
