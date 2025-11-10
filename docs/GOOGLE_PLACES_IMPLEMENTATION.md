# Customer Registration - Google Places & ZIP Code Implementation

## Overview
Added Google Places Autocomplete for address input and optional ZIP code field to the customer registration form.

## Changes Made

### 1. Database Schema Updates
**File**: `prisma/schema.prisma`
- Added `address` field (String, optional) to User model
- Added `zipCode` field (String, optional) to User model
- Executed `npx prisma db push` to sync database
- Regenerated Prisma Client with `npx prisma generate`

### 2. Google Places Autocomplete Component
**File**: `components/ui/google-places-autocomplete.tsx` (NEW)
- Created reusable Google Places Autocomplete component
- Dynamically loads Google Maps JavaScript API
- Restricts autocomplete to US addresses
- Falls back to regular input if API key not configured
- TypeScript declarations for Google Maps types included

### 3. Registration Form Updates
**File**: `app/register/customer/page.tsx`
- Added `address` and `zipCode` to form state
- Imported `GooglePlacesAutocomplete` component
- Added address field with Google Places integration in Step 2
- Added ZIP code field (supports 5-digit and ZIP+4 formats)
- Both fields are optional and placed under "Additional Contact Information"
- Updated form submission to include address and zipCode
- Added proper labels and helper text

### 4. API Route Updates
**File**: `app/api/auth/register/customer/route.ts`
- Added `address` validation (5-200 characters, optional)
- Added `zipCode` validation (regex for US ZIP codes: 12345 or 12345-6789, optional)
- Updated user creation to store address and zipCode
- Updated response to include new fields

### 5. Environment Configuration
**File**: `.env.example` (NEW)
- Added `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` variable
- Includes setup instructions

### 6. Documentation
**File**: `docs/GOOGLE_MAPS_SETUP.md` (NEW)
- Complete setup guide for Google Maps API
- Instructions for getting API key
- Security best practices (API key restrictions)
- Troubleshooting guide
- Features documentation

## Installation & Setup

### 1. Install Dependencies
Already installed:
```bash
pnpm add @react-google-maps/api
```

### 2. Get Google Maps API Key
1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Create/select project
3. Enable "Places API"
4. Create API key under Credentials
5. (Recommended) Restrict API key to your domain

### 3. Configure Environment
Create `.env.local` file:
```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-actual-api-key-here
```

### 4. Database Migration
Already completed:
```bash
npx prisma db push
npx prisma generate
```

## Features

### Address Autocomplete
- Real-time address suggestions powered by Google Places
- Currently restricted to US addresses (configurable)
- Automatically loads Google Maps API on demand
- Works as regular text input if API key not configured

### ZIP Code Field
- Optional separate field for ZIP code
- Validates US ZIP code formats:
  - 5-digit: `12345`
  - ZIP+4: `12345-6789`
- Maximum 10 characters
- Clear helper text and validation

### Form Organization
Both fields appear in Step 2 under "Additional Contact Information":
1. Address (with autocomplete)
2. ZIP Code
3. Phone Number
4. Date of Birth

All fields in this section are optional.

## Validation Rules

### Address
- **Optional**: Can be left empty
- **Min Length**: 5 characters (if provided)
- **Max Length**: 200 characters
- **Type**: Text (formatted address from Google Places)

### ZIP Code
- **Optional**: Can be left empty
- **Format**: Must match US ZIP code format
  - 5-digit: `^[0-9]{5}$`
  - ZIP+4: `^[0-9]{5}-[0-9]{4}$`
- **Max Length**: 10 characters

## API Request Format

```typescript
POST /api/auth/register/customer

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+11234567890",        // optional
  "dateOfBirth": "1980-01-01",    // optional
  "address": "123 Main St, City, State 12345",  // optional
  "zipCode": "12345",             // optional
  "subRole": "FAMILY_MEMBER",     // optional
  "parentCustomerEmail": "parent@example.com"  // required if subRole set
}
```

## Database Schema

```prisma
model User {
  // ... existing fields
  address             String?
  zipCode             String?
  // ... rest of fields
}
```

## Testing

### Without API Key
1. Form displays address field as regular text input
2. Manual address entry works normally
3. ZIP code validation works independently

### With API Key
1. Start dev server: `pnpm dev`
2. Navigate to `/register/customer`
3. Proceed to Step 2
4. Type in address field
5. Should see Google Places suggestions
6. Select suggestion to auto-fill
7. Optionally enter ZIP code
8. Complete registration

## Cost Considerations

Google Places Autocomplete pricing:
- **Free Tier**: $200 monthly credit (includes ~1000 autocomplete sessions)
- **Per Session**: $0.017 per autocomplete session
- **Session**: Counted when user selects a suggestion

Monitor usage at [Google Cloud Console](https://console.cloud.google.com/billing)

## Security Best Practices

1. **Restrict API Key**:
   - Limit to specific domains/URLs
   - Enable only Places API
   
2. **Environment Variables**:
   - Never commit `.env.local` to git
   - Use different keys for dev/production

3. **Input Validation**:
   - Address and ZIP code validated server-side
   - Prisma handles SQL injection prevention

## Future Enhancements

Potential improvements:
- [ ] Extract ZIP code from Google Places result automatically
- [ ] Support international addresses (remove US restriction)
- [ ] Add city/state fields with auto-population
- [ ] Implement address verification API
- [ ] Add map preview of selected location
- [ ] Store latitude/longitude coordinates

## Files Modified/Created

### Modified
- `prisma/schema.prisma` - Added address and zipCode fields
- `app/register/customer/page.tsx` - Added form fields and Google Places integration
- `app/api/auth/register/customer/route.ts` - Added validation and storage

### Created
- `components/ui/google-places-autocomplete.tsx` - Google Places component
- `.env.example` - Environment variable template
- `docs/GOOGLE_MAPS_SETUP.md` - Setup documentation
- `docs/GOOGLE_PLACES_IMPLEMENTATION.md` - This file

## Troubleshooting

### Address autocomplete not working
- Verify `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is set in `.env.local`
- Check Places API is enabled in Google Cloud Console
- Restart dev server after adding environment variable
- Check browser console for errors

### "This API project is not authorized"
- Enable Places API in Google Cloud Console
- Wait a few minutes for changes to propagate

### Validation errors
- Address must be 5-200 characters if provided
- ZIP code must match US format if provided
- Both fields are optional - can be left empty

## Notes

- Both address and ZIP code are **optional** fields
- Form works without Google API key (degrades to text input)
- ZIP code is separate field (not extracted from address)
- Address autocomplete restricted to US by default
- API key must start with `NEXT_PUBLIC_` to be available client-side
