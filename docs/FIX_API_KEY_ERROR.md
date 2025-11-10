# Quick Fix: API Keys with Referer Restrictions Error

## Problem
Getting error: `"API keys with referer restrictions cannot be used with this API"`

This happens because the Google Geocoding API cannot be used with HTTP referer-restricted API keys.

## Quick Solution (Development/Testing)

### Option 1: Temporarily Remove Restrictions
1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Click on your API key
3. Under "Application restrictions", select **"None"**
4. Save changes
5. Wait 1-2 minutes for changes to propagate
6. Restart your dev server

⚠️ **Note**: Only use this for development. For production, use Option 2 below.

## Recommended Solution (Production)

### Option 2: Create Separate API Keys

#### Step 1: Create Client-Side Key (for Places Autocomplete)
1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Click "Create Credentials" > "API Key"
3. Click on the newly created key to configure it
4. Set a name: "Client-Side Key - Places API"
5. Under "Application restrictions":
   - Select "HTTP referrers (web sites)"
   - Add your domains:
     - `http://localhost:3000/*`
     - `https://yourdomain.com/*`
6. Under "API restrictions":
   - Select "Restrict key"
   - Check **"Places API"** only
7. Save changes
8. Copy the API key

#### Step 2: Create Server-Side Key (for Geocoding)
1. In Google Cloud Console, click "Create Credentials" > "API Key" again
2. Click on the newly created key to configure it
3. Set a name: "Server-Side Key - Geocoding API"
4. Under "Application restrictions":
   - Select **"None"** (or "IP addresses" if you know your server IP)
5. Under "API restrictions":
   - Select "Restrict key"
   - Check **"Geocoding API"** only
6. Save changes
7. Copy the API key

#### Step 3: Update Your .env File
```env
# Client-side key (with HTTP referer restrictions)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-client-key-from-step-1"

# Server-side key (without referer restrictions)
GOOGLE_MAPS_SERVER_API_KEY="your-server-key-from-step-2"
```

#### Step 4: Restart Dev Server
```bash
# Stop current server (Ctrl+C)
pnpm dev
```

## Current Implementation

The app now uses:
- **Client-side key** (`NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`): For Places Autocomplete in registration form
- **Server-side key** (`GOOGLE_MAPS_SERVER_API_KEY`): For Geocoding API in current location feature

The server-side API route (`/api/location/geocode`) uses the server key, which avoids the referer restriction issue.

## Verification

Test that it works:
1. Open the homepage
2. The "Use current location" button should automatically detect your location
3. Click the button to refresh location
4. You should see your city and state displayed
5. No errors in browser console

## Troubleshooting

### Still getting the error?
1. Make sure you saved changes in Google Cloud Console
2. Wait 2-3 minutes for changes to propagate
3. Clear browser cache
4. Restart dev server
5. Check that the correct API key is in `.env`

### Different error: "This API project is not authorized"
- Enable Geocoding API in Google Cloud Console
- Go to "APIs & Services" > "Library"
- Search for "Geocoding API"
- Click "Enable"

### Key shows up as undefined
- Make sure `.env` file is in the root directory
- Restart dev server after adding/changing keys
- Check for typos in variable names

## Security Notes

✅ **Best Practice**: Use separate keys
- Client key: Restricted to your domain
- Server key: Restricted to Geocoding API only

✅ **Environment Variables**:
- `NEXT_PUBLIC_*` variables are exposed to the browser (use for client-side only)
- Variables without `NEXT_PUBLIC_` are server-side only (more secure)

❌ **Don't**:
- Commit `.env` file to git
- Share API keys publicly
- Use unrestricted keys in production

## Cost Considerations

Both APIs have generous free tiers:
- **Places API**: ~1,000 autocomplete sessions/month free ($200 credit)
- **Geocoding API**: ~40,000 requests/month free ($200 credit)

Monitor usage at: https://console.cloud.google.com/billing
