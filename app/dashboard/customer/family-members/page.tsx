'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import DashboardLayout from '@/components/dashboard/layout';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface SubRoleUser {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  subRole: 'FAMILY_MEMBER' | 'CAREGIVER';
  permissions: string[];
  createdAt: string;
}

export default function FamilyMembersPage() {
  const [subRoleUsers, setSubRoleUsers] = useState<SubRoleUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    subRole: 'FAMILY_MEMBER' as 'FAMILY_MEMBER' | 'CAREGIVER',
    permissions: [] as string[],
  });

  // Get current user ID from session/auth context
  const getCurrentUserId = () => {
    // TODO: Replace with actual auth context
    // For now, this is a placeholder
    return 'current-user-id';
  };

  const fetchSubRoleUsers = async () => {
    try {
      setIsLoading(true);
      const parentUserId = getCurrentUserId();
      const response = await fetch(`/api/dashboard/customer/subroles?parentUserId=${parentUserId}`);
      
      if (response.ok) {
        const data = await response.json();
        setSubRoleUsers(data.subRoleUsers);
      } else {
        toast.error('Failed to fetch family members and caregivers');
      }
    } catch (error) {
      console.error('Error fetching subrole users:', error);
      toast.error('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubRoleUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePermissionToggle = (permission: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission],
    }));
  };

  const handleAddSubRoleUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/dashboard/customer/subroles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          parentUserId: getCurrentUserId(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
        setShowAddModal(false);
        setFormData({
          username: '',
          email: '',
          password: '',
          firstName: '',
          lastName: '',
          phone: '',
          subRole: 'FAMILY_MEMBER',
          permissions: [],
        });
        fetchSubRoleUsers();
      } else {
        toast.error(data.error || 'Failed to add user');
      }
    } catch (error) {
      console.error('Error adding subrole user:', error);
      toast.error('An error occurred');
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm('Are you sure you want to remove this user?')) return;

    try {
      const response = await fetch(`/api/dashboard/customer/subroles/${id}?parentUserId=${getCurrentUserId()}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('User removed successfully');
        fetchSubRoleUsers();
      } else {
        toast.error('Failed to remove user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('An error occurred');
    }
  };

  const availablePermissions = [
    'view_appointments',
    'manage_appointments',
    'view_medical_records',
    'view_billing',
    'manage_billing',
    'contact_providers',
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Family Members & Caregivers</h1>
            <p className="text-muted-foreground mt-1">Manage access for family members and caregivers</p>
          </div>
          <Button onClick={() => setShowAddModal(true)}>
            Add Member
          </Button>
        </div>

        {/* List of subrole users */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        ) : subRoleUsers.length === 0 ? (
          <div className="bg-card border border-border rounded-lg p-12 text-center">
            <p className="text-muted-foreground mb-4">No family members or caregivers added yet</p>
            <Button onClick={() => setShowAddModal(true)}>Add Your First Member</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subRoleUsers.map((user) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border border-border rounded-lg p-6 space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{user.firstName} {user.lastName}</h3>
                    <p className="text-sm text-muted-foreground">@{user.username}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    user.subRole === 'FAMILY_MEMBER' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {user.subRole === 'FAMILY_MEMBER' ? 'Family' : 'Caregiver'}
                  </span>
                </div>
                
                <div className="space-y-2 text-sm">
                  <p className="flex items-center gap-2">
                    <span className="text-muted-foreground">Email:</span>
                    <span>{user.email}</span>
                  </p>
                  {user.phone && (
                    <p className="flex items-center gap-2">
                      <span className="text-muted-foreground">Phone:</span>
                      <span>{user.phone}</span>
                    </p>
                  )}
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Permissions:</p>
                  <div className="flex flex-wrap gap-2">
                    {user.permissions.length > 0 ? (
                      user.permissions.map((perm) => (
                        <span key={perm} className="px-2 py-1 bg-muted rounded text-xs">
                          {perm.replace(/_/g, ' ')}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-muted-foreground">No permissions set</span>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toast('Edit functionality coming soon')}
                    className="flex-1"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    Remove
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Add Modal */}
        <AnimatePresence>
          {showAddModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowAddModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-background rounded-lg p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-2xl font-bold mb-4">Add Family Member or Caregiver</h2>
                
                <form onSubmit={handleAddSubRoleUser} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Role Type</label>
                    <select
                      name="subRole"
                      value={formData.subRole}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-input bg-background px-3 py-2"
                      required
                    >
                      <option value="FAMILY_MEMBER">Family Member</option>
                      <option value="CAREGIVER">Caregiver</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full rounded-md border border-input bg-background px-3 py-2"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full rounded-md border border-input bg-background px-3 py-2"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Username</label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-input bg-background px-3 py-2"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-input bg-background px-3 py-2"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Phone (optional)</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-input bg-background px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Password</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-input bg-background px-3 py-2"
                      required
                      minLength={8}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Permissions</label>
                    <div className="space-y-2">
                      {availablePermissions.map((perm) => (
                        <label key={perm} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={formData.permissions.includes(perm)}
                            onChange={() => handlePermissionToggle(perm)}
                            className="rounded border-input"
                          />
                          <span className="text-sm">{perm.replace(/_/g, ' ')}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={() => setShowAddModal(false)} className="flex-1">
                      Cancel
                    </Button>
                    <Button type="submit" className="flex-1">
                      Add Member
                    </Button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
