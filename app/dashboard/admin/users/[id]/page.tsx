'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import DashboardLayout from '@/components/dashboard/layout';

type User = {
  id: string;
  username: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  role: 'CUSTOMER' | 'PROVIDER' | 'ADMIN';
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

export default function AdminUserDetailPage() {
  const params = useParams();
  const userId = params.id as string;
  
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setUser(data);
      } else if (response.status === 404) {
        setError('User not found');
      } else {
        setError('Failed to load user');
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      setError('Failed to load user');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchUser();
    }
  }, [userId, fetchUser]);

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'bg-red-100 text-red-800';
      case 'PROVIDER': return 'bg-blue-100 text-blue-800';
      case 'CUSTOMER': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatServiceType = (serviceType: string | null) => {
    if (!serviceType) return null;
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
            <p>Loading user details...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !user) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-6xl mb-4">❌</div>
            <h3 className="text-lg font-medium mb-2">{error || 'User not found'}</h3>
            <p className="text-muted-foreground mb-4">
              The user you are looking for doesn&apos;t exist or couldn&apos;t be loaded.
            </p>
            <Link href="/dashboard/admin/users">
              <Button variant="outline">
                Back to Users
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
            <Link href="/dashboard/admin/users">
              <Button variant="outline" size="sm">
                ← Back to Users
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                {user.firstName && user.lastName 
                  ? `${user.firstName} ${user.lastName}`
                  : user.username
                }
              </h1>
              <p className="text-muted-foreground mt-1">
                User ID: {user.id}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(user.role)}`}>
              {user.role.toLowerCase()}
            </span>
            <Button variant="outline" size="sm">
              Edit User
            </Button>
            <Button variant="destructive" size="sm">
              Delete User
            </Button>
          </div>
        </div>

        {/* User Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-sm font-medium text-muted-foreground">Account Status</h3>
            <p className="text-2xl font-bold text-green-600 mt-2">Active</p>
            <p className="text-sm text-muted-foreground mt-1">Registered user</p>
          </div>
          
          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-sm font-medium text-muted-foreground">Member Since</h3>
            <p className="text-2xl font-bold text-primary mt-2">
              {Math.ceil((new Date().getTime() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))}
            </p>
            <p className="text-sm text-muted-foreground mt-1">Days ago</p>
          </div>
          
          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-sm font-medium text-muted-foreground">Role</h3>
            <p className="text-2xl font-bold text-blue-600 mt-2">{user.role}</p>
            <p className="text-sm text-muted-foreground mt-1">User type</p>
          </div>
          
          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-sm font-medium text-muted-foreground">Contact Method</h3>
            <p className="text-2xl font-bold text-purple-600 mt-2">
              {user.phone ? 'Phone & Email' : 'Email Only'}
            </p>
            <p className="text-sm text-muted-foreground mt-1">Available</p>
          </div>
        </div>

        {/* User Details */}
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
                  {user.firstName && user.lastName 
                    ? `${user.firstName} ${user.lastName}`
                    : 'Not provided'
                  }
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Username</label>
                <p className="text-sm mt-1 font-mono">@{user.username}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                <p className="text-sm mt-1">
                  <a href={`mailto:${user.email}`} className="text-primary hover:underline">
                    {user.email}
                  </a>
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
                <p className="text-sm mt-1">
                  {user.phone ? (
                    <a href={`tel:${user.phone}`} className="text-primary hover:underline">
                      {user.phone}
                    </a>
                  ) : (
                    'Not provided'
                  )}
                </p>
              </div>
              
              {user.dateOfBirth && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Date of Birth</label>
                  <p className="text-sm mt-1">
                    {formatDateOnly(user.dateOfBirth)} 
                    <span className="text-muted-foreground ml-2">
                      (Age: {calculateAge(user.dateOfBirth)})
                    </span>
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Business Information (for Providers) */}
          {user.role === 'PROVIDER' && (
            <div className="bg-card rounded-lg border border-border">
              <div className="p-6 border-b border-border">
                <h2 className="text-xl font-semibold">Business Information</h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Business Name</label>
                  <p className="text-sm mt-1">{user.businessName || 'Not provided'}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Business Address</label>
                  <p className="text-sm mt-1">{user.businessAddress || 'Not provided'}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">License Number</label>
                  <p className="text-sm mt-1 font-mono">{user.licenseNumber || 'Not provided'}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Service Type</label>
                  <p className="text-sm mt-1">{formatServiceType(user.serviceType) || 'Not specified'}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Years of Experience</label>
                  <p className="text-sm mt-1">
                    {user.yearsOfExperience ? `${user.yearsOfExperience} years` : 'Not specified'}
                  </p>
                </div>
                
                {user.description && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Description</label>
                    <p className="text-sm mt-1 text-muted-foreground leading-relaxed">
                      {user.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Account Information (for non-providers or if provider info doesn't exist) */}
          {user.role !== 'PROVIDER' && (
            <div className="bg-card rounded-lg border border-border">
              <div className="p-6 border-b border-border">
                <h2 className="text-xl font-semibold">Account Information</h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Account Type</label>
                  <p className="text-sm mt-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                      {user.role.toLowerCase()}
                    </span>
                  </p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Registration Date</label>
                  <p className="text-sm mt-1">{formatDate(user.createdAt)}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
                  <p className="text-sm mt-1">{formatDate(user.updatedAt)}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Account Status</label>
                  <p className="text-sm mt-1">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Activity Timeline (Placeholder) */}
        <div className="bg-card rounded-lg border border-border">
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-semibold">Recent Activity</h2>
          </div>
          <div className="p-6">
            <div className="text-center py-8 text-muted-foreground">
              <div className="text-4xl mb-4">📊</div>
              <p>Activity tracking coming soon</p>
              <p className="text-sm mt-2">User activity and history will be displayed here</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-card rounded-lg border border-border">
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-semibold">Admin Actions</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
    </DashboardLayout>
  );
}