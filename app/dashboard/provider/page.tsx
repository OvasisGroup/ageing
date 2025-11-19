'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/dashboard/layout';
import ResponseAssistant from '@/components/provider/response-assistant';
import PricingRecommendations from '@/components/provider/pricing-recommendations';
import AIChatbot from '@/components/ai-chatbot';
import toast from 'react-hot-toast';

interface ServiceRequest {
  id: string;
  serviceType: string;
  description: string;
  budget: string;
  urgency: string;
  location: string;
  status: string;
  createdAt: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
  };
}

export default function ProviderDashboard() {
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'in_progress' | 'completed'>('all');

  useEffect(() => {
    fetchServiceRequests();
  }, []);

  const fetchServiceRequests = async () => {
    try {
      const response = await fetch('/api/service-requests/all');
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

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getUrgencyBadgeColor = (urgency: string) => {
    switch (urgency.toLowerCase()) {
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'normal':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'low':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredRequests = serviceRequests.filter(request => {
    if (filter === 'all') return true;
    return request.status.toLowerCase() === filter.replace('_', ' ');
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Service Requests</h1>
          <p className="text-muted-foreground mt-1">View and manage all customer service requests</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Total Requests</h3>
            <p className="text-3xl font-bold text-primary">{serviceRequests.length}</p>
          </div>
          
          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Pending</h3>
            <p className="text-3xl font-bold text-yellow-600">
              {serviceRequests.filter(r => r.status.toLowerCase() === 'pending').length}
            </p>
          </div>
          
          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">In Progress</h3>
            <p className="text-3xl font-bold text-blue-600">
              {serviceRequests.filter(r => r.status.toLowerCase() === 'in progress').length}
            </p>
          </div>
          
          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Completed</h3>
            <p className="text-3xl font-bold text-green-600">
              {serviceRequests.filter(r => r.status.toLowerCase() === 'completed').length}
            </p>
          </div>
        </div>

        <div className="flex gap-2 border-b border-border">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 font-medium transition-colors ${
              filter === 'all'
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            All ({serviceRequests.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 font-medium transition-colors ${
              filter === 'pending'
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Pending ({serviceRequests.filter(r => r.status.toLowerCase() === 'pending').length})
          </button>
          <button
            onClick={() => setFilter('in_progress')}
            className={`px-4 py-2 font-medium transition-colors ${
              filter === 'in_progress'
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            In Progress ({serviceRequests.filter(r => r.status.toLowerCase() === 'in progress').length})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 font-medium transition-colors ${
              filter === 'completed'
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Completed ({serviceRequests.filter(r => r.status.toLowerCase() === 'completed').length})
          </button>
        </div>

        <div className="bg-card rounded-lg border border-border overflow-hidden">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-4">Loading service requests...</p>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="mt-4 text-lg font-semibold">No service requests found</h3>
              <p className="text-muted-foreground mt-2">
                {filter === 'all' 
                  ? 'No service requests have been submitted yet.'
                  : `No ${filter.replace('_', ' ')} service requests.`}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-6">
              <table className="w-full min-w-max">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-[180px]">
                      Customer
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-[130px]">
                      Service
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider min-w-[200px]">
                      Description
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider min-w-[150px]">
                      Location
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-[90px]">
                      Budget
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-[90px]">
                      Urgency
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-[110px]">
                      Status
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-[140px]">
                      Date
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-[100px]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-card divide-y divide-border">
                  {filteredRequests.map((request) => (
                    <tr key={request.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex flex-col">
                          <div className="font-medium text-sm">
                            {request.user.firstName} {request.user.lastName}
                          </div>
                          <div className="text-xs text-muted-foreground truncate max-w-[160px]">
                            {request.user.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <span className="font-medium text-sm">{request.serviceType}</span>
                      </td>
                      <td className="px-3 py-3">
                        <div className="text-sm truncate max-w-[200px]" title={request.description}>
                          {request.description}
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <div className="text-sm truncate max-w-[150px]" title={request.location}>
                          {request.location}
                        </div>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <span className="font-semibold text-green-600 text-sm">${request.budget}</span>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-md border ${getUrgencyBadgeColor(request.urgency)}`}>
                          {request.urgency}
                        </span>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-md border ${getStatusBadgeColor(request.status)}`}>
                          {request.status}
                        </span>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-xs text-muted-foreground">
                        {formatDate(request.createdAt)}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <button
                          onClick={() => toast.success('Feature coming soon!')}
                          className="text-primary hover:text-primary/80 font-medium text-xs"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* AI Tools Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ResponseAssistant />
          <PricingRecommendations />
        </div>
      </div>

      {/* AI Chatbot */}
      <AIChatbot />
    </DashboardLayout>
  );
}
