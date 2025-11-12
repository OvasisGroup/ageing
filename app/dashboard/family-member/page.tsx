'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import DashboardLayout from '@/components/dashboard/layout';
import toast from 'react-hot-toast';

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  dateOfBirth: Date | null;
}

export default function FamilyMemberDashboard() {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCustomerInfo();
  }, []);

  const fetchCustomerInfo = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      const response = await fetch('/api/dashboard/subrole/customer-info', {
        headers: {
          'x-user-id': user.id
        }
      });

      if (response.ok) {
        const data = await response.json();
        setCustomer(data.customer);
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to load customer information');
      }
    } catch (error) {
      console.error('Error fetching customer info:', error);
      toast.error('Failed to load customer information');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Family Member Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            {customer ? `Managing care for ${customer.firstName} ${customer.lastName}` : 'View and manage family member information'}
          </p>
        </div>

        {/* Customer Info Banner */}
        {customer && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">👤 Managing Care For</h3>
                <p className="text-lg font-bold text-blue-900">{customer.firstName} {customer.lastName}</p>
                <p className="text-sm text-blue-700 mt-1">{customer.email}</p>
                {customer.phone && (
                  <p className="text-sm text-blue-700">{customer.phone}</p>
                )}
              </div>
              <Button onClick={() => toast.success('Feature coming soon!')}>
                View Full Profile
              </Button>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading customer information...</p>
          </div>
        )}

        {/* Quick Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-lg font-semibold mb-2">Upcoming Appointments</h3>
            <p className="text-3xl font-bold text-primary">0</p>
            <p className="text-sm text-muted-foreground">Next 30 days</p>
          </div>
          
          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-lg font-semibold mb-2">Active Services</h3>
            <p className="text-3xl font-bold text-blue-600">0</p>
            <p className="text-sm text-muted-foreground">Currently in use</p>
          </div>
          
          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-lg font-semibold mb-2">Messages</h3>
            <p className="text-3xl font-bold text-green-600">0</p>
            <p className="text-sm text-muted-foreground">Unread messages</p>
          </div>
        </div>

        {/* Recent Updates */}
        <div className="bg-card p-6 rounded-lg border border-border">
          <h2 className="text-xl font-semibold mb-4">Recent Updates</h2>
          <div className="text-center py-8 text-muted-foreground">
            <p>No recent updates to display</p>
            <p className="text-sm mt-2">You&apos;ll see family member care updates here</p>
          </div>
        </div>

        {/* Access Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">👋 Family Member Access</h3>
          <p className="text-sm text-blue-800">
            You can monitor and order services on behalf of {customer?.firstName || 'your family member'}. 
            All appointments, service requests, and communications will be managed under their account.
            {customer && ` Contact ${customer.firstName} or the account administrator if you need additional permissions.`}
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
