import { NextRequest, NextResponse } from 'next/server';
import { getTokensFromCode } from '@/lib/google-calendar';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Get user ID from query params (passed in state)
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state'); // userId encoded in state
    const error = searchParams.get('error');

    // Decode userId from state for error redirects
    const userId = state || '';
    let roleBasedPath = 'provider'; // default

    // Try to get user role even for errors
    if (userId) {
      try {
        const user = await prisma.users.findUnique({
          where: { id: userId },
          select: { role: true }
        });
        roleBasedPath = user?.role === 'PROVIDER' ? 'provider' : 'customer';
      } catch {
        // Use default if user lookup fails
      }
    }

    if (error) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/${roleBasedPath}/bookings?calendar_error=${error}`);
    }

    if (!code || !state) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/${roleBasedPath}/bookings?calendar_error=invalid_request`);
    }

    // Exchange code for tokens
    const tokens = await getTokensFromCode(code);

    // Get user to determine role for redirect
    const user = await prisma.users.findUnique({
      where: { id: userId },
      select: { role: true }
    });

    // Update user with tokens
    await prisma.users.update({
      where: { id: userId },
      data: {
        googleCalendarRefreshToken: tokens.refresh_token,
        googleCalendarAccessToken: tokens.access_token,
        googleCalendarTokenExpiry: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
      }
    });

    // Redirect to bookings page based on role with success message
    roleBasedPath = user?.role === 'PROVIDER' ? 'provider' : 'customer';
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/${roleBasedPath}/bookings?calendar_connected=true`);
  } catch (error) {
    console.error('Google Calendar callback error:', error);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/provider/bookings?calendar_error=callback_failed`);
  }
}
