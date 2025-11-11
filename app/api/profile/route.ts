import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { saveImage, deleteImage, PROFILES_DIR, INSURANCE_DIR, CERTIFICATIONS_DIR } from '@/lib/upload';

// GET - Get current user profile
export async function GET(request: NextRequest) {
  try {
    // TODO: Get user ID from session/JWT token
    // For now, using header or query param
    const userId = request.headers.get('x-user-id') || request.nextUrl.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        subRole: true,
        emailVerified: true,
        firstName: true,
        lastName: true,
        phone: true,
        address: true,
        zipCode: true,
        businessName: true,
        businessAddress: true,
        licenseNumber: true,
        serviceType: true,
        yearsOfExperience: true,
        description: true,
        profilePhoto: true,
        vettedStatus: true,
        vettedAt: true,
        insuranceProvider: true,
        insurancePolicyNumber: true,
        insuranceExpiryDate: true,
        insuranceDocuments: true,
        workersCompProvider: true,
        workersCompPolicyNumber: true,
        workersCompExpiryDate: true,
        workersCompDocuments: true,
        certifications: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

// PUT - Update user profile
export async function PUT(request: NextRequest) {
  try {
    // TODO: Get user ID from session/JWT token
    const userId = request.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 401 }
      );
    }

    const formData = await request.formData();

    // Extract basic fields
    const firstName = formData.get('firstName') as string | null;
    const lastName = formData.get('lastName') as string | null;
    const phone = formData.get('phone') as string | null;
    const address = formData.get('address') as string | null;
    const zipCode = formData.get('zipCode') as string | null;
    const businessName = formData.get('businessName') as string | null;
    const businessAddress = formData.get('businessAddress') as string | null;
    const licenseNumber = formData.get('licenseNumber') as string | null;
    const serviceType = formData.get('serviceType') as string | null;
    const yearsOfExperience = formData.get('yearsOfExperience') as string | null;
    const description = formData.get('description') as string | null;

    // Extract insurance fields
    const insuranceProvider = formData.get('insuranceProvider') as string | null;
    const insurancePolicyNumber = formData.get('insurancePolicyNumber') as string | null;
    const insuranceExpiryDate = formData.get('insuranceExpiryDate') as string | null;

    // Extract workers comp fields
    const workersCompProvider = formData.get('workersCompProvider') as string | null;
    const workersCompPolicyNumber = formData.get('workersCompPolicyNumber') as string | null;
    const workersCompExpiryDate = formData.get('workersCompExpiryDate') as string | null;

    // Extract certifications JSON
    const certificationsJson = formData.get('certifications') as string | null;
    let certifications = null;
    if (certificationsJson) {
      try {
        certifications = JSON.parse(certificationsJson);
      } catch (e) {
        console.error('Failed to parse certifications:', e);
      }
    }

    // Get existing user
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        profilePhoto: true,
        insuranceDocuments: true,
        workersCompDocuments: true,
      },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Handle profile photo upload
    let profilePhotoPath = existingUser.profilePhoto;
    const profilePhoto = formData.get('profilePhoto') as File | null;
    if (profilePhoto && profilePhoto.size > 0) {
      // Delete old photo if exists
      if (existingUser.profilePhoto) {
        deleteImage(existingUser.profilePhoto);
      }
      // Save new photo
      profilePhotoPath = await saveImage(profilePhoto, PROFILES_DIR, `profile-${userId}`);
    }

    // Handle insurance documents upload
    let insuranceDocuments = existingUser.insuranceDocuments;
    const insuranceFiles = formData.getAll('insuranceDocuments') as File[];
    if (insuranceFiles.length > 0 && insuranceFiles[0].size > 0) {
      const newDocs: string[] = [];
      for (const file of insuranceFiles) {
        if (file.size > 0) {
          const docPath = await saveImage(file, INSURANCE_DIR, `insurance-${userId}`);
          newDocs.push(docPath);
        }
      }
      if (newDocs.length > 0) {
        insuranceDocuments = [...insuranceDocuments, ...newDocs];
      }
    }

    // Handle workers comp documents upload
    let workersCompDocuments = existingUser.workersCompDocuments;
    const workersCompFiles = formData.getAll('workersCompDocuments') as File[];
    if (workersCompFiles.length > 0 && workersCompFiles[0].size > 0) {
      const newDocs: string[] = [];
      for (const file of workersCompFiles) {
        if (file.size > 0) {
          const docPath = await saveImage(file, CERTIFICATIONS_DIR, `workerscomp-${userId}`);
          newDocs.push(docPath);
        }
      }
      if (newDocs.length > 0) {
        workersCompDocuments = [...workersCompDocuments, ...newDocs];
      }
    }

    // Build update data object
    const updateData: Record<string, unknown> = {};

    if (firstName !== null) updateData.firstName = firstName;
    if (lastName !== null) updateData.lastName = lastName;
    if (phone !== null) updateData.phone = phone;
    if (address !== null) updateData.address = address;
    if (zipCode !== null) updateData.zipCode = zipCode;
    if (businessName !== null) updateData.businessName = businessName;
    if (businessAddress !== null) updateData.businessAddress = businessAddress;
    if (licenseNumber !== null) updateData.licenseNumber = licenseNumber;
    if (serviceType !== null) updateData.serviceType = serviceType;
    if (yearsOfExperience !== null) updateData.yearsOfExperience = parseInt(yearsOfExperience);
    if (description !== null) updateData.description = description;

    if (profilePhotoPath) updateData.profilePhoto = profilePhotoPath;

    if (insuranceProvider !== null) updateData.insuranceProvider = insuranceProvider;
    if (insurancePolicyNumber !== null) updateData.insurancePolicyNumber = insurancePolicyNumber;
    if (insuranceExpiryDate !== null) updateData.insuranceExpiryDate = new Date(insuranceExpiryDate);
    if (insuranceDocuments) updateData.insuranceDocuments = insuranceDocuments;

    if (workersCompProvider !== null) updateData.workersCompProvider = workersCompProvider;
    if (workersCompPolicyNumber !== null) updateData.workersCompPolicyNumber = workersCompPolicyNumber;
    if (workersCompExpiryDate !== null) updateData.workersCompExpiryDate = new Date(workersCompExpiryDate);
    if (workersCompDocuments) updateData.workersCompDocuments = workersCompDocuments;

    if (certifications !== null) updateData.certifications = certifications;

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
        phone: true,
        address: true,
        zipCode: true,
        businessName: true,
        businessAddress: true,
        licenseNumber: true,
        serviceType: true,
        yearsOfExperience: true,
        description: true,
        profilePhoto: true,
        vettedStatus: true,
        insuranceProvider: true,
        insurancePolicyNumber: true,
        insuranceExpiryDate: true,
        insuranceDocuments: true,
        workersCompProvider: true,
        workersCompPolicyNumber: true,
        workersCompExpiryDate: true,
        workersCompDocuments: true,
        certifications: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
