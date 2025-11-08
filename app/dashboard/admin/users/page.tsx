'use client';

import { useState, useEffect } from 'react';
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
  businessName: string | null;
  businessAddress: string | null;
  licenseNumber: string | null;
  serviceType: string | null;
  yearsOfExperience: number | null;
  createdAt: string;
  updatedAt: string;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'CUSTOMER' | 'PROVIDER' | 'ADMIN'>('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'bg-red-100 text-red-800';
      case 'PROVIDER': return 'bg-blue-100 text-blue-800';
      case 'CUSTOMER': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredUsers = filter === 'all' 
    ? users 
    : users.filter(user => user.role === filter);

  // Calculate summary stats
  const totalUsers = users.length;
  const customerCount = users.filter(u => u.role === 'CUSTOMER').length;
  const providerCount = users.filter(u => u.role === 'PROVIDER').length;
  const adminCount = users.filter(u => u.role === 'ADMIN').length;
  const recentUsers = users.filter(u => {
    const created = new Date(u.createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - created.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  }).length;

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading users...</p>
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
          <div>
            <h1 className="text-3xl font-bold text-foreground">Users Management</h1>
            <p className="text-muted-foreground mt-1">Manage all platform users and their roles</p>
          </div>
          <Button>
            Add New User
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-sm font-medium text-muted-foreground">Total Users</h3>
            <p className="text-3xl font-bold text-primary mt-2">{totalUsers}</p>
            <p className="text-sm text-muted-foreground mt-1">All registered users</p>
          </div>
          
          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-sm font-medium text-muted-foreground">Customers</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">{customerCount}</p>
            <p className="text-sm text-muted-foreground mt-1">Service seekers</p>
          </div>
          
          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-sm font-medium text-muted-foreground">Providers</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">{providerCount}</p>
            <p className="text-sm text-muted-foreground mt-1">Service providers</p>
          </div>
          
          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-sm font-medium text-muted-foreground">Admins</h3>
            <p className="text-3xl font-bold text-red-600 mt-2">{adminCount}</p>
            <p className="text-sm text-muted-foreground mt-1">System administrators</p>
          </div>
          
          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-sm font-medium text-muted-foreground">New This Week</h3>
            <p className="text-3xl font-bold text-purple-600 mt-2">{recentUsers}</p>
            <p className="text-sm text-muted-foreground mt-1">Last 7 days</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              All ({totalUsers})
            </Button>
            <Button
              variant={filter === 'CUSTOMER' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('CUSTOMER')}
            >
              Customers ({customerCount})
            </Button>
            <Button
              variant={filter === 'PROVIDER' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('PROVIDER')}
            >
              Providers ({providerCount})
            </Button>
            <Button
              variant={filter === 'ADMIN' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('ADMIN')}
            >
              Admins ({adminCount})
            </Button>
          </div>
        </div>

        {/* Users Table - Desktop */}
        <div className="hidden lg:block bg-card rounded-lg border border-border overflow-hidden">
          <div className="w-full">
            <table className="w-full table-fixed">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-3 font-medium text-muted-foreground w-[6%]">ID</th>
                  <th className="text-left p-3 font-medium text-muted-foreground w-[22%]">Name</th>
                  <th className="text-left p-3 font-medium text-muted-foreground w-[25%]">Contact</th>
                  <th className="text-left p-3 font-medium text-muted-foreground w-[20%]">Business Info</th>
                  <th className="text-left p-3 font-medium text-muted-foreground w-[10%]">Role</th>
                  <th className="text-left p-3 font-medium text-muted-foreground w-[12%]">Joined</th>
                  <th className="text-left p-3 font-medium text-muted-foreground w-[5%]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-muted-foreground">
                      {filter === 'all' ? 'No users found' : `No ${filter.toLowerCase()} users found`}
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="border-t border-border hover:bg-muted/25">
                      <td className="p-3 font-mono text-xs text-muted-foreground">
                        <div className="truncate" title={user.id}>
                          #{user.id.slice(-4)}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="space-y-1">
                          <p className="font-medium text-sm truncate" title={`${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username}>
                            {user.firstName && user.lastName 
                              ? `${user.firstName} ${user.lastName}`
                              : user.username
                            }
                          </p>
                          <p className="text-xs text-muted-foreground truncate" title={user.username}>
                            @{user.username}
                          </p>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="space-y-1">
                          <p className="text-sm truncate" title={user.email}>
                            {user.email}
                          </p>
                          {user.phone && (
                            <p className="text-xs text-muted-foreground truncate" title={user.phone}>
                              {user.phone}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="p-3">
                        {user.role === 'PROVIDER' && user.businessName ? (
                          <div className="space-y-1">
                            <p className="text-sm font-medium truncate" title={user.businessName}>
                              {user.businessName}
                            </p>
                            {user.serviceType && (
                              <p className="text-xs text-muted-foreground truncate">
                                {user.serviceType.replace('_', ' ').toLowerCase()}
                              </p>
                            )}
                            {user.yearsOfExperience && (
                              <p className="text-xs text-muted-foreground">
                                {user.yearsOfExperience}+ years exp.
                              </p>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">-</span>
                        )}
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                          {user.role.toLowerCase()}
                        </span>
                      </td>
                      <td className="p-3 text-xs text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          year: '2-digit'
                        })}
                      </td>
                      <td className="p-3">
                        <Link href={`/dashboard/admin/users/${user.id}`}>
                          <Button variant="outline" size="sm" className="text-xs px-2 py-1 h-8 w-full">
                            View
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Users Cards - Mobile/Tablet */}
        <div className="lg:hidden space-y-4">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              {filter === 'all' ? 'No users found' : `No ${filter.toLowerCase()} users found`}
            </div>
          ) : (
            filteredUsers.map((user) => (
              <div key={user.id} className="bg-card rounded-lg border border-border p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-mono text-xs text-muted-foreground">
                        #{user.id.slice(-4)}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                        {user.role.toLowerCase()}
                      </span>
                    </div>
                    <h3 className="font-medium text-sm truncate">
                      {user.firstName && user.lastName 
                        ? `${user.firstName} ${user.lastName}`
                        : user.username
                      }
                    </h3>
                    <p className="text-xs text-muted-foreground truncate">
                      @{user.username}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div>
                    <p className="text-sm truncate" title={user.email}>
                      {user.email}
                    </p>
                    {user.phone && (
                      <p className="text-xs text-muted-foreground">
                        {user.phone}
                      </p>
                    )}
                  </div>
                  
                  {user.role === 'PROVIDER' && user.businessName && (
                    <div className="pt-2 border-t border-border">
                      <p className="text-sm font-medium truncate">
                        {user.businessName}
                      </p>
                      {user.serviceType && (
                        <p className="text-xs text-muted-foreground">
                          {user.serviceType.replace('_', ' ').toLowerCase()}
                        </p>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <span className="text-xs text-muted-foreground">
                    Joined {new Date(user.createdAt).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric',
                      year: '2-digit'
                    })}
                  </span>
                  <Link href={`/dashboard/admin/users/${user.id}`}>
                    <Button variant="outline" size="sm" className="text-xs px-3 py-1 h-8">
                      View
                    </Button>
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Empty State */}
        {users.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">👥</div>
            <h3 className="text-lg font-medium mb-2">No users yet</h3>
            <p className="text-muted-foreground">Registered users will appear here.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}