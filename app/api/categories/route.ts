import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { saveImage, deleteImage, generateSlug, CATEGORIES_DIR } from '@/lib/upload';

// GET - Fetch all categories
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeSubcategories = searchParams.get('includeSubcategories') === 'true';
    const isActive = searchParams.get('isActive');

    const where = isActive !== null ? { isActive: isActive === 'true' } : {};

    const categories = await prisma.category.findMany({
      where,
      include: {
        subcategories: includeSubcategories,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

// POST - Create a new category
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const image = formData.get('image') as File | null;
    const isActive = formData.get('isActive') === 'true';

    // Validation
    if (!title || title.trim() === '') {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    // Generate slug
    const slug = generateSlug(title);

    // Check if slug already exists
    const existingCategory = await prisma.category.findUnique({
      where: { slug },
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: 'A category with this title already exists' },
        { status: 409 }
      );
    }

    // Save image if provided
    let imagePath: string | null = null;
    if (image && image.size > 0) {
      imagePath = await saveImage(image, CATEGORIES_DIR, 'category');
    }

    // Create category
    const category = await prisma.category.create({
      data: {
        title,
        description: description || null,
        image: imagePath,
        slug,
        isActive,
      },
      include: {
        subcategories: true,
      },
    });

    return NextResponse.json(
      {
        message: 'Category created successfully',
        category,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a category
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Category ID is required' },
        { status: 400 }
      );
    }

    // Get category to delete image
    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // Delete image if exists
    if (category.image) {
      deleteImage(category.image);
    }

    // Delete category (subcategories will be cascade deleted)
    await prisma.category.delete({
      where: { id },
    });

    return NextResponse.json({
      message: 'Category deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    );
  }
}
