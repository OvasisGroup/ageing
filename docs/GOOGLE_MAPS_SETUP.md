# Google Maps Places API Setup

The customer registration form uses Google Places Autocomplete for address input. Follow these steps to set it up:

## 1. Get a Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the required APIs:
   - Navigate to "APIs & Services" > "Library"
   - Search for and enable **"Places API"**
   - Search for and enable **"Geocoding API"** (for current location feature)
4. Create credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy the API key

## 2. Restrict Your API Key (Recommended)

For security, restrict your API key:

1. Click on your API key in the Credentials page
2. Under "Application restrictions":
   - **Important**: For Geocoding API, you have two options:
     - **Option A (Recommended for Production)**: Use **IP addresses** restriction
       - Select "IP addresses (web servers, cron jobs, etc.)"
       - Add your server's IP address
     - **Option B (For Development/Client-side)**: Use **None** or create separate keys
       - Geocoding API does NOT support HTTP referrer restrictions
       - Consider using a backend proxy to call Geocoding API server-side
3. Under "API restrictions":
   - Select "Restrict key"
   - For Places API: Create a separate key with HTTP referrer restrictions
   - For Geocoding API: Use the key without referrer restrictions (or IP-restricted)
4. Save changes

### Best Practice: Use Two Separate API Keys

**Recommended Setup:**
1. **Client-side Key** (for Places Autocomplete only):
   - Application restriction: HTTP referrers
   - API restriction: Places API only
   - Use in registration form

2. **Server-side Key** (for Geocoding):
   - Application restriction: IP addresses (your server IP)
   - API restriction: Geocoding API only
   - Use in backend API route

**Alternative: Single Key with No Restrictions (Development Only)**
- Set Application restrictions to "None"
- Enable both Places API and Geocoding API
- ⚠️ Only use this for development/testing

## 3. Configure Environment Variable

1. Create a `.env.local` file in the project root (if it doesn't exist)
2. Add your API key:
   ```
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-actual-api-key-here
   ```
3. Restart your development server

## 4. Verify Setup

1. Start the development server: `pnpm dev`
2. Navigate to the homepage
3. Click "Use current location" button under the search bar
4. Allow location permissions when prompted
5. Your current address should populate in the search field
6. Navigate to the customer registration page
7. In Step 2 (Role & Contact Details), the address field should have autocomplete
8. Start typing an address - suggestions should appear

## Features

- **Current Location**: Homepage button to auto-fill search with your current location
- **Address Autocomplete**: Real-time address suggestions as you type (registration form)
- **US Addresses**: Currently restricted to US addresses (can be modified in the component)
- **Optional ZIP Code**: Separate field for ZIP code (5-digit or ZIP+4 format)
- **Fallback**: If API key is not set, features work as regular text inputs

## Troubleshooting

**Problem**: Address autocomplete not working
- Check if the API key is correctly set in `.env.local`
- Verify the Places API is enabled in Google Cloud Console
- Check browser console for any errors
- Ensure your domain is whitelisted in API key restrictions
- Restart dev server after adding environment variable

**Problem**: "This API project is not authorized to use this API"
- Enable both Places API and Geocoding API in Google Cloud Console
- Verify API key restrictions allow your domain
- Wait a few minutes for changes to propagate

**Problem**: "API keys with referer restrictions cannot be used with this API"
- This error occurs when trying to use Geocoding API with HTTP referrer restrictions
- **Solution**: The app now uses a server-side API route (`/api/location/geocode`)
- The Geocoding API is called from the server, not the client
- You can use HTTP referrer restrictions on your API key - the server-side call will work
- Alternatively, create two separate keys (one for client-side Places, one for server-side Geocoding)

**Problem**: Current location button not working
- Verify you're using HTTPS or localhost (geolocation requires secure context)
- Check if browser location permissions are granted
- Check browser console for API errors
- Verify API key is set in `.env` file

**Problem**: Quota exceeded
- Google provides a free tier with $200 monthly credit
- Monitor usage in Google Cloud Console
- Consider adding billing information if needed
