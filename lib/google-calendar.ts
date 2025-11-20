import { google } from 'googleapis';
import { prisma } from '@/lib/prisma';

// Initialize OAuth2 client
export function getOAuth2Client() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI || `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`
  );
}

// Generate auth URL for user to grant calendar access
export function getAuthUrl(userId?: string) {
  const oauth2Client = getOAuth2Client();
  
  const scopes = [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/calendar.events'
  ];

  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent', // Force consent screen to get refresh token
    state: userId, // Pass userId in state for callback
  });
}

// Exchange authorization code for tokens
export async function getTokensFromCode(code: string) {
  const oauth2Client = getOAuth2Client();
  const { tokens } = await oauth2Client.getToken(code);
  return tokens;
}

// Get calendar client with user's credentials
export async function getCalendarClient(userId: string) {
  const user = await prisma.users.findUnique({
    where: { id: userId },
    select: {
      googleCalendarRefreshToken: true,
      googleCalendarAccessToken: true,
      googleCalendarTokenExpiry: true,
    }
  });

  if (!user?.googleCalendarRefreshToken) {
    throw new Error('User has not connected Google Calendar');
  }

  const oauth2Client = getOAuth2Client();
  oauth2Client.setCredentials({
    refresh_token: user.googleCalendarRefreshToken,
    access_token: user.googleCalendarAccessToken,
    expiry_date: user.googleCalendarTokenExpiry?.getTime(),
  });

  // Refresh token if expired
  const now = new Date();
  if (user.googleCalendarTokenExpiry && user.googleCalendarTokenExpiry < now) {
    const { credentials } = await oauth2Client.refreshAccessToken();
    
    // Update tokens in database
    await prisma.users.update({
      where: { id: userId },
      data: {
        googleCalendarAccessToken: credentials.access_token,
        googleCalendarTokenExpiry: credentials.expiry_date ? new Date(credentials.expiry_date) : null,
      }
    });
    
    oauth2Client.setCredentials(credentials);
  }

  return google.calendar({ version: 'v3', auth: oauth2Client });
}

// Create calendar event
export async function createCalendarEvent(
  userId: string,
  event: {
    summary: string;
    description?: string;
    location?: string;
    startTime: Date;
    endTime: Date;
    attendees?: string[];
    reminders?: {
      useDefault: boolean;
      overrides?: Array<{
        method: 'email' | 'popup';
        minutes: number;
      }>;
    };
  }
) {
  try {
    const calendar = await getCalendarClient(userId);

    const response = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: {
        summary: event.summary,
        description: event.description,
        location: event.location,
        start: {
          dateTime: event.startTime.toISOString(),
          timeZone: 'America/New_York', // You can make this dynamic
        },
        end: {
          dateTime: event.endTime.toISOString(),
          timeZone: 'America/New_York',
        },
        attendees: event.attendees?.map(email => ({ email })),
        reminders: event.reminders || {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 }, // 1 day before
            { method: 'popup', minutes: 30 }, // 30 minutes before
          ],
        },
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error creating calendar event:', error);
    throw error;
  }
}

// Update calendar event
export async function updateCalendarEvent(
  userId: string,
  eventId: string,
  event: {
    summary?: string;
    description?: string;
    location?: string;
    startTime?: Date;
    endTime?: Date;
    attendees?: string[];
  }
) {
  try {
    const calendar = await getCalendarClient(userId);

    const updateData: {
      summary?: string;
      description?: string;
      location?: string;
      start?: { dateTime: string; timeZone: string };
      end?: { dateTime: string; timeZone: string };
      attendees?: Array<{ email: string }>;
    } = {};
    if (event.summary) updateData.summary = event.summary;
    if (event.description) updateData.description = event.description;
    if (event.location) updateData.location = event.location;
    if (event.startTime) {
      updateData.start = {
        dateTime: event.startTime.toISOString(),
        timeZone: 'America/New_York',
      };
    }
    if (event.endTime) {
      updateData.end = {
        dateTime: event.endTime.toISOString(),
        timeZone: 'America/New_York',
      };
    }
    if (event.attendees) {
      updateData.attendees = event.attendees.map(email => ({ email }));
    }

    const response = await calendar.events.patch({
      calendarId: 'primary',
      eventId: eventId,
      requestBody: updateData,
    });

    return response.data;
  } catch (error) {
    console.error('Error updating calendar event:', error);
    throw error;
  }
}

// Delete calendar event
export async function deleteCalendarEvent(userId: string, eventId: string) {
  try {
    const calendar = await getCalendarClient(userId);

    await calendar.events.delete({
      calendarId: 'primary',
      eventId: eventId,
    });

    return true;
  } catch (error) {
    console.error('Error deleting calendar event:', error);
    throw error;
  }
}

// Check if user has connected Google Calendar
export async function hasGoogleCalendar(userId: string): Promise<boolean> {
  const user = await prisma.users.findUnique({
    where: { id: userId },
    select: { googleCalendarRefreshToken: true }
  });
  
  return !!user?.googleCalendarRefreshToken;
}

// Disconnect Google Calendar
export async function disconnectGoogleCalendar(userId: string) {
  await prisma.users.update({
    where: { id: userId },
    data: {
      googleCalendarRefreshToken: null,
      googleCalendarAccessToken: null,
      googleCalendarTokenExpiry: null,
    }
  });
}
