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

export default function CaregiverDashboard() {
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
          <h1 className="text-3xl font-bold">Caregiver Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            {customer ? `Providing care for ${customer.firstName} ${customer.lastName}` : 'Manage care and track patient progress'}
          </p>
        </div>

        {/* Customer Info Banner */}
        {customer && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-green-900 mb-1">🩺 Patient Under Care</h3>
                <p className="text-lg font-bold text-green-900">{customer.firstName} {customer.lastName}</p>
                <p className="text-sm text-green-700 mt-1">{customer.email}</p>
                {customer.phone && (
                  <p className="text-sm text-green-700">{customer.phone}</p>
                )}
              </div>
              <Button onClick={() => toast.success('Feature coming soon!')}>
                View Patient Profile
              </Button>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading patient information...</p>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-lg font-semibold mb-2">Today&apos;s Tasks</h3>
            <p className="text-3xl font-bold text-primary">0</p>
            <p className="text-sm text-muted-foreground">Pending tasks</p>
          </div>
          
          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-lg font-semibold mb-2">Appointments</h3>
            <p className="text-3xl font-bold text-blue-600">0</p>
            <p className="text-sm text-muted-foreground">This week</p>
          </div>
          
          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-lg font-semibold mb-2">Active Patients</h3>
            <p className="text-3xl font-bold text-green-600">1</p>
            <p className="text-sm text-muted-foreground">Under your care</p>
          </div>

          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-lg font-semibold mb-2">Messages</h3>
            <p className="text-3xl font-bold text-orange-600">0</p>
            <p className="text-sm text-muted-foreground">Unread</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-card p-6 rounded-lg border border-border">
          <h2 className="text-xl font-semibold mb-4">Care Management for {customer?.firstName || 'Patient'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button className="h-20 flex flex-col items-center justify-center">
              <span className="text-lg mb-1">�</span>
              Order Care Services
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <span className="text-lg mb-1">📅</span>
              Schedule Appointment
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <span className="text-lg mb-1">�</span>
              Log Care Notes
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <span className="text-lg mb-1">�</span>
              Medication Log
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-3 text-center">
            Managing care and services for {customer?.firstName || 'your patient'}
          </p>
        </div>

        {/* Today's Schedule */}
        <div className="bg-card p-6 rounded-lg border border-border">
          <h2 className="text-xl font-semibold mb-4">Today&apos;s Schedule</h2>
          <div className="text-center py-8 text-muted-foreground">
            <p>No appointments scheduled for today</p>
            <p className="text-sm mt-2">Check back tomorrow or view your full schedule</p>
          </div>
        </div>

        {/* Care Notes */}
        <div className="bg-card p-6 rounded-lg border border-border">
          <h2 className="text-xl font-semibold mb-4">Recent Care Notes</h2>
          <div className="text-center py-8 text-muted-foreground">
            <p>No care notes recorded yet</p>
            <p className="text-sm mt-2">Start logging care activities and observations</p>
          </div>
        </div>

        {/* Access Information */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-semibold text-green-900 mb-2">🩺 Professional Caregiver Access</h3>
          <p className="text-sm text-green-800">
            You can monitor patient health, order necessary care services, and schedule appointments on behalf of {customer?.firstName || 'your patient'}. 
            All care activities, service orders, and medical notes are logged under their account for complete tracking.
            {customer && ` Your permissions are managed by ${customer.firstName} or the account administrator.`}
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
