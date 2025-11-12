# Google OAuth Setup - Fix redirect_uri_mismatch Error

## Problem
You're getting **Error 400: redirect_uri_mismatch** because the redirect URI configured in your Google Cloud Console doesn't match the one your application is using.

## Current Configuration
- **App Redirect URI**: `http://localhost:3000/api/auth/google/callback`
- **Environment**: Development (localhost)

## Solution

### Step 1: Go to Google Cloud Console
1. Visit: https://console.cloud.google.com/
2. Select your project (or the project containing your OAuth credentials)

### Step 2: Navigate to OAuth 2.0 Client IDs
1. Click on the menu (☰) → **APIs & Services** → **Credentials**
2. Find your OAuth 2.0 Client ID in the list
3. Click on the client ID name to edit it

### Step 3: Add the Redirect URI
In the **Authorized redirect URIs** section, add the following URI **EXACTLY** as shown:

```
http://localhost:3000/api/auth/google/callback
```

**Important Notes:**
- ⚠️ No trailing slash
- ⚠️ Use `http://` (not `https://`) for localhost
- ⚠️ Port number must match (3000)
- ⚠️ Path must be exact: `/api/auth/google/callback`

### Step 4: For Production Deployment
When you deploy to production, you'll need to add your production URL as well:

```
https://yourdomain.com/api/auth/google/callback
```

You can have multiple redirect URIs configured at the same time. Example:
```
http://localhost:3000/api/auth/google/callback
https://yourdomain.com/api/auth/google/callback
```

### Step 5: Save Changes
1. Click **SAVE** at the bottom of the page
2. Wait a few seconds for changes to propagate

### Step 6: Test the Connection
1. Restart your development server if it's running:
   ```bash
   # Stop the server (Ctrl+C), then:
   pnpm dev
   ```

2. Go to your bookings page
3. Click "Connect Google Calendar"
4. You should now be redirected to Google's authorization page without errors

## Troubleshooting

### If you still get the error:
1. **Double-check the URI** - Make sure there are no extra spaces or characters
2. **Wait a minute** - Google OAuth changes can take a few seconds to propagate
3. **Clear browser cache** - Old OAuth state might be cached
4. **Check your .env file** - Make sure `GOOGLE_REDIRECT_URI` matches exactly

### Common Mistakes:
- ❌ `http://localhost:3000/api/auth/google/callback/` (trailing slash)
- ❌ `https://localhost:3000/api/auth/google/callback` (https instead of http)
- ❌ `http://localhost/api/auth/google/callback` (missing port)
- ❌ `http://127.0.0.1:3000/api/auth/google/callback` (IP instead of localhost)
- ✅ `http://localhost:3000/api/auth/google/callback` (CORRECT)

## Current Environment Variables

Your `.env` file should have:
```env
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GOOGLE_REDIRECT_URI="http://localhost:3000/api/auth/google/callback"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## Testing Checklist
- [ ] Added redirect URI to Google Cloud Console
- [ ] Saved changes in Google Cloud Console
- [ ] Restarted development server
- [ ] Cleared browser cache
- [ ] Tested "Connect Google Calendar" button
- [ ] Successfully redirected to Google authorization page
- [ ] Granted permissions
- [ ] Successfully redirected back to your app

## Need More Help?

If you're still experiencing issues:

1. **Check the actual error URL** - Copy the redirect_uri parameter from the error URL and compare it with what's in Google Cloud Console

2. **View OAuth Consent Screen Settings** - Make sure your app is configured properly:
   - Go to **APIs & Services** → **OAuth consent screen**
   - User type should be "External" for development
   - Add test users if needed

3. **Enable Google Calendar API**:
   - Go to **APIs & Services** → **Library**
   - Search for "Google Calendar API"
   - Click **ENABLE**

---

**Last Updated**: November 12, 2025
