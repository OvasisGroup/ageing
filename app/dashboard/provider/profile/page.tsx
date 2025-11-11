'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import DashboardLayout from '@/components/dashboard/layout';
import toast from 'react-hot-toast';
import Image from 'next/image';

type VettedStatus = 'NOT_VETTED' | 'PENDING_REVIEW' | 'VETTED' | 'REJECTED';

type Certification = {
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  documentUrl?: string;
  verified?: boolean;
};

type ProviderProfile = {
  id: string;
  username: string;
  email: string;
  emailVerified: boolean;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  address: string | null;
  zipCode: string | null;
  businessName: string | null;
  businessAddress: string | null;
  licenseNumber: string | null;
  serviceType: string | null;
  yearsOfExperience: number | null;
  description: string | null;
  profilePhoto: string | null;
  vettedStatus: VettedStatus;
  vettedAt: string | null;
  insuranceProvider: string | null;
  insurancePolicyNumber: string | null;
  insuranceExpiryDate: string | null;
  insuranceDocuments: string[];
  workersCompProvider: string | null;
  workersCompPolicyNumber: string | null;
  workersCompExpiryDate: string | null;
  workersCompDocuments: string[];
  certifications: Certification[];
  createdAt: string;
  updatedAt: string;
};

export default function ProviderProfilePage() {
  const [profile, setProfile] = useState<ProviderProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState('');
  const [description, setDescription] = useState('');
  
  // Insurance state
  const [insuranceProvider, setInsuranceProvider] = useState('');
  const [insurancePolicyNumber, setInsurancePolicyNumber] = useState('');
  const [insuranceExpiryDate, setInsuranceExpiryDate] = useState('');
  
  // Workers Comp state
  const [workersCompProvider, setWorkersCompProvider] = useState('');
  const [workersCompPolicyNumber, setWorkersCompPolicyNumber] = useState('');
  const [workersCompExpiryDate, setWorkersCompExpiryDate] = useState('');
  
  // Certifications state
  const [certifications, setCertifications] = useState<Certification[]>([]);
  
  // File upload state
  const [profilePhotoFile, setProfilePhotoFile] = useState<File | null>(null);
  const [insuranceFiles, setInsuranceFiles] = useState<File[]>([]);
  const [workersCompFiles, setWorkersCompFiles] = useState<File[]>([]);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string | null>(null);

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProfile = async () => {
    try {
      const userData = localStorage.getItem('user');
      if (!userData) {
        toast.error('User not found. Please login again.');
        window.location.href = '/login';
        return;
      }

      const user = JSON.parse(userData);
      const response = await fetch(`/api/profile?userId=${user.id}`, {
        headers: {
          'x-user-id': user.id,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data.user);
        initializeFormFields(data.user);
      } else {
        toast.error('Failed to load profile');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const initializeFormFields = (profileData: ProviderProfile) => {
    setFirstName(profileData.firstName || '');
    setLastName(profileData.lastName || '');
    setPhone(profileData.phone || '');
    setAddress(profileData.address || '');
    setZipCode(profileData.zipCode || '');
    setBusinessName(profileData.businessName || '');
    setBusinessAddress(profileData.businessAddress || '');
    setLicenseNumber(profileData.licenseNumber || '');
    setYearsOfExperience(profileData.yearsOfExperience?.toString() || '');
    setDescription(profileData.description || '');
    setInsuranceProvider(profileData.insuranceProvider || '');
    setInsurancePolicyNumber(profileData.insurancePolicyNumber || '');
    setInsuranceExpiryDate(profileData.insuranceExpiryDate ? new Date(profileData.insuranceExpiryDate).toISOString().split('T')[0] : '');
    setWorkersCompProvider(profileData.workersCompProvider || '');
    setWorkersCompPolicyNumber(profileData.workersCompPolicyNumber || '');
    setWorkersCompExpiryDate(profileData.workersCompExpiryDate ? new Date(profileData.workersCompExpiryDate).toISOString().split('T')[0] : '');
    setCertifications(profileData.certifications || []);
    setProfilePhotoPreview(profileData.profilePhoto || null);
  };

  const handleProfilePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image must be less than 5MB');
        return;
      }
      setProfilePhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInsuranceFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setInsuranceFiles(files);
  };

  const handleWorkersCompFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setWorkersCompFiles(files);
  };

  const addCertification = () => {
    setCertifications([
      ...certifications,
      {
        name: '',
        issuer: '',
        issueDate: '',
        expiryDate: '',
        verified: false,
      },
    ]);
  };

  const updateCertification = (index: number, field: keyof Certification, value: string | boolean) => {
    const updated = [...certifications];
    updated[index] = { ...updated[index], [field]: value };
    setCertifications(updated);
  };

  const removeCertification = (index: number) => {
    setCertifications(certifications.filter((_, i) => i !== index));
  };

  const handleSaveProfile = async () => {
    if (!profile) return;

    setSaving(true);
    const loadingToast = toast.loading('Updating profile...');

    try {
      const formData = new FormData();

      // Add text fields
      formData.append('firstName', firstName);
      formData.append('lastName', lastName);
      formData.append('phone', phone);
      formData.append('address', address);
      formData.append('zipCode', zipCode);
      formData.append('businessName', businessName);
      formData.append('businessAddress', businessAddress);
      formData.append('licenseNumber', licenseNumber);
      formData.append('yearsOfExperience', yearsOfExperience);
      formData.append('description', description);
      
      // Add insurance fields
      formData.append('insuranceProvider', insuranceProvider);
      formData.append('insurancePolicyNumber', insurancePolicyNumber);
      if (insuranceExpiryDate) {
        formData.append('insuranceExpiryDate', insuranceExpiryDate);
      }
      
      // Add workers comp fields
      formData.append('workersCompProvider', workersCompProvider);
      formData.append('workersCompPolicyNumber', workersCompPolicyNumber);
      if (workersCompExpiryDate) {
        formData.append('workersCompExpiryDate', workersCompExpiryDate);
      }
      
      // Add certifications as JSON
      formData.append('certifications', JSON.stringify(certifications));

      // Add profile photo
      if (profilePhotoFile) {
        formData.append('profilePhoto', profilePhotoFile);
      }

      // Add insurance documents
      insuranceFiles.forEach((file) => {
        formData.append('insuranceDocuments', file);
      });

      // Add workers comp documents
      workersCompFiles.forEach((file) => {
        formData.append('workersCompDocuments', file);
      });

      const userData = localStorage.getItem('user');
      const user = userData ? JSON.parse(userData) : null;

      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'x-user-id': user?.id || '',
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data.user);
        setIsEditing(false);
        setProfilePhotoFile(null);
        setInsuranceFiles([]);
        setWorkersCompFiles([]);
        
        toast.success('Profile updated successfully!', {
          id: loadingToast,
        });
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to update profile', {
          id: loadingToast,
        });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile', {
        id: loadingToast,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    if (profile) {
      initializeFormFields(profile);
    }
    setIsEditing(false);
    setProfilePhotoFile(null);
    setInsuranceFiles([]);
    setWorkersCompFiles([]);
  };

  const getVettedStatusBadge = (status: VettedStatus) => {
    const badges = {
      NOT_VETTED: { text: 'Not Vetted', className: 'bg-gray-100 text-gray-800' },
      PENDING_REVIEW: { text: 'Pending Review', className: 'bg-yellow-100 text-yellow-800' },
      VETTED: { text: '✓ Vetted', className: 'bg-green-100 text-green-800' },
      REJECTED: { text: 'Rejected', className: 'bg-red-100 text-red-800' },
    };
    return badges[status];
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const isInsuranceExpiring = (expiryDate: string | null) => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const now = new Date();
    const daysUntilExpiry = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  };

  const isInsuranceExpired = (expiryDate: string | null) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading profile...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!profile) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-6xl mb-4">❌</div>
            <h3 className="text-lg font-medium mb-2">Profile not found</h3>
            <p className="text-muted-foreground">Unable to load your profile information.</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const vettedBadge = getVettedStatusBadge(profile.vettedStatus);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Provider Profile</h1>
            <p className="text-muted-foreground mt-2">
              Manage your provider account and verification status
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${vettedBadge.className}`}>
              {vettedBadge.text}
            </span>
            {!isEditing && (
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            )}
          </div>
        </div>

        {/* Verification Alert */}
        {profile.vettedStatus === 'NOT_VETTED' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start">
              <span className="text-2xl mr-3">⚠️</span>
              <div>
                <h3 className="font-semibold text-yellow-900">Complete Your Profile for Verification</h3>
                <p className="text-sm text-yellow-800 mt-1">
                  Please complete all required information, including insurance details and certifications, to submit your profile for verification.
                </p>
              </div>
            </div>
          </div>
        )}

        {profile.vettedStatus === 'PENDING_REVIEW' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <span className="text-2xl mr-3">⏳</span>
              <div>
                <h3 className="font-semibold text-blue-900">Verification In Progress</h3>
                <p className="text-sm text-blue-800 mt-1">
                  Your profile is currently being reviewed by our admin team. You&apos;ll be notified once the review is complete.
                </p>
              </div>
            </div>
          </div>
        )}

        {profile.vettedStatus === 'VETTED' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start">
              <span className="text-2xl mr-3">✅</span>
              <div>
                <h3 className="font-semibold text-green-900">Verified Provider</h3>
                <p className="text-sm text-green-800 mt-1">
                  Your profile has been verified. You can now receive client requests and bookings.
                  {profile.vettedAt && ` Verified on ${formatDate(profile.vettedAt)}`}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Profile Photo Section */}
        <div className="bg-card rounded-lg border border-border">
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-semibold">Profile Photo</h2>
          </div>
          <div className="p-6">
            <div className="flex items-center space-x-6">
              <div className="relative h-32 w-32 rounded-full overflow-hidden bg-gray-200">
                {profilePhotoPreview ? (
                  <Image
                    src={profilePhotoPreview}
                    alt="Profile"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-4xl">
                    👤
                  </div>
                )}
              </div>
              {isEditing && (
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePhotoChange}
                    className="hidden"
                    id="profile-photo"
                  />
                  <label htmlFor="profile-photo">
                    <Button variant="outline" asChild>
                      <span className="cursor-pointer">Upload New Photo</span>
                    </Button>
                  </label>
                  <p className="text-xs text-muted-foreground mt-2">
                    Max file size: 5MB. Recommended: Square image, at least 400x400px
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Personal & Business Information */}
        <div className="bg-card rounded-lg border border-border">
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-semibold">Personal & Business Information</h2>
          </div>
          <div className="p-6">
            {isEditing ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">First Name *</label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Enter first name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Last Name *</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Enter last name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="e.g., +1 (555) 123-4567 or +44 20 1234 5678"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      International format with country code (e.g., +1 for US, +44 for UK)
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">ZIP Code *</label>
                    <input
                      type="text"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="12345"
                      maxLength={10}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Address</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="123 Main St, City, State"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Business Name *</label>
                    <input
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Your Business Name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">License Number</label>
                    <input
                      type="text"
                      value={licenseNumber}
                      onChange={(e) => setLicenseNumber(e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="LIC-123456"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Years of Experience</label>
                    <input
                      type="number"
                      value={yearsOfExperience}
                      onChange={(e) => setYearsOfExperience(e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="10"
                      min="0"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Business Address</label>
                    <input
                      type="text"
                      value={businessAddress}
                      onChange={(e) => setBusinessAddress(e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="456 Business Blvd, City, State"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Tell us about your services and experience..."
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Name</label>
                  <p className="text-base mt-1 font-medium">
                    {firstName && lastName ? `${firstName} ${lastName}` : 'Not provided'}
                  </p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="text-base mt-1">
                    <a href={`mailto:${profile.email}`} className="text-primary hover:underline font-medium">
                      {profile.email}
                    </a>
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Phone</label>
                  <p className="text-base mt-1 font-medium">{phone || 'Not provided'}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Business Name</label>
                  <p className="text-base mt-1 font-medium">{businessName || 'Not provided'}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">License Number</label>
                  <p className="text-base mt-1 font-medium">{licenseNumber || 'Not provided'}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Years of Experience</label>
                  <p className="text-base mt-1 font-medium">
                    {yearsOfExperience ? `${yearsOfExperience} years` : 'Not provided'}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Service Type</label>
                  <p className="text-base mt-1 font-medium">{profile.serviceType || 'Not specified'}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">ZIP Code</label>
                  <p className="text-base mt-1 font-medium">{zipCode || 'Not provided'}</p>
                </div>

                <div className="md:col-span-2 lg:col-span-3">
                  <label className="text-sm font-medium text-muted-foreground">Address</label>
                  <p className="text-base mt-1 font-medium">{address || 'Not provided'}</p>
                </div>

                <div className="md:col-span-2 lg:col-span-3">
                  <label className="text-sm font-medium text-muted-foreground">Business Address</label>
                  <p className="text-base mt-1 font-medium">{businessAddress || 'Not provided'}</p>
                </div>

                {description && (
                  <div className="md:col-span-2 lg:col-span-3">
                    <label className="text-sm font-medium text-muted-foreground">Description</label>
                    <p className="text-base mt-1">{description}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Insurance Information */}
        <div className="bg-card rounded-lg border border-border">
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-semibold">Insurance Information</h2>
          </div>
          <div className="p-6">
            {isEditing ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Insurance Provider *</label>
                    <input
                      type="text"
                      value={insuranceProvider}
                      onChange={(e) => setInsuranceProvider(e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="e.g., State Farm, Allstate"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Policy Number *</label>
                    <input
                      type="text"
                      value={insurancePolicyNumber}
                      onChange={(e) => setInsurancePolicyNumber(e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="POL-123456789"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Expiry Date *</label>
                    <input
                      type="date"
                      value={insuranceExpiryDate}
                      onChange={(e) => setInsuranceExpiryDate(e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Upload Documents</label>
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleInsuranceFilesChange}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Upload insurance certificates (PDF, JPG, PNG)
                    </p>
                  </div>
                </div>

                {profile.insuranceDocuments && profile.insuranceDocuments.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Existing Documents</label>
                    <div className="space-y-2">
                      {profile.insuranceDocuments.map((doc, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 bg-accent rounded">
                          <span className="text-sm">📄 {doc.split('/').pop()}</span>
                          <a href={doc} target="_blank" rel="noopener noreferrer" className="text-primary text-sm hover:underline">
                            View
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div>
                {insuranceProvider ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Provider</label>
                        <p className="text-base mt-1 font-medium">{insuranceProvider}</p>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Policy Number</label>
                        <p className="text-base mt-1 font-medium">{insurancePolicyNumber}</p>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Expiry Date</label>
                        <p className={`text-base mt-1 font-medium ${
                          isInsuranceExpired(profile.insuranceExpiryDate) ? 'text-red-600' :
                          isInsuranceExpiring(profile.insuranceExpiryDate) ? 'text-yellow-600' : ''
                        }`}>
                          {formatDate(profile.insuranceExpiryDate)}
                          {isInsuranceExpired(profile.insuranceExpiryDate) && ' (Expired)'}
                          {isInsuranceExpiring(profile.insuranceExpiryDate) && ' (Expiring Soon)'}
                        </p>
                      </div>
                    </div>

                    {profile.insuranceDocuments && profile.insuranceDocuments.length > 0 && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Documents</label>
                        <div className="mt-2 space-y-2">
                          {profile.insuranceDocuments.map((doc, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-accent rounded-lg">
                              <span className="text-sm font-medium">📄 {doc.split('/').pop()}</span>
                              <a 
                                href={doc} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-primary text-sm hover:underline"
                              >
                                View Document
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <div className="text-4xl mb-2">📋</div>
                    <p>No insurance information provided</p>
                    <p className="text-sm mt-1">Add your insurance details to complete verification</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Workers Compensation */}
        <div className="bg-card rounded-lg border border-border">
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-semibold">Workers Compensation Insurance</h2>
          </div>
          <div className="p-6">
            {isEditing ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Provider</label>
                    <input
                      type="text"
                      value={workersCompProvider}
                      onChange={(e) => setWorkersCompProvider(e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="e.g., The Hartford, Travelers"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Policy Number</label>
                    <input
                      type="text"
                      value={workersCompPolicyNumber}
                      onChange={(e) => setWorkersCompPolicyNumber(e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="WC-123456789"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Expiry Date</label>
                    <input
                      type="date"
                      value={workersCompExpiryDate}
                      onChange={(e) => setWorkersCompExpiryDate(e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Upload Documents</label>
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleWorkersCompFilesChange}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Upload workers comp certificates (PDF, JPG, PNG)
                    </p>
                  </div>
                </div>

                {profile.workersCompDocuments && profile.workersCompDocuments.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Existing Documents</label>
                    <div className="space-y-2">
                      {profile.workersCompDocuments.map((doc, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 bg-accent rounded">
                          <span className="text-sm">📄 {doc.split('/').pop()}</span>
                          <a href={doc} target="_blank" rel="noopener noreferrer" className="text-primary text-sm hover:underline">
                            View
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div>
                {workersCompProvider ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Provider</label>
                        <p className="text-base mt-1 font-medium">{workersCompProvider}</p>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Policy Number</label>
                        <p className="text-base mt-1 font-medium">{workersCompPolicyNumber}</p>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Expiry Date</label>
                        <p className={`text-base mt-1 font-medium ${
                          isInsuranceExpired(profile.workersCompExpiryDate) ? 'text-red-600' :
                          isInsuranceExpiring(profile.workersCompExpiryDate) ? 'text-yellow-600' : ''
                        }`}>
                          {formatDate(profile.workersCompExpiryDate)}
                          {isInsuranceExpired(profile.workersCompExpiryDate) && ' (Expired)'}
                          {isInsuranceExpiring(profile.workersCompExpiryDate) && ' (Expiring Soon)'}
                        </p>
                      </div>
                    </div>

                    {profile.workersCompDocuments && profile.workersCompDocuments.length > 0 && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Documents</label>
                        <div className="mt-2 space-y-2">
                          {profile.workersCompDocuments.map((doc, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-accent rounded-lg">
                              <span className="text-sm font-medium">📄 {doc.split('/').pop()}</span>
                              <a 
                                href={doc} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-primary text-sm hover:underline"
                              >
                                View Document
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <div className="text-4xl mb-2">🏥</div>
                    <p>No workers compensation information provided</p>
                    <p className="text-sm mt-1">Add your workers comp details if applicable</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Certifications */}
        <div className="bg-card rounded-lg border border-border">
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Certifications</h2>
              {isEditing && (
                <Button variant="outline" onClick={addCertification} size="sm">
                  + Add Certification
                </Button>
              )}
            </div>
          </div>
          <div className="p-6">
            {isEditing ? (
              <div className="space-y-4">
                {certifications.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <div className="text-4xl mb-2">🎓</div>
                    <p>No certifications added</p>
                    <p className="text-sm mt-1">Click &quot;Add Certification&quot; to get started</p>
                  </div>
                ) : (
                  certifications.map((cert, index) => (
                    <div key={index} className="p-4 border border-border rounded-lg space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">Certification #{index + 1}</h3>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeCertification(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Remove
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Certification Name *</label>
                          <input
                            type="text"
                            value={cert.name}
                            onChange={(e) => updateCertification(index, 'name', e.target.value)}
                            className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="e.g., ADA-Certified Contractor"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Issuing Organization *</label>
                          <input
                            type="text"
                            value={cert.issuer}
                            onChange={(e) => updateCertification(index, 'issuer', e.target.value)}
                            className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="e.g., ADA National Network"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Issue Date *</label>
                          <input
                            type="date"
                            value={cert.issueDate}
                            onChange={(e) => updateCertification(index, 'issueDate', e.target.value)}
                            className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Expiry Date (Optional)</label>
                          <input
                            type="date"
                            value={cert.expiryDate || ''}
                            onChange={(e) => updateCertification(index, 'expiryDate', e.target.value)}
                            className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div>
                {certifications.length > 0 ? (
                  <div className="space-y-4">
                    {certifications.map((cert, index) => (
                      <div key={index} className="p-4 bg-accent rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="font-semibold text-lg">{cert.name}</h3>
                              {cert.verified && (
                                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                  ✓ Verified
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              Issued by {cert.issuer}
                            </p>
                            <div className="flex items-center space-x-4 text-sm">
                              <span>
                                <span className="text-muted-foreground">Issued:</span>{' '}
                                <span className="font-medium">{formatDate(cert.issueDate)}</span>
                              </span>
                              {cert.expiryDate && (
                                <span className={
                                  isInsuranceExpired(cert.expiryDate) ? 'text-red-600' :
                                  isInsuranceExpiring(cert.expiryDate) ? 'text-yellow-600' : ''
                                }>
                                  <span className="text-muted-foreground">Expires:</span>{' '}
                                  <span className="font-medium">{formatDate(cert.expiryDate)}</span>
                                  {isInsuranceExpired(cert.expiryDate) && ' (Expired)'}
                                  {isInsuranceExpiring(cert.expiryDate) && ' (Expiring Soon)'}
                                </span>
                              )}
                            </div>
                          </div>
                          {cert.documentUrl && (
                            <a 
                              href={cert.documentUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-primary hover:underline text-sm"
                            >
                              View Certificate
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <div className="text-4xl mb-2">🎓</div>
                    <p>No certifications added</p>
                    <p className="text-sm mt-1">Add certifications to boost your profile credibility</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Save/Cancel Buttons */}
        {isEditing && (
          <div className="flex items-center justify-end space-x-4">
            <Button
              variant="outline"
              onClick={handleCancelEdit}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveProfile}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
