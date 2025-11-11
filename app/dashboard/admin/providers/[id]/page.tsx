'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import DashboardLayout from '@/components/dashboard/layout';
import EditUserModal from '@/components/admin/edit-user-modal';
import DeleteUserModal from '@/components/admin/delete-user-modal';
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

type User = {
  id: string;
  username: string;
  email: string;
  emailVerified: boolean;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  role: 'PROVIDER' | 'CUSTOMER' | 'ADMIN';
  dateOfBirth: string | null;
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

type Provider = User;

type VettedByAdmin = {
  id: string;
  username: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
} | null;

export default function AdminProviderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const providerId = params.id as string;
  
  const [provider, setProvider] = useState<Provider | null>(null);
  const [vettedByAdmin, setVettedByAdmin] = useState<VettedByAdmin>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const fetchProvider = useCallback(async () => {
    try {
      const userData = localStorage.getItem('user');
      const user = userData ? JSON.parse(userData) : null;

      const response = await fetch(`/api/admin/users/${providerId}/verify`, {
        headers: {
          'x-user-id': user?.id || '',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setProvider(data.user);
        setVettedByAdmin(data.vettedByAdmin);
      } else if (response.status === 404) {
        setError('Provider not found');
      } else {
        setError('Failed to load provider');
      }
    } catch (error) {
      console.error('Error fetching provider:', error);
      setError('Failed to load provider');
    } finally {
      setLoading(false);
    }
  }, [providerId]);

  useEffect(() => {
    if (providerId) {
      fetchProvider();
    }
  }, [providerId, fetchProvider]);

  const handleProviderUpdated = () => {
    fetchProvider(); // Refresh the provider data
  };

  const handleProviderDeleted = () => {
    router.push('/dashboard/admin/providers');
  };

  const handleUpdateVettedStatus = async (newStatus: VettedStatus, notes?: string) => {
    setUpdatingStatus(true);
    const loadingToast = toast.loading('Updating verification status...');

    try {
      const userData = localStorage.getItem('user');
      const user = userData ? JSON.parse(userData) : null;

      const response = await fetch(`/api/admin/users/${providerId}/verify`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user?.id || '',
        },
        body: JSON.stringify({
          vettedStatus: newStatus,
          notes,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setProvider(data.user);
        setShowVerificationModal(false);
        toast.success('Verification status updated successfully', {
          id: loadingToast,
        });
        fetchProvider(); // Refresh to get updated vettedByAdmin
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to update status', {
          id: loadingToast,
        });
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status', {
        id: loadingToast,
      });
    } finally {
      setUpdatingStatus(false);
    }
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

  const getServiceTypeColor = (serviceType: string | null) => {
    if (!serviceType) return 'bg-gray-100 text-gray-800';
    switch (serviceType) {
      case 'HOME_CARE': return 'bg-blue-100 text-blue-800';
      case 'MEDICAL_CARE': return 'bg-red-100 text-red-800';
      case 'COMPANIONSHIP': return 'bg-green-100 text-green-800';
      case 'HOUSEKEEPING': return 'bg-purple-100 text-purple-800';
      case 'TRANSPORTATION': return 'bg-yellow-100 text-yellow-800';
      case 'OTHER': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatServiceType = (serviceType: string | null) => {
    if (!serviceType) return 'Not specified';
    return serviceType.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDateOnly = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
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

  const calculateAge = (dateOfBirth: string) => {
    const birth = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading provider details...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !provider) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-6xl mb-4">❌</div>
            <h3 className="text-lg font-medium mb-2">{error || 'Provider not found'}</h3>
            <p className="text-muted-foreground mb-4">
              The provider you are looking for doesn&apos;t exist or couldn&apos;t be loaded.
            </p>
            <Link href="/dashboard/admin/providers">
              <Button variant="outline">
                Back to Providers
              </Button>
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard/admin/providers">
              <Button variant="outline" size="sm">
                ← Back to Providers
              </Button>
            </Link>
            <div className="flex items-center space-x-4">
              {provider.profilePhoto && (
                <div className="relative h-16 w-16 rounded-full overflow-hidden bg-gray-200">
                  <Image
                    src={provider.profilePhoto}
                    alt="Profile"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  {provider.firstName && provider.lastName 
                    ? `${provider.firstName} ${provider.lastName}`
                    : provider.username
                  }
                </h1>
                <p className="text-muted-foreground mt-1">
                  Provider ID: {provider.id} | {provider.email}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getVettedStatusBadge(provider.vettedStatus).className}`}>
              {getVettedStatusBadge(provider.vettedStatus).text}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getServiceTypeColor(provider.serviceType)}`}>
              {formatServiceType(provider.serviceType)}
            </span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowVerificationModal(true)}
            >
              Update Verification
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowEditModal(true)}
            >
              Edit
            </Button>
          </div>
        </div>

        {/* Provider Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-sm font-medium text-muted-foreground">Service Status</h3>
            <p className="text-2xl font-bold text-green-600 mt-2">Active</p>
            <p className="text-sm text-muted-foreground mt-1">Available for service</p>
          </div>
          
          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-sm font-medium text-muted-foreground">Member Since</h3>
            <p className="text-2xl font-bold text-primary mt-2">
              {Math.ceil((new Date().getTime() - new Date(provider.createdAt).getTime()) / (1000 * 60 * 60 * 24))}
            </p>
            <p className="text-sm text-muted-foreground mt-1">Days ago</p>
          </div>
          
          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-sm font-medium text-muted-foreground">Experience</h3>
            <p className="text-2xl font-bold text-blue-600 mt-2">
              {provider.yearsOfExperience || 0}
            </p>
            <p className="text-sm text-muted-foreground mt-1">Years</p>
          </div>
          
          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-sm font-medium text-muted-foreground">License Status</h3>
            <p className="text-2xl font-bold text-purple-600 mt-2">
              {provider.licenseNumber ? 'Licensed' : 'No License'}
            </p>
            <p className="text-sm text-muted-foreground mt-1">Verification status</p>
          </div>
        </div>

        {/* Provider Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Personal Information */}
          <div className="bg-card rounded-lg border border-border">
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-semibold">Personal Information</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                <p className="text-sm mt-1">
                  {provider.firstName && provider.lastName 
                    ? `${provider.firstName} ${provider.lastName}`
                    : 'Not provided'
                  }
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Username</label>
                <p className="text-sm mt-1 font-mono">@{provider.username}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                <p className="text-sm mt-1">
                  <a href={`mailto:${provider.email}`} className="text-primary hover:underline">
                    {provider.email}
                  </a>
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
                <p className="text-sm mt-1">
                  {provider.phone ? (
                    <a href={`tel:${provider.phone}`} className="text-primary hover:underline">
                      {provider.phone}
                    </a>
                  ) : (
                    'Not provided'
                  )}
                </p>
              </div>
              
              {provider.dateOfBirth && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Date of Birth</label>
                  <p className="text-sm mt-1">
                    {formatDateOnly(provider.dateOfBirth)} 
                    <span className="text-muted-foreground ml-2">
                      (Age: {calculateAge(provider.dateOfBirth)})
                    </span>
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Business Information */}
          <div className="bg-card rounded-lg border border-border">
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-semibold">Business Information</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Business Name</label>
                <p className="text-sm mt-1">{provider.businessName || 'Not provided'}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Business Address</label>
                <p className="text-sm mt-1">{provider.businessAddress || 'Not provided'}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">License Number</label>
                <p className="text-sm mt-1 font-mono">{provider.licenseNumber || 'Not provided'}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Service Type</label>
                <p className="text-sm mt-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getServiceTypeColor(provider.serviceType)}`}>
                    {formatServiceType(provider.serviceType)}
                  </span>
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Years of Experience</label>
                <p className="text-sm mt-1">
                  {provider.yearsOfExperience ? `${provider.yearsOfExperience} years` : 'Not specified'}
                </p>
              </div>
              
              {provider.description && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Service Description</label>
                  <p className="text-sm mt-1 text-muted-foreground leading-relaxed">
                    {provider.description}
                  </p>
                </div>
              )}
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Registration Date</label>
                <p className="text-sm mt-1">{formatDate(provider.createdAt)}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
                <p className="text-sm mt-1">{formatDate(provider.updatedAt)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Verification Status */}
        {provider.vettedStatus !== 'NOT_VETTED' && (
          <div className="bg-card rounded-lg border border-border">
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-semibold">Verification Status</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Current Status</label>
                  <p className="mt-1">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getVettedStatusBadge(provider.vettedStatus).className}`}>
                      {getVettedStatusBadge(provider.vettedStatus).text}
                    </span>
                  </p>
                </div>
                {provider.vettedAt && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Verified On</label>
                    <p className="text-sm mt-1 font-medium">{formatDate(provider.vettedAt)}</p>
                  </div>
                )}
                {vettedByAdmin && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Verified By</label>
                    <p className="text-sm mt-1 font-medium">
                      {vettedByAdmin.firstName && vettedByAdmin.lastName
                        ? `${vettedByAdmin.firstName} ${vettedByAdmin.lastName}`
                        : vettedByAdmin.username
                      } ({vettedByAdmin.email})
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Insurance Information */}
        <div className="bg-card rounded-lg border border-border">
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-semibold">Insurance Information</h2>
          </div>
          <div className="p-6">
            {provider.insuranceProvider ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Provider</label>
                    <p className="text-sm mt-1 font-medium">{provider.insuranceProvider}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Policy Number</label>
                    <p className="text-sm mt-1 font-medium">{provider.insurancePolicyNumber}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Expiry Date</label>
                    <p className={`text-sm mt-1 font-medium ${
                      isInsuranceExpired(provider.insuranceExpiryDate) ? 'text-red-600' :
                      isInsuranceExpiring(provider.insuranceExpiryDate) ? 'text-yellow-600' : ''
                    }`}>
                      {formatDateOnly(provider.insuranceExpiryDate || '')}
                      {isInsuranceExpired(provider.insuranceExpiryDate) && ' ⚠️ Expired'}
                      {isInsuranceExpiring(provider.insuranceExpiryDate) && ' ⚠️ Expiring Soon'}
                    </p>
                  </div>
                </div>

                {provider.insuranceDocuments && provider.insuranceDocuments.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Documents</label>
                    <div className="mt-2 space-y-2">
                      {provider.insuranceDocuments.map((doc, idx) => (
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
            {provider.workersCompProvider ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Provider</label>
                    <p className="text-sm mt-1 font-medium">{provider.workersCompProvider}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Policy Number</label>
                    <p className="text-sm mt-1 font-medium">{provider.workersCompPolicyNumber}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Expiry Date</label>
                    <p className={`text-sm mt-1 font-medium ${
                      isInsuranceExpired(provider.workersCompExpiryDate) ? 'text-red-600' :
                      isInsuranceExpiring(provider.workersCompExpiryDate) ? 'text-yellow-600' : ''
                    }`}>
                      {formatDateOnly(provider.workersCompExpiryDate || '')}
                      {isInsuranceExpired(provider.workersCompExpiryDate) && ' ⚠️ Expired'}
                      {isInsuranceExpiring(provider.workersCompExpiryDate) && ' ⚠️ Expiring Soon'}
                    </p>
                  </div>
                </div>

                {provider.workersCompDocuments && provider.workersCompDocuments.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Documents</label>
                    <div className="mt-2 space-y-2">
                      {provider.workersCompDocuments.map((doc, idx) => (
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
              </div>
            )}
          </div>
        </div>

        {/* Certifications */}
        <div className="bg-card rounded-lg border border-border">
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-semibold">Certifications</h2>
          </div>
          <div className="p-6">
            {provider.certifications && provider.certifications.length > 0 ? (
              <div className="space-y-4">
                {provider.certifications.map((cert, index) => (
                  <div key={index} className="p-4 bg-accent rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-base">{cert.name}</h3>
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
                            <span className="font-medium">{formatDateOnly(cert.issueDate)}</span>
                          </span>
                          {cert.expiryDate && (
                            <span className={
                              isInsuranceExpired(cert.expiryDate) ? 'text-red-600' :
                              isInsuranceExpiring(cert.expiryDate) ? 'text-yellow-600' : ''
                            }>
                              <span className="text-muted-foreground">Expires:</span>{' '}
                              <span className="font-medium">{formatDateOnly(cert.expiryDate)}</span>
                              {isInsuranceExpired(cert.expiryDate) && ' ⚠️ Expired'}
                              {isInsuranceExpiring(cert.expiryDate) && ' ⚠️ Expiring Soon'}
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
              </div>
            )}
          </div>
        </div>

        {/* Service Analytics (Placeholder) */}
        <div className="bg-card rounded-lg border border-border">
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-semibold">Service Analytics</h2>
          </div>
          <div className="p-6">
            <div className="text-center py-8 text-muted-foreground">
              <div className="text-4xl mb-4">📊</div>
              <p>Service analytics coming soon</p>
              <p className="text-sm mt-2">Booking history, ratings, and performance metrics will be displayed here</p>
            </div>
          </div>
        </div>

        {/* Admin Actions */}
        <div className="bg-card rounded-lg border border-border">
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-semibold">Admin Actions</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <Button 
                variant="outline" 
                className="h-16 flex flex-col items-center justify-center"
                onClick={() => setShowEditModal(true)}
              >
                <span className="text-lg mb-1">✏️</span>
                Edit Provider
              </Button>
              <Button 
                variant="outline" 
                className="h-16 flex flex-col items-center justify-center text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => setShowDeleteModal(true)}
              >
                <span className="text-lg mb-1">🗑️</span>
                Delete Provider
              </Button>
              <Button variant="outline" className="h-16 flex flex-col items-center justify-center">
                <span className="text-lg mb-1">📧</span>
                Send Message
              </Button>
              <Button variant="outline" className="h-16 flex flex-col items-center justify-center">
                <span className="text-lg mb-1">🔒</span>
                Reset Password
              </Button>
              <Button variant="outline" className="h-16 flex flex-col items-center justify-center">
                <span className="text-lg mb-1">⚠️</span>
                Suspend Account
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Provider Modal */}
      {provider && (
        <EditUserModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          user={provider}
          onUserUpdated={handleProviderUpdated}
        />
      )}

      {/* Delete Provider Modal */}
      {provider && (
        <DeleteUserModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          user={provider}
          onUserDeleted={handleProviderDeleted}
        />
      )}

      {/* Verification Modal */}
      {showVerificationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-card rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-semibold">Update Verification Status</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Provider</label>
                <p className="text-sm text-muted-foreground">
                  {provider?.firstName && provider?.lastName
                    ? `${provider.firstName} ${provider.lastName}`
                    : provider?.username
                  } ({provider?.email})
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Current Status</label>
                <p>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getVettedStatusBadge(provider?.vettedStatus || 'NOT_VETTED').className}`}>
                    {getVettedStatusBadge(provider?.vettedStatus || 'NOT_VETTED').text}
                  </span>
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">New Status *</label>
                <div className="space-y-2">
                  <button
                    onClick={() => handleUpdateVettedStatus('PENDING_REVIEW')}
                    disabled={updatingStatus || provider?.vettedStatus === 'PENDING_REVIEW'}
                    className="w-full px-4 py-3 text-left rounded-lg border border-border hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="font-medium">Pending Review</span>
                    <p className="text-xs text-muted-foreground mt-1">Mark for review by admin team</p>
                  </button>
                  <button
                    onClick={() => handleUpdateVettedStatus('VETTED')}
                    disabled={updatingStatus || provider?.vettedStatus === 'VETTED'}
                    className="w-full px-4 py-3 text-left rounded-lg border border-green-200 bg-green-50 hover:bg-green-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="font-medium text-green-800">✓ Approve & Verify</span>
                    <p className="text-xs text-green-700 mt-1">Provider meets all requirements</p>
                  </button>
                  <button
                    onClick={() => handleUpdateVettedStatus('REJECTED')}
                    disabled={updatingStatus || provider?.vettedStatus === 'REJECTED'}
                    className="w-full px-4 py-3 text-left rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="font-medium text-red-800">✕ Reject</span>
                    <p className="text-xs text-red-700 mt-1">Provider does not meet requirements</p>
                  </button>
                  <button
                    onClick={() => handleUpdateVettedStatus('NOT_VETTED')}
                    disabled={updatingStatus || provider?.vettedStatus === 'NOT_VETTED'}
                    className="w-full px-4 py-3 text-left rounded-lg border border-border hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="font-medium">Reset to Not Vetted</span>
                    <p className="text-xs text-muted-foreground mt-1">Clear verification status</p>
                  </button>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-border flex items-center justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowVerificationModal(false)}
                disabled={updatingStatus}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}