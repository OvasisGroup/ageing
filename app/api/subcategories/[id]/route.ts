import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { saveImage, deleteImage, generateSlug, SUBCATEGORIES_DIR } from '@/lib/upload';

// GET - Fetch a single subcategory by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const subcategory = await prisma.subcategories.findUnique({
      where: { id },
      include: {
        categories: true,
      },
    });

    if (!subcategory) {
      return NextResponse.json(
        { error: 'Subcategory not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(subcategory);
  } catch (error) {
    console.error('Error fetching subcategory:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subcategory' },
      { status: 500 }
    );
  }
}

// PUT - Update a subcategory
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const formData = await request.formData();
    
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const categoryId = formData.get('categoryId') as string;
    const image = formData.get('image') as File | null;
    const isActive = formData.get('isActive') === 'true';
    const deleteExistingImage = formData.get('deleteExistingImage') === 'true';

    // Check if subcategory exists
    const existingSubcategory = await prisma.subcategories.findUnique({
      where: { id },
    });

    if (!existingSubcategory) {
      return NextResponse.json(
        { error: 'Subcategory not found' },
        { status: 404 }
      );
    }

    // Check if category exists if categoryId is provided
    if (categoryId) {
      const category = await prisma.categories.findUnique({
        where: { id: categoryId },
      });

      if (!category) {
        return NextResponse.json(
          { error: 'Category not found' },
          { status: 404 }
        );
      }
    }

    // Generate new slug if title changed
    let slug = existingSubcategory.slug;
    if (title && title !== existingSubcategory.title) {
      slug = generateSlug(title);

      // Check if new slug already exists
      const slugExists = await prisma.subcategories.findUnique({
        where: { slug },
      });

      if (slugExists && slugExists.id !== id) {
        return NextResponse.json(
          { error: 'A subcategory with this title already exists' },
          { status: 409 }
        );
      }
    }

    // Handle image update
    let imagePath = existingSubcategory.image;

    if (deleteExistingImage && existingSubcategory.image) {
      deleteImage(existingSubcategory.image);
      imagePath = null;
    }

    if (image && image.size > 0) {
      // Delete old image if exists
      if (existingSubcategory.image) {
        deleteImage(existingSubcategory.image);
      }
      // Save new image
      imagePath = await saveImage(image, SUBCATEGORIES_DIR, 'subcategory');
    }

    // Update subcategory
    const subcategory = await prisma.subcategories.update({
      where: { id },
      data: {
        title: title || existingSubcategory.title,
        description: description !== undefined ? description : existingSubcategory.description,
        categoryId: categoryId || existingSubcategory.categoryId,
        image: imagePath,
        slug,
        isActive,
      },
      include: {
        categories: true,
      },
    });

    return NextResponse.json({
      message: 'Subcategory updated successfully',
      subcategory,
    });
  } catch (error) {
    console.error('Error updating subcategory:', error);
    return NextResponse.json(
      { error: 'Failed to update subcategory' },
      { status: 500 }
    );
  }
}
