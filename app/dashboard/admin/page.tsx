'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import DashboardLayout from '@/components/dashboard/layout';

export default function AdminDashboard() {
  const [totalInquiries, setTotalInquiries] = useState(0);
  const [loadingInquiries, setLoadingInquiries] = useState(true);

  useEffect(() => {
    fetchInquiriesCount();
  }, []);

  const fetchInquiriesCount = async () => {
    try {
      const response = await fetch('/api/inquiries');
      if (response.ok) {
        const data = await response.json();
        setTotalInquiries(data.length);
      }
    } catch (error) {
      console.error('Error fetching inquiries count:', error);
    } finally {
      setLoadingInquiries(false);
    }
  };
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* System Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-lg font-semibold mb-2">Total Users</h3>
            <p className="text-3xl font-bold text-primary">0</p>
            <p className="text-sm text-muted-foreground">Registered users</p>
          </div>
          
          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-lg font-semibold mb-2">Active Providers</h3>
            <p className="text-3xl font-bold text-blue-600">0</p>
            <p className="text-sm text-muted-foreground">Service providers</p>
          </div>
          
          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-lg font-semibold mb-2">Active Customers</h3>
            <p className="text-3xl font-bold text-green-600">0</p>
            <p className="text-sm text-muted-foreground">Customer accounts</p>
          </div>
          
          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-lg font-semibold mb-2">Total Inquiries</h3>
            <p className="text-3xl font-bold text-orange-600">
              {loadingInquiries ? (
                <span className="animate-pulse">...</span>
              ) : (
                totalInquiries
              )}
            </p>
            <p className="text-sm text-muted-foreground">Customer inquiries</p>
          </div>
        </div>

        {/* Admin Actions */}
        <div className="bg-card p-6 rounded-lg border border-border">
          <h2 className="text-xl font-semibold mb-4">Admin Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Link href="/dashboard/admin/users">
              <Button className="h-20 flex flex-col items-center justify-center w-full">
                <span className="text-lg mb-1">👥</span>
                Manage Users
              </Button>
            </Link>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <span className="text-lg mb-1">🏢</span>
              Manage Providers
            </Button>
            <Link href="/dashboard/admin/inquiries">
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center w-full"
              >
                <span className="text-lg mb-1">📧</span>
                Manage Inquiries
              </Button>
            </Link>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <span className="text-lg mb-1">📊</span>
              Analytics
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <span className="text-lg mb-1">⚙️</span>
              System Settings
            </Button>
          </div>
        </div>

        {/* Management Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card p-6 rounded-lg border border-border">
            <h2 className="text-xl font-semibold mb-4">Recent Registrations</h2>
            <div className="text-center py-8 text-muted-foreground">
              <p>No recent registrations</p>
              <p className="text-sm mt-2">New user registrations will appear here</p>
            </div>
          </div>

          <div className="bg-card p-6 rounded-lg border border-border">
            <h2 className="text-xl font-semibold mb-4">Pending Approvals</h2>
            <div className="text-center py-8 text-muted-foreground">
              <p>No pending approvals</p>
              <p className="text-sm mt-2">Provider applications awaiting approval will appear here</p>
            </div>
          </div>
        </div>

        {/* System Overview */}
        <div className="bg-card p-6 rounded-lg border border-border">
          <h2 className="text-xl font-semibold mb-4">System Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-2">99.9%</div>
              <div className="text-sm text-muted-foreground">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-2">0</div>
              <div className="text-sm text-muted-foreground">Active Sessions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 mb-2">0</div>
              <div className="text-sm text-muted-foreground">API Calls Today</div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}