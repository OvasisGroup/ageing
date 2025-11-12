'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import DashboardLayout from '@/components/dashboard/layout';
import toast from 'react-hot-toast';

interface ServiceRequest {
  id: string;
  title: string;
  description: string;
  location: string;
  budget: number | null;
  serviceDate: string;
  status: string;
  createdAt: string;
  category: {
    id: string;
    title: string;
  };
  subcategory?: {
    id: string;
    title: string;
  } | null;
}

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  OPEN: 'bg-blue-100 text-blue-800 border-blue-200',
  IN_PROGRESS: 'bg-purple-100 text-purple-800 border-purple-200',
  COMPLETED: 'bg-green-100 text-green-800 border-green-200',
  CANCELLED: 'bg-red-100 text-red-800 border-red-200'
};

const statusLabels: Record<string, string> = {
  PENDING: 'Pending',
  OPEN: 'Open',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled'
};

export default function ServiceRequestsPage() {
  const router = useRouter();
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get user from localStorage
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      toast.error('Please log in to view service requests');
      router.push('/login');
      return;
    }

    const userData = JSON.parse(userStr);

    // Fetch service requests
    fetchServiceRequests(userData.id);
  }, [router]);

  const fetchServiceRequests = async (userId: string) => {
    try {
      const response = await fetch(`/api/service-requests?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setServiceRequests(data);
      } else {
        toast.error('Failed to load service requests');
      }
    } catch (error) {
      console.error('Error fetching service requests:', error);
      toast.error('Failed to load service requests');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number | null) => {
    if (amount === null) return 'Budget not specified';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-4">Loading service requests...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Service Requests</h1>
          <p className="text-muted-foreground mt-2">
            Manage your service requests and track their progress
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/customer/service-requests/new">
            + New Service Request
          </Link>
        </Button>
      </div>

      {/* Service Requests List */}
      {serviceRequests.length === 0 ? (
        <div className="text-center py-12 bg-card border border-border rounded-lg">
          <div className="text-6xl mb-4">📝</div>
          <h2 className="text-2xl font-semibold mb-2">No Service Requests Yet</h2>
          <p className="text-muted-foreground mb-6">
            Create your first service request to get started
          </p>
          <Button asChild>
            <Link href="/dashboard/customer/service-requests/new">
              Create Service Request
            </Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {serviceRequests.map((request) => (
            <div
              key={request.id}
              className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                {/* Main Content */}
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-1">{request.title}</h3>
                      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                        <span className="font-medium text-primary">
                          {request.category.title}
                        </span>
                        {request.subcategory && (
                          <>
                            <span>•</span>
                            <span>{request.subcategory.title}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${
                        statusColors[request.status] || 'bg-gray-100 text-gray-800 border-gray-200'
                      }`}
                    >
                      {statusLabels[request.status] || request.status}
                    </span>
                  </div>

                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    {request.description}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <span className="font-medium">Location</span>
                      </div>
                      <p className="text-foreground">{request.location}</p>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span className="font-medium">Service Date</span>
                      </div>
                      <p className="text-foreground">{formatDate(request.serviceDate)}</p>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="font-medium">Budget</span>
                      </div>
                      <p className="text-foreground font-semibold">
                        {formatCurrency(request.budget)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 text-xs text-muted-foreground">
                    Posted on {formatDate(request.createdAt)}
                  </div>
                </div>

                {/* Action Button */}
                <div className="flex lg:flex-col gap-2">
                  <Button variant="outline" size="sm" className="flex-1 lg:flex-none">
                    View Details
                  </Button>
                  {request.status === 'PENDING' && (
                    <Button variant="ghost" size="sm" className="flex-1 lg:flex-none text-destructive">
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </DashboardLayout>
  );
}
