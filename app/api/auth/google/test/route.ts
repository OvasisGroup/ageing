import { NextRequest, NextResponse } from 'next/server';
import { getAuthUrl } from '@/lib/google-calendar';

// Diagnostic endpoint to check Google OAuth configuration
export async function GET(request: NextRequest) {
  try {
    // Get redirect URI from environment variable
    const redirectUri = process.env.GOOGLE_REDIRECT_URI || `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`;
    
    // Generate a test auth URL
    const testAuthUrl = getAuthUrl('test-user-id');
    
    // Extract redirect_uri from the generated URL
    const url = new URL(testAuthUrl);
    const redirectUriFromUrl = url.searchParams.get('redirect_uri');
    
    return NextResponse.json({
      success: true,
      config: {
        clientId: process.env.GOOGLE_CLIENT_ID ? '✅ Configured' : '❌ Missing',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET ? '✅ Configured' : '❌ Missing',
        redirectUri: process.env.GOOGLE_REDIRECT_URI || '❌ Not set in .env',
        appUrl: process.env.NEXT_PUBLIC_APP_URL || '❌ Not set in .env',
      },
      oauth: {
        configuredRedirectUri: redirectUri,
        actualRedirectUri: redirectUriFromUrl,
      },
      message: 'Make sure the "actualRedirectUri" below matches EXACTLY what you have in Google Cloud Console',
      instructions: [
        '1. Go to https://console.cloud.google.com/',
        '2. Navigate to APIs & Services → Credentials',
        '3. Click on your OAuth 2.0 Client ID',
        '4. Add this URI to "Authorized redirect URIs":',
        `   ${redirectUriFromUrl}`,
        '5. Click SAVE',
        '6. Wait 30 seconds for changes to propagate',
        '7. Try connecting Google Calendar again',
      ],
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({
      success: false,
      error: errorMessage,
      message: 'Failed to check Google OAuth configuration',
    }, { status: 500 });
  }
}
