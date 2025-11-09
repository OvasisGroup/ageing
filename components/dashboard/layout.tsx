'use client';

import { useState, useEffect } from 'react';
import DashboardSidebar from './sidebar';
import DashboardNavbar from './navbar';

type User = {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  businessName?: string;
};

type UserRole = 'CUSTOMER' | 'PROVIDER' | 'ADMIN' | 'FAMILY_MEMBER' | 'CAREGIVER';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [user, setUser] = useState<User | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get user data from localStorage (in production, use secure session management)
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        // Use setTimeout to avoid synchronous setState in effect
        setTimeout(() => {
          setUser(parsedUser);
          setIsLoading(false);
        }, 0);
      } catch (error) {
        console.error('Error parsing user data:', error);
        // Redirect to login if user data is invalid
        window.location.href = '/login';
      }
    } else {
      // Redirect to login if no user data
      window.location.href = '/login';
    }
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
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

  if (!user) {
    return null; // This will be handled by the redirect above
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <DashboardSidebar
        userRole={user.role as UserRole}
        isOpen={sidebarOpen}
        onClose={closeSidebar}
      />

      {/* Main content area */}
      <div className="min-h-screen flex flex-col lg:ml-64">
        {/* Top Navbar */}
        <DashboardNavbar
          user={user}
          onToggleSidebar={toggleSidebar}
        />

        {/* Page content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}