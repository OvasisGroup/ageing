'use client';

import { Button } from '@/components/ui/button';
import DashboardLayout from '@/components/dashboard/layout';

export default function ProviderDashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-lg font-semibold mb-2">Active Clients</h3>
            <p className="text-3xl font-bold text-primary">0</p>
            <p className="text-sm text-muted-foreground">Currently serving</p>
          </div>
          
          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-lg font-semibold mb-2">Today&apos;s Appointments</h3>
            <p className="text-3xl font-bold text-blue-600">0</p>
            <p className="text-sm text-muted-foreground">Scheduled for today</p>
          </div>
          
          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-lg font-semibold mb-2">Monthly Earnings</h3>
            <p className="text-3xl font-bold text-green-600">$0</p>
            <p className="text-sm text-muted-foreground">This month</p>
          </div>
          
          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-lg font-semibold mb-2">Rating</h3>
            <p className="text-3xl font-bold text-yellow-600">⭐ 0.0</p>
            <p className="text-sm text-muted-foreground">Average rating</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-card p-6 rounded-lg border border-border">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button className="h-20 flex flex-col items-center justify-center">
              <span className="text-lg mb-1">👥</span>
              Manage Clients
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <span className="text-lg mb-1">📅</span>
              Schedule
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <span className="text-lg mb-1">💬</span>
              Messages
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <span className="text-lg mb-1">📊</span>
              Reports
            </Button>
          </div>
        </div>

        {/* Service Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card p-6 rounded-lg border border-border">
            <h2 className="text-xl font-semibold mb-4">Service Information</h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-muted-foreground">Service Type</label>
                <p className="font-medium">Home Care Services</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Business Name</label>
                <p className="font-medium">Caring Hands Services</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Status</label>
                <p className="font-medium text-green-600">Active</p>
              </div>
            </div>
          </div>

          <div className="bg-card p-6 rounded-lg border border-border">
            <h2 className="text-xl font-semibold mb-4">Recent Bookings</h2>
            <div className="text-center py-8 text-muted-foreground">
              <p>No recent bookings</p>
              <p className="text-sm mt-2">New client requests will appear here</p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-card p-6 rounded-lg border border-border">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="text-center py-8 text-muted-foreground">
            <p>No recent activity to display</p>
            <p className="text-sm mt-2">Activity with clients will appear here</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}