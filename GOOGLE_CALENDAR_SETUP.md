# Google Calendar Integration Setup

## Overview
This application integrates Google Calendar to automatically add service bookings to customers' calendars with reminders.

## Features
- ✅ OAuth 2.0 authentication with Google
- ✅ Automatic calendar event creation when booking services
- ✅ Email and popup reminders (1 day before and 30 minutes before)
- ✅ Sync booking updates to Google Calendar
- ✅ Remove calendar events when bookings are cancelled
- ✅ Provider added as attendee to receive notifications

## Setup Instructions

### 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Note your Project ID

### 2. Enable Google Calendar API

1. In the Google Cloud Console, go to **APIs & Services > Library**
2. Search for "Google Calendar API"
3. Click **Enable**

### 3. Create OAuth 2.0 Credentials

1. Go to **APIs & Services > Credentials**
2. Click **Create Credentials > OAuth 2.0 Client ID**
3. If prompted, configure the OAuth consent screen:
   - User Type: **External** (for testing) or **Internal** (for organization)
   - App name: **MyNestShield** (or your app name)
   - User support email: Your email
   - Authorized domains: Your domain
   - Developer contact: Your email
   - Scopes: Add `calendar` and `calendar.events` scopes
4. After consent screen setup, create OAuth 2.0 Client ID:
   - Application type: **Web application**
   - Name: **MyNestShield Calendar Integration**
   - Authorized redirect URIs:
     - Development: `http://localhost:3000/api/auth/google/callback`
     - Production: `https://yourdomain.com/api/auth/google/callback`
5. Click **Create**
6. Copy the **Client ID** and **Client Secret**

### 4. Configure Environment Variables

Add the following to your `.env` file:

```bash
# Google Calendar API (OAuth 2.0)
GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-client-secret"
GOOGLE_REDIRECT_URI="http://localhost:3000/api/auth/google/callback"

# App URL (for redirects)
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

**Production:**
```bash
GOOGLE_REDIRECT_URI="https://yourdomain.com/api/auth/google/callback"
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
```

### 5. Database Migration

The booking schema and Google Calendar fields have been added to the User model. Run:

```bash
npx prisma db push
# or
npx prisma migrate dev
```

## Usage

### For Customers

#### 1. Connect Google Calendar
- Go to **Dashboard > Settings**
- Click **Connect Google Calendar**
- Sign in with your Google account
- Grant calendar access permissions

#### 2. Create a Booking
- Go to **Dashboard > Bookings**
- Click **New Booking**
- Fill in booking details:
  - Select provider
  - Choose service type
  - Set title and description
  - Select start and end times
  - Add location and notes
- Click **Create Booking**

#### 3. Automatic Calendar Integration
- If Google Calendar is connected, the booking is automatically added
- You'll receive:
  - Email reminder 1 day before
  - Popup reminder 30 minutes before
- Provider is added as attendee
- Updates to booking sync to Google Calendar
- Cancelled bookings are removed from calendar

### For Developers

#### API Endpoints

**Connect Google Calendar:**
```typescript
GET /api/auth/google/connect
Headers: { 'x-user-id': userId }
Response: { authUrl: string }
```

**OAuth Callback:**
```typescript
GET /api/auth/google/callback?code=...&state=userId
Redirects to: /dashboard/settings?calendar_connected=true
```

**Disconnect Google Calendar:**
```typescript
POST /api/auth/google/disconnect
Headers: { 'x-user-id': userId }
Response: { message: string }
```

**Create Booking:**
```typescript
POST /api/bookings
Headers: { 'x-user-id': userId }
Body: {
  providerId: string;
  serviceType: ServiceType;
  title: string;
  description?: string;
  startTime: string; // ISO 8601
  endTime: string;   // ISO 8601
  location?: string;
  notes?: string;
}
Response: {
  message: string;
  booking: Booking;
  calendarAdded: boolean;
}
```

**List Bookings:**
```typescript
GET /api/bookings
Headers: { 'x-user-id': userId }
Response: { bookings: Booking[] }
```

**Update Booking:**
```typescript
PUT /api/bookings/[id]
Headers: { 'x-user-id': userId }
Body: Partial<Booking>
```

**Cancel Booking:**
```typescript
DELETE /api/bookings/[id]
Headers: { 'x-user-id': userId }
```

#### Library Functions

```typescript
import { 
  getAuthUrl,
  createCalendarEvent,
  updateCalendarEvent,
  deleteCalendarEvent,
  hasGoogleCalendar,
  disconnectGoogleCalendar
} from '@/lib/google-calendar';

// Generate auth URL
const authUrl = getAuthUrl(userId);

// Create event
const event = await createCalendarEvent(userId, {
  summary: 'Home Care Visit',
  description: 'Weekly home care service',
  location: '123 Main St',
  startTime: new Date('2025-01-15T10:00:00'),
  endTime: new Date('2025-01-15T11:00:00'),
  attendees: ['provider@example.com'],
  reminders: {
    useDefault: false,
    overrides: [
      { method: 'email', minutes: 1440 },
      { method: 'popup', minutes: 30 }
    ]
  }
});

// Check if user has calendar connected
const hasCalendar = await hasGoogleCalendar(userId);
```

## Database Schema

### User Model Updates
```prisma
model User {
  // ...existing fields
  
  // Google Calendar Integration
  googleCalendarRefreshToken String?
  googleCalendarAccessToken  String?
  googleCalendarTokenExpiry  DateTime?
  
  // Booking relationships
  customerBookings    Booking[]   @relation("CustomerBookings")
  providerBookings    Booking[]   @relation("ProviderBookings")
}
```

### Booking Model
```prisma
model Booking {
  id                String        @id @default(cuid())
  customerId        String
  customer          User          @relation("CustomerBookings")
  providerId        String
  provider          User          @relation("ProviderBookings")
  serviceType       ServiceType
  title             String
  description       String?
  startTime         DateTime
  endTime           DateTime
  duration          Int           // Duration in minutes
  status            BookingStatus @default(PENDING)
  googleEventId     String?       // Google Calendar Event ID
  location          String?
  notes             String?
  cancellationReason String?
  createdAt         DateTime      @default(now())
  updatedAt         DateTime      @updatedAt
}

enum BookingStatus {
  PENDING
  CONFIRMED
  IN_PROGRESS
  COMPLETED
  CANCELLED
  NO_SHOW
}
```

## Security Considerations

1. **Token Storage**: Refresh tokens are stored encrypted in the database
2. **OAuth Scopes**: Only request calendar access, not full account access
3. **Token Refresh**: Access tokens are automatically refreshed when expired
4. **User Isolation**: Users can only access their own calendar events
5. **HTTPS Required**: OAuth callback must use HTTPS in production

## Troubleshooting

### "Error 400: redirect_uri_mismatch"
- Ensure redirect URI in Google Console exactly matches `GOOGLE_REDIRECT_URI` in `.env`
- Check for trailing slashes or http vs https mismatches

### Calendar events not created
- Verify user has connected Google Calendar (`hasGoogleCalendar()`)
- Check refresh token is saved in database
- Review API quotas in Google Cloud Console
- Check application logs for calendar API errors

### Token expired errors
- Tokens are automatically refreshed
- If persistent, user should reconnect Google Calendar

## Testing

1. Connect a test Google account
2. Create a booking
3. Verify:
   - Event appears in Google Calendar
   - Reminders are set correctly
   - Provider is listed as attendee
   - Update booking and check calendar sync
   - Cancel booking and verify removal from calendar

## Resources

- [Google Calendar API Documentation](https://developers.google.com/calendar/api/guides/overview)
- [OAuth 2.0 for Web Applications](https://developers.google.com/identity/protocols/oauth2/web-server)
- [googleapis npm package](https://www.npmjs.com/package/googleapis)
