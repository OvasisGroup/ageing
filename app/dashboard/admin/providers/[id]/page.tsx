'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import DashboardLayout from '@/components/dashboard/layout';
import EditUserModal from '@/components/admin/edit-user-modal';
import DeleteUserModal from '@/components/admin/delete-user-modal';

type User = {
  id: string;
  username: string;
  email: string;
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
  createdAt: string;
  updatedAt: string;
};

type Provider = User;

export default function AdminProviderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const providerId = params.id as string;
  
  const [provider, setProvider] = useState<Provider | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const fetchProvider = useCallback(async () => {
    try {
      const response = await fetch(`/api/admin/providers/${providerId}`);
      if (response.ok) {
        const data = await response.json();
        setProvider(data);
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

  const handleProviderUpdated = (updatedUser: User) => {
    setProvider(updatedUser);
  };

  const handleProviderDeleted = () => {
    router.push('/dashboard/admin/providers');
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
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                {provider.firstName && provider.lastName 
                  ? `${provider.firstName} ${provider.lastName}`
                  : provider.username
                }
              </h1>
              <p className="text-muted-foreground mt-1">
                Provider ID: {provider.id}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getServiceTypeColor(provider.serviceType)}`}>
              {formatServiceType(provider.serviceType)}
            </span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowEditModal(true)}
            >
              Edit Provider
            </Button>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => setShowDeleteModal(true)}
            >
              Delete Provider
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
    </DashboardLayout>
  );
}