# Current Location Feature - Homepage

## Overview
Added a "Use current location" button to the homepage hero section that automatically fills the search input with the user's current address using the browser's Geolocation API and Google's Geocoding API.

## Location in UI
The button appears directly below the search bar on the homepage hero section with:
- Location pin icon
- "Use current location" text
- Loading spinner when fetching location
- Error messages displayed below if location fails

## How It Works

### 1. User Clicks Button
- Button becomes disabled with loading spinner
- Browser requests location permission (if not already granted)

### 2. Browser Geolocation
- Uses `navigator.geolocation.getCurrentPosition()` to get coordinates
- Returns latitude and longitude

### 3. Reverse Geocoding
- Sends coordinates to Google Geocoding API
- Converts lat/lng to human-readable address
- Populates search input with formatted address

### 4. Error Handling
Handles various error scenarios:
- **Geolocation not supported**: Browser doesn't support the API
- **Permission denied**: User blocks location access
- **Location unavailable**: GPS signal not available
- **Request timeout**: Takes too long to get location
- **API errors**: Geocoding API issues

## Technical Implementation

### Files Modified
- `components/hero.tsx` - Added location state and functionality
- `.env` - Added Google Maps API key
- `.env.example` - Updated with API key example
- `docs/GOOGLE_MAPS_SETUP.md` - Added Geocoding API instructions

### API Requirements
Requires Google Cloud APIs:
1. **Geocoding API** - Converts coordinates to addresses
2. **Places API** - For address autocomplete (registration form)

### Code Structure
```typescript
// State management
const [isGettingLocation, setIsGettingLocation] = useState(false);
const [locationError, setLocationError] = useState<string | null>(null);

// Get current location
const getCurrentLocation = () => {
  // 1. Check geolocation support
  // 2. Request browser location
  // 3. Call Geocoding API
  // 4. Update search input
  // 5. Handle errors
};
```

## User Experience

### Success Flow
1. User clicks "Use current location" button
2. Button shows loading state: "Getting location..."
3. Browser prompts for location permission (first time only)
4. User allows permission
5. Address appears in search input
6. Button returns to normal state

### Error Flow
1. User clicks "Use current location" button
2. Browser prompts for location permission
3. User denies permission
4. Error message appears: "Location permission denied"
5. Button returns to normal state

## Styling

### Button States
- **Normal**: Semi-transparent white background with location icon
- **Hover**: Slightly brighter background
- **Loading**: Spinning icon with "Getting location..." text
- **Disabled**: Reduced opacity, no hover effect
- **Error**: Red text message displayed below

### Responsive Design
- Centered on mobile devices
- Left-aligned on desktop to match search bar
- Icon and text scale appropriately

## Browser Compatibility

### Geolocation Support
- ✅ Chrome 5+
- ✅ Firefox 3.5+
- ✅ Safari 5+
- ✅ Edge (all versions)
- ✅ Opera 16+

### HTTPS Requirement
⚠️ Geolocation only works on:
- `https://` URLs (production)
- `http://localhost` (development)
- Will NOT work on `http://` in production

## Privacy & Permissions

### User Consent
- Browser always prompts for permission first time
- Users can block or allow location access
- Permission persists across sessions (user can revoke)

### Data Usage
- Location coordinates sent to Google Geocoding API
- No location data stored on server
- Search input can be cleared by user

## Configuration

### Environment Variable
```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-actual-api-key-here"
```

### API Key Setup
1. Enable Geocoding API in Google Cloud Console
2. Add API key to `.env` file
3. Restart development server

### Without API Key
If API key is missing:
- Error message: "Location service not configured"
- Feature gracefully degrades
- Search input still works manually

## Testing

### Local Testing
```bash
# 1. Set API key in .env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-key"

# 2. Start dev server
pnpm dev

# 3. Open http://localhost:3000
# 4. Click "Use current location"
# 5. Allow browser permission
# 6. Verify address appears in search
```

### Common Test Cases
- ✅ Click button with location allowed
- ✅ Click button with location denied
- ✅ Click button without API key
- ✅ Click button on non-HTTPS (should fail gracefully)
- ✅ Click button while offline
- ✅ Multiple clicks in quick succession

## Cost Considerations

### Google Geocoding API Pricing
- **Free Tier**: $200 monthly credit
- **Per Request**: $0.005 per geocoding request
- **Free Requests**: ~40,000 requests per month

### Optimization
- Only calls API when user clicks button
- Single request per click (no polling)
- Caches browser geolocation result
- No server-side calls

## Security Best Practices

### API Key Restrictions
1. **Application restrictions**:
   - Restrict to your domain(s)
   - Add `http://localhost:3000/*` for development
   
2. **API restrictions**:
   - Enable only Geocoding API and Places API
   - Disable unused APIs

3. **Environment variables**:
   - Never commit `.env` to git
   - Use different keys for dev/prod

## Accessibility

### Keyboard Support
- Button is fully keyboard accessible
- Can be activated with Enter/Space
- Focus visible with outline ring

### Screen Readers
- Clear button label: "Use current location"
- Loading state announced: "Getting location..."
- Error messages are announced
- Disabled state indicated

## Future Enhancements

Potential improvements:
- [ ] Remember last location (localStorage)
- [ ] Show map preview of detected location
- [ ] Offer nearby location suggestions
- [ ] Support manual location entry fallback
- [ ] Add "Search near me" radius option
- [ ] Cache geocoding results to reduce API calls

## Troubleshooting

### Button doesn't work
1. Check if HTTPS or localhost
2. Verify API key is set
3. Check browser console for errors
4. Ensure location permissions allowed

### Wrong address returned
1. Check GPS accuracy on device
2. Try refreshing page and clicking again
3. Manually correct address in search input

### Permission prompt not showing
1. Check if permission already granted/denied
2. Reset permissions in browser settings
3. Try incognito/private mode

### API quota exceeded
1. Check Google Cloud Console usage
2. Add billing if needed (still have free tier)
3. Monitor usage to optimize calls

## Related Features
- Google Places Autocomplete (registration form)
- Address search functionality
- Service provider location matching
