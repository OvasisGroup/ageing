'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';

type User = {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  businessName?: string;
  serviceType?: string;
};

export default function ProviderDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: Implement session check
    // For now, we'll simulate loading user data
    const mockUser: User = {
      id: 1,
      username: 'provider1',
      email: 'provider@example.com',
      firstName: 'Jane',
      lastName: 'Smith',
      role: 'PROVIDER',
      businessName: 'Caring Hands Services',
      serviceType: 'HOME_CARE'
    };
    
    setTimeout(() => {
      setUser(mockUser);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleLogout = () => {
    // TODO: Implement actual logout
    toast.success('Logged out successfully');
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Dashboard Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-primary">Provider Portal</h1>
              <div className="text-muted-foreground">
                <p>Welcome back, {user?.firstName}!</p>
                <p className="text-sm">{user?.businessName}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-1 rounded">
                {user?.role}
              </span>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Quick Stats */}
          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-lg font-semibold mb-2">Active Clients</h3>
            <p className="text-3xl font-bold text-primary">0</p>
            <p className="text-sm text-muted-foreground">Currently serving</p>
          </div>
          
          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-lg font-semibold mb-2">Todays Appointments</h3>
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
        <div className="bg-card p-6 rounded-lg border border-border mb-8">
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-card p-6 rounded-lg border border-border">
            <h2 className="text-xl font-semibold mb-4">Service Information</h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-muted-foreground">Service Type</label>
                <p className="font-medium">{user?.serviceType?.replace('_', ' ') || 'Not specified'}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Business Name</label>
                <p className="font-medium">{user?.businessName || 'Not specified'}</p>
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
      </main>
    </div>
  );
}