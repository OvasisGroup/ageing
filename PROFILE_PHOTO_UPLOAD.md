# Profile Photo Upload Feature

## Overview
The profile photo upload capability allows both customers and providers to upload and manage their profile photos. This feature is fully integrated into the profile management system.

## Architecture

### Frontend Components

#### Customer Profile (`/app/dashboard/customer/profile/page.tsx`)
- Profile photo display (128x128px rounded avatar)
- File input for photo upload (hidden, triggered by button)
- Image preview before saving
- Max file size: 5MB
- Recommended size: Square image, at least 400x400px

#### Provider Profile (`/app/dashboard/provider/profile/page.tsx`)
- Same functionality as customer profile
- Additional sections for business info, insurance, certifications

### Backend API

#### Profile API Route (`/app/api/profile/route.ts`)
**Endpoints:**
- `GET /api/profile?userId={id}` - Fetch user profile including photo URL
- `PUT /api/profile` - Update profile with photo upload support

**Photo Upload Flow:**
1. Receives multipart form data with `profilePhoto` file
2. Validates file (handled by browser: max 5MB)
3. Deletes old photo if exists (to save storage)
4. Saves new photo to `/public/uploads/profiles/`
5. Returns relative path (e.g., `/uploads/profiles/profile-{userId}-{timestamp}.jpg`)
6. Updates database with photo path

### File Upload Utility (`/lib/upload.ts`)

**Functions:**
- `ensureUploadDirs()` - Creates upload directories if they don't exist
- `saveImage(file, directory, prefix)` - Saves uploaded image and returns path
- `deleteImage(imagePath)` - Deletes image file from filesystem

**Upload Directories:**
```
public/
  uploads/
    profiles/         # User profile photos
    categories/       # Category images
    subcategories/    # Subcategory images
    insurance/        # Insurance documents
    certifications/   # Certification documents
```

### Database Schema

**User Model** (`profilePhoto` field):
```prisma
model User {
  id           String   @id @default(cuid())
  profilePhoto String?  // Stores path like "/uploads/profiles/profile-{userId}-{timestamp}.jpg"
  ...
}
```

## Usage

### For Customers
1. Navigate to `/dashboard/customer/profile`
2. Click "Edit Profile" button
3. In Profile Photo section, click "Upload New Photo"
4. Select image file (JPG, PNG, etc.)
5. Preview appears immediately
6. Click "Save Changes" to upload and save
7. Photo persists across sessions

### For Providers
1. Navigate to `/dashboard/provider/profile`
2. Same upload process as customers
3. Photo displayed in profile and potentially in provider listings

## Technical Details

### Image Processing
- **Format Support:** All browser-supported image formats (JPG, PNG, GIF, WebP, etc.)
- **Size Limit:** 5MB (enforced client-side)
- **Storage:** Files stored in `/public/uploads/profiles/`
- **Naming Convention:** `profile-{userId}-{timestamp}.{ext}`
- **Old Photo Cleanup:** Automatically deleted when new photo uploaded

### Security Considerations
- ✅ File size validation (5MB limit)
- ✅ User authentication required (x-user-id header)
- ✅ Only authenticated user can update their own photo
- ✅ Old photos automatically cleaned up
- ⚠️ Consider adding: File type validation on server
- ⚠️ Consider adding: Image dimension validation
- ⚠️ Consider adding: Virus scanning for production
- ⚠️ Consider adding: CDN integration for scalability

### Git Tracking
Upload directories are tracked with `.gitkeep` files but uploaded content is gitignored:
```gitignore
/public/uploads/*
!/public/uploads/.gitkeep
!/public/uploads/*/.gitkeep
```

## File Structure
```
app/
  api/
    profile/
      route.ts                    # Profile API with photo upload
  dashboard/
    customer/
      profile/
        page.tsx                   # Customer profile with photo upload
    provider/
      profile/
        page.tsx                   # Provider profile with photo upload
lib/
  upload.ts                        # File upload utilities
public/
  uploads/
    profiles/                      # Profile photos storage
      .gitkeep                     # Keep directory in git
prisma/
  schema.prisma                    # User model with profilePhoto field
```

## Features

### ✅ Implemented
- [x] Profile photo upload for customers
- [x] Profile photo upload for providers
- [x] Image preview before save
- [x] Old photo deletion
- [x] Responsive display
- [x] Edit mode with upload button
- [x] View mode with photo display
- [x] Loading states
- [x] Error handling
- [x] Toast notifications

### 🔄 Potential Enhancements
- [ ] Image cropping tool
- [ ] Image compression before upload
- [ ] Multiple image formats with optimization
- [ ] Drag-and-drop upload
- [ ] Webcam photo capture
- [ ] CDN integration
- [ ] Image transformation API (resize, crop, filter)
- [ ] Profile photo in navbar
- [ ] Profile photo in booking cards
- [ ] Avatar fallback with initials

## API Examples

### Upload Profile Photo
```typescript
const formData = new FormData();
formData.append('profilePhoto', file);
formData.append('firstName', 'John');
formData.append('lastName', 'Doe');

const response = await fetch('/api/profile', {
  method: 'PUT',
  headers: {
    'x-user-id': userId,
  },
  body: formData,
});

const data = await response.json();
// data.user.profilePhoto = "/uploads/profiles/profile-123-1234567890.jpg"
```

### Display Profile Photo
```tsx
<Image
  src={user.profilePhoto || '/images/default-avatar.png'}
  alt="Profile"
  width={128}
  height={128}
  className="rounded-full"
/>
```

## Troubleshooting

### Issue: "Failed to update profile"
- Check file size (must be < 5MB)
- Verify user is authenticated
- Check server logs for file system errors
- Ensure upload directories exist

### Issue: Photo not displaying
- Verify path starts with `/uploads/`
- Check if file exists in `public/uploads/profiles/`
- Verify Next.js is serving static files correctly
- Check browser console for 404 errors

### Issue: Old photos not deleted
- Check file permissions on server
- Verify `deleteImage()` function is working
- Check server logs for deletion errors

## Production Considerations

1. **Storage Scalability**
   - Consider using cloud storage (AWS S3, Cloudinary, etc.)
   - Implement CDN for faster image delivery
   - Set up automated backups

2. **Performance**
   - Implement image optimization pipeline
   - Use responsive images with multiple sizes
   - Enable browser caching

3. **Security**
   - Add server-side file type validation
   - Implement rate limiting
   - Add virus scanning
   - Use signed URLs for sensitive images

4. **Monitoring**
   - Track upload success/failure rates
   - Monitor storage usage
   - Alert on unusual activity
