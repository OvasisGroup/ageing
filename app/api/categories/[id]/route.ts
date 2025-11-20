import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { saveImage, deleteImage, generateSlug, CATEGORIES_DIR } from '@/lib/upload';

// GET - Fetch a single category by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const category = await prisma.categories.findUnique({
      where: { id },
      include: {
        subcategories: true,
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json(
      { error: 'Failed to fetch category' },
      { status: 500 }
    );
  }
}

// PUT - Update a category
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const formData = await request.formData();
    
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const image = formData.get('image') as File | null;
    const isActive = formData.get('isActive') === 'true';
    const deleteExistingImage = formData.get('deleteExistingImage') === 'true';

    // Check if category exists
    const existingCategory = await prisma.categories.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // Generate new slug if title changed
    let slug = existingCategory.slug;
    if (title && title !== existingCategory.title) {
      slug = generateSlug(title);

      // Check if new slug already exists
      const slugExists = await prisma.categories.findUnique({
        where: { slug },
      });

      if (slugExists && slugExists.id !== id) {
        return NextResponse.json(
          { error: 'A category with this title already exists' },
          { status: 409 }
        );
      }
    }

    // Handle image update
    let imagePath = existingCategory.image;

    if (deleteExistingImage && existingCategory.image) {
      deleteImage(existingCategory.image);
      imagePath = null;
    }

    if (image && image.size > 0) {
      // Delete old image if exists
      if (existingCategory.image) {
        deleteImage(existingCategory.image);
      }
      // Save new image
      imagePath = await saveImage(image, CATEGORIES_DIR, 'category');
    }

    // Update category
    const category = await prisma.categories.update({
      where: { id },
      data: {
        title: title || existingCategory.title,
        description: description !== undefined ? description : existingCategory.description,
        image: imagePath,
        slug,
        isActive,
      },
      include: {
        subcategories: true,
      },
    });

    return NextResponse.json({
      message: 'Category updated successfully',
      category,
    });
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json(
      { error: 'Failed to update category' },
      { status: 500 }
    );
  }
}
