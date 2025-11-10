import fs from 'fs';
import path from 'path';
import { writeFile } from 'fs/promises';

export const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');
export const CATEGORIES_DIR = path.join(UPLOAD_DIR, 'categories');
export const SUBCATEGORIES_DIR = path.join(UPLOAD_DIR, 'subcategories');

// Ensure upload directories exist
export function ensureUploadDirs() {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }
  if (!fs.existsSync(CATEGORIES_DIR)) {
    fs.mkdirSync(CATEGORIES_DIR, { recursive: true });
  }
  if (!fs.existsSync(SUBCATEGORIES_DIR)) {
    fs.mkdirSync(SUBCATEGORIES_DIR, { recursive: true });
  }
}

// Save image file
export async function saveImage(
  file: File,
  directory: string,
  prefix: string = 'img'
): Promise<string> {
  ensureUploadDirs();

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Generate unique filename
  const timestamp = Date.now();
  const ext = path.extname(file.name);
  const filename = `${prefix}-${timestamp}${ext}`;
  const filepath = path.join(directory, filename);

  // Save file
  await writeFile(filepath, buffer);

  // Return relative path for storing in database
  const relativePath = filepath.replace(path.join(process.cwd(), 'public'), '');
  return relativePath.replace(/\\/g, '/'); // Normalize path for URLs
}

// Delete image file
export function deleteImage(imagePath: string): boolean {
  try {
    const fullPath = path.join(process.cwd(), 'public', imagePath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting image:', error);
    return false;
  }
}

// Generate slug from title
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
