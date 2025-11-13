'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import DashboardLayout from '@/components/dashboard/layout';
import EditUserModal from '@/components/admin/edit-user-modal';
import DeleteUserModal from '@/components/admin/delete-user-modal';
import toast from 'react-hot-toast';

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

export default function AdminProvidersPage() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'HOME_CARE' | 'MEDICAL_CARE' | 'COMPANIONSHIP' | 'HOUSEKEEPING' | 'TRANSPORTATION' | 'OTHER'>('all');
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      const response = await fetch('/api/admin/providers');
      if (response.ok) {
        const data = await response.json();
        setProviders(Array.isArray(data) ? data : []);
      } else {
        toast.error('Failed to load providers');
        setProviders([]);
      }
    } catch (error) {
      console.error('Error fetching providers:', error);
      toast.error('Failed to load providers');
      setProviders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEditProvider = (provider: Provider) => {
    setSelectedProvider(provider);
    setShowEditModal(true);
  };

  const handleDeleteProvider = (provider: Provider) => {
    setSelectedProvider(provider);
    setShowDeleteModal(true);
  };

  const handleProviderUpdated = (updatedUser: User) => {
    setProviders(providers.map(provider => provider.id === updatedUser.id ? updatedUser : provider));
    setShowEditModal(false);
    setSelectedProvider(null);
  };

  const handleProviderDeleted = (deletedProviderId: string) => {
    setProviders(providers.filter(provider => provider.id !== deletedProviderId));
    setShowDeleteModal(false);
    setSelectedProvider(null);
    toast.success('Provider list updated');
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

  const filteredProviders = Array.isArray(providers) ? providers.filter(provider => {
    if (filter === 'all') return true;
    return provider.serviceType === filter;
  }) : [];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading providers...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Service Providers</h1>
            <p className="text-muted-foreground mt-2">
              Manage service providers and their business information
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={fetchProviders}>
              🔄 Refresh
            </Button>
            <Button>
              + Add Provider
            </Button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-sm font-medium text-muted-foreground">Total Providers</h3>
            <p className="text-3xl font-bold text-primary mt-2">{Array.isArray(providers) ? providers.length : 0}</p>
            <p className="text-sm text-muted-foreground mt-1">Registered providers</p>
          </div>
          
          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-sm font-medium text-muted-foreground">Home Care</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">
              {Array.isArray(providers) ? providers.filter(p => p.serviceType === 'HOME_CARE').length : 0}
            </p>
            <p className="text-sm text-muted-foreground mt-1">Providers</p>
          </div>
          
          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-sm font-medium text-muted-foreground">Medical Care</h3>
            <p className="text-3xl font-bold text-red-600 mt-2">
              {Array.isArray(providers) ? providers.filter(p => p.serviceType === 'MEDICAL_CARE').length : 0}
            </p>
            <p className="text-sm text-muted-foreground mt-1">Providers</p>
          </div>
          
          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-sm font-medium text-muted-foreground">Average Experience</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {Array.isArray(providers) && providers.length > 0 
                ? Math.round(providers.reduce((sum, p) => sum + (p.yearsOfExperience || 0), 0) / providers.length)
                : 0
              }
            </p>
            <p className="text-sm text-muted-foreground mt-1">Years</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            All ({Array.isArray(providers) ? providers.length : 0})
          </Button>
          <Button
            variant={filter === 'HOME_CARE' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('HOME_CARE')}
          >
            Home Care ({Array.isArray(providers) ? providers.filter(p => p.serviceType === 'HOME_CARE').length : 0})
          </Button>
          <Button
            variant={filter === 'MEDICAL_CARE' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('MEDICAL_CARE')}
          >
            Medical Care ({Array.isArray(providers) ? providers.filter(p => p.serviceType === 'MEDICAL_CARE').length : 0})
          </Button>
          <Button
            variant={filter === 'COMPANIONSHIP' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('COMPANIONSHIP')}
          >
            Companionship ({Array.isArray(providers) ? providers.filter(p => p.serviceType === 'COMPANIONSHIP').length : 0})
          </Button>
          <Button
            variant={filter === 'HOUSEKEEPING' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('HOUSEKEEPING')}
          >
            Housekeeping ({Array.isArray(providers) ? providers.filter(p => p.serviceType === 'HOUSEKEEPING').length : 0})
          </Button>
          <Button
            variant={filter === 'TRANSPORTATION' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('TRANSPORTATION')}
          >
            Transportation ({Array.isArray(providers) ? providers.filter(p => p.serviceType === 'TRANSPORTATION').length : 0})
          </Button>
          <Button
            variant={filter === 'OTHER' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('OTHER')}
          >
            Other ({Array.isArray(providers) ? providers.filter(p => p.serviceType === 'OTHER').length : 0})
          </Button>
        </div>

        {/* Providers Table - Desktop */}
        <div className="hidden lg:block">
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted/25">
                <tr>
                  <th className="text-left p-3 font-medium text-muted-foreground w-[8%]">ID</th>
                  <th className="text-left p-3 font-medium text-muted-foreground w-[20%]">Provider</th>
                  <th className="text-left p-3 font-medium text-muted-foreground w-[22%]">Business Info</th>
                  <th className="text-left p-3 font-medium text-muted-foreground w-[20%]">Contact</th>
                  <th className="text-left p-3 font-medium text-muted-foreground w-[15%]">Service Type</th>
                  <th className="text-left p-3 font-medium text-muted-foreground w-[10%]">Experience</th>
                  <th className="text-left p-3 font-medium text-muted-foreground w-[8%]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProviders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-muted-foreground">
                      {filter === 'all' ? 'No providers found' : `No ${formatServiceType(filter)} providers found`}
                    </td>
                  </tr>
                ) : (
                  filteredProviders.map((provider) => (
                    <tr key={provider.id} className="border-t border-border hover:bg-muted/25">
                      <td className="p-3 font-mono text-xs text-muted-foreground">
                        <div className="truncate" title={provider.id}>
                          #{provider.id.slice(-4)}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="space-y-1">
                          <p className="font-medium text-sm truncate" title={`${provider.firstName || ''} ${provider.lastName || ''}`.trim() || provider.username}>
                            {provider.firstName && provider.lastName 
                              ? `${provider.firstName} ${provider.lastName}`
                              : provider.username
                            }
                          </p>
                          <p className="text-xs text-muted-foreground truncate" title={provider.username}>
                            @{provider.username}
                          </p>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="space-y-1">
                          {provider.businessName ? (
                            <>
                              <p className="text-sm font-medium truncate" title={provider.businessName}>
                                {provider.businessName}
                              </p>
                              {provider.licenseNumber && (
                                <p className="text-xs text-muted-foreground truncate" title={provider.licenseNumber}>
                                  License: {provider.licenseNumber}
                                </p>
                              )}
                            </>
                          ) : (
                            <span className="text-xs text-muted-foreground">No business info</span>
                          )}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="space-y-1">
                          <p className="text-sm truncate" title={provider.email}>
                            {provider.email}
                          </p>
                          {provider.phone && (
                            <p className="text-xs text-muted-foreground truncate" title={provider.phone}>
                              {provider.phone}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getServiceTypeColor(provider.serviceType)}`}>
                          {formatServiceType(provider.serviceType)}
                        </span>
                      </td>
                      <td className="p-3 text-sm">
                        {provider.yearsOfExperience ? `${provider.yearsOfExperience} years` : '-'}
                      </td>
                      <td className="p-3">
                        <div className="flex space-x-1">
                          <Link href={`/dashboard/admin/providers/${provider.id}`}>
                            <Button variant="outline" size="sm" className="text-xs px-1 py-1 h-8 w-12" title="View Details">
                              👁️
                            </Button>
                          </Link>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-xs px-1 py-1 h-8 w-12" 
                            title="Edit Provider"
                            onClick={() => handleEditProvider(provider)}
                          >
                            ✏️
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-xs px-1 py-1 h-8 w-12 text-red-600 hover:text-red-700 hover:bg-red-50" 
                            title="Delete Provider"
                            onClick={() => handleDeleteProvider(provider)}
                          >
                            🗑️
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Providers Cards - Mobile/Tablet */}
        <div className="lg:hidden space-y-4">
          {filteredProviders.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              {filter === 'all' ? 'No providers found' : `No ${formatServiceType(filter)} providers found`}
            </div>
          ) : (
            filteredProviders.map((provider) => (
              <div key={provider.id} className="bg-card rounded-lg border border-border p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-mono text-xs text-muted-foreground">
                        #{provider.id.slice(-4)}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getServiceTypeColor(provider.serviceType)}`}>
                        {formatServiceType(provider.serviceType)}
                      </span>
                    </div>
                    <h3 className="font-medium text-sm truncate">
                      {provider.firstName && provider.lastName 
                        ? `${provider.firstName} ${provider.lastName}`
                        : provider.username
                      }
                    </h3>
                    <p className="text-xs text-muted-foreground truncate">
                      @{provider.username}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div>
                    <p className="text-sm truncate" title={provider.email}>
                      {provider.email}
                    </p>
                    {provider.phone && (
                      <p className="text-xs text-muted-foreground">
                        {provider.phone}
                      </p>
                    )}
                  </div>
                  
                  {provider.businessName && (
                    <div className="pt-2 border-t border-border">
                      <p className="text-sm font-medium truncate">
                        {provider.businessName}
                      </p>
                      {provider.yearsOfExperience && (
                        <p className="text-xs text-muted-foreground">
                          {provider.yearsOfExperience} years experience
                        </p>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <span className="text-xs text-muted-foreground">
                    Joined {new Date(provider.createdAt).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric',
                      year: '2-digit'
                    })}
                  </span>
                  <div className="flex space-x-2">
                    <Link href={`/dashboard/admin/providers/${provider.id}`}>
                      <Button variant="outline" size="sm" className="text-xs px-2 py-1 h-8" title="View">
                        👁️
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs px-2 py-1 h-8" 
                      title="Edit"
                      onClick={() => handleEditProvider(provider)}
                    >
                      ✏️
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs px-2 py-1 h-8 text-red-600 hover:text-red-700 hover:bg-red-50" 
                      title="Delete"
                      onClick={() => handleDeleteProvider(provider)}
                    >
                      🗑️
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Empty State */}
        {(!Array.isArray(providers) || providers.length === 0) && !loading && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏥</div>
            <h3 className="text-lg font-medium mb-2">No providers yet</h3>
            <p className="text-muted-foreground">Service providers will appear here when they register.</p>
          </div>
        )}
      </div>

      {/* Edit Provider Modal */}
      {selectedProvider && (
        <EditUserModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          user={selectedProvider}
          onUserUpdated={handleProviderUpdated}
        />
      )}

      {/* Delete Provider Modal */}
      {selectedProvider && (
        <DeleteUserModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          user={selectedProvider}
          onUserDeleted={handleProviderDeleted}
        />
      )}
    </DashboardLayout>
  );
}