import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { saveImage, deleteImage, generateSlug, SUBCATEGORIES_DIR } from '@/lib/upload';
import { generateId } from '@/lib/utils';

// GET - Fetch all subcategories
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const isActive = searchParams.get('isActive');

    const where: Record<string, unknown> = {};
    
    if (categoryId) {
      where.categoryId = categoryId;
    }
    
    if (isActive !== null) {
      where.isActive = isActive === 'true';
    }

    const subcategories = await prisma.subcategories.findMany({
      where,
      include: {
        categories: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(subcategories);
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subcategories' },
      { status: 500 }
    );
  }
}

// POST - Create a new subcategory
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const categoryId = formData.get('categoryId') as string;
    const image = formData.get('image') as File | null;
    const isActive = formData.get('isActive') === 'true';

    // Validation
    if (!title || title.trim() === '') {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    if (!categoryId) {
      return NextResponse.json(
        { error: 'Category ID is required' },
        { status: 400 }
      );
    }

    // Check if category exists
    const category = await prisma.categories.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // Generate slug
    const slug = generateSlug(title);

    // Check if slug already exists
    const existingSubcategory = await prisma.subcategories.findUnique({
      where: { slug },
    });

    if (existingSubcategory) {
      return NextResponse.json(
        { error: 'A subcategory with this title already exists' },
        { status: 409 }
      );
    }

    // Save image if provided
    let imagePath: string | null = null;
    if (image && image.size > 0) {
      imagePath = await saveImage(image, SUBCATEGORIES_DIR, 'subcategory');
    }

    // Create subcategory
    const subcategory = await prisma.subcategories.create({
      data: {
        id: generateId(),
        title,
        description: description || null,
        image: imagePath,
        slug,
        categoryId,
        isActive,
        updatedAt: new Date(),
      },
      include: {
        categories: true,
      },
    });

    return NextResponse.json(
      {
        message: 'Subcategory created successfully',
        subcategory,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating subcategory:', error);
    return NextResponse.json(
      { error: 'Failed to create subcategory' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a subcategory
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Subcategory ID is required' },
        { status: 400 }
      );
    }

    // Get subcategory to delete image
    const subcategory = await prisma.subcategories.findUnique({
      where: { id },
    });

    if (!subcategory) {
      return NextResponse.json(
        { error: 'Subcategory not found' },
        { status: 404 }
      );
    }

    // Delete image if exists
    if (subcategory.image) {
      deleteImage(subcategory.image);
    }

    // Delete subcategory
    await prisma.subcategories.delete({
      where: { id },
    });

    return NextResponse.json({
      message: 'Subcategory deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting subcategory:', error);
    return NextResponse.json(
      { error: 'Failed to delete subcategory' },
      { status: 500 }
    );
  }
}
