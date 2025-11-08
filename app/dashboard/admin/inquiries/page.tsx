'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import DashboardLayout from '@/components/dashboard/layout';

type Inquiry = {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'pending' | 'reviewed' | 'responded' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  updatedAt: string;
};

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'reviewed' | 'responded' | 'closed'>('all');

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      const response = await fetch('/api/inquiries');
      if (response.ok) {
        const data = await response.json();
        setInquiries(data);
      }
    } catch (error) {
      console.error('Error fetching inquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'reviewed': return 'bg-blue-100 text-blue-800';
      case 'responded': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredInquiries = filter === 'all' 
    ? inquiries 
    : inquiries.filter(inquiry => inquiry.status.toLowerCase() === filter);

  // Calculate summary stats
  const totalInquiries = inquiries.length;
  const pendingInquiries = inquiries.filter(i => i.status.toLowerCase() === 'pending').length;
  const reviewedInquiries = inquiries.filter(i => i.status.toLowerCase() === 'reviewed').length;
  const respondedInquiries = inquiries.filter(i => i.status.toLowerCase() === 'responded').length;
  const urgentInquiries = inquiries.filter(i => i.priority.toLowerCase() === 'urgent').length;

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading inquiries...</p>
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
            <h1 className="text-3xl font-bold text-foreground">Inquiries Management</h1>
            <p className="text-muted-foreground mt-1">Manage and respond to customer inquiries</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-sm font-medium text-muted-foreground">Total Inquiries</h3>
            <p className="text-3xl font-bold text-primary mt-2">{totalInquiries}</p>
            <p className="text-sm text-muted-foreground mt-1">All time</p>
          </div>
          
          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-sm font-medium text-muted-foreground">Pending</h3>
            <p className="text-3xl font-bold text-yellow-600 mt-2">{pendingInquiries}</p>
            <p className="text-sm text-muted-foreground mt-1">Needs attention</p>
          </div>
          
          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-sm font-medium text-muted-foreground">Under Review</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">{reviewedInquiries}</p>
            <p className="text-sm text-muted-foreground mt-1">Being processed</p>
          </div>
          
          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-sm font-medium text-muted-foreground">Responded</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">{respondedInquiries}</p>
            <p className="text-sm text-muted-foreground mt-1">Awaiting closure</p>
          </div>
          
          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-sm font-medium text-muted-foreground">Urgent</h3>
            <p className="text-3xl font-bold text-red-600 mt-2">{urgentInquiries}</p>
            <p className="text-sm text-muted-foreground mt-1">High priority</p>
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
              All ({totalInquiries})
            </Button>
            <Button
              variant={filter === 'pending' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('pending')}
            >
              Pending ({pendingInquiries})
            </Button>
            <Button
              variant={filter === 'reviewed' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('reviewed')}
            >
              Reviewed ({reviewedInquiries})
            </Button>
            <Button
              variant={filter === 'responded' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('responded')}
            >
              Responded ({respondedInquiries})
            </Button>
            <Button
              variant={filter === 'closed' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('closed')}
            >
              Closed ({inquiries.filter(i => i.status.toLowerCase() === 'closed').length})
            </Button>
          </div>
        </div>

        {/* Inquiries Table - Desktop */}
        <div className="hidden lg:block bg-card rounded-lg border border-border overflow-hidden">
          <div className="w-full">
            <table className="w-full table-fixed">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-3 font-medium text-muted-foreground w-[8%]">ID</th>
                  <th className="text-left p-3 font-medium text-muted-foreground w-[28%]">Contact</th>
                  <th className="text-left p-3 font-medium text-muted-foreground w-[32%]">Subject</th>
                  <th className="text-left p-3 font-medium text-muted-foreground w-[12%]">Status</th>
                  <th className="text-left p-3 font-medium text-muted-foreground w-[10%]">Priority</th>
                  <th className="text-left p-3 font-medium text-muted-foreground w-[10%]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInquiries.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-muted-foreground">
                      {filter === 'all' ? 'No inquiries found' : `No ${filter} inquiries found`}
                    </td>
                  </tr>
                ) : (
                  filteredInquiries.map((inquiry) => (
                    <tr key={inquiry.id} className="border-t border-border hover:bg-muted/25">
                      <td className="p-3 font-mono text-xs text-muted-foreground">
                        <div className="truncate">
                          #{inquiry.id.toString().slice(-4)}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="space-y-1">
                          <p className="font-medium text-sm truncate" title={inquiry.name}>
                            {inquiry.name}
                          </p>
                          <p className="text-xs text-muted-foreground truncate" title={inquiry.email}>
                            {inquiry.email}
                          </p>
                          {inquiry.phone && inquiry.phone !== 'Not provided' && (
                            <p className="text-xs text-muted-foreground truncate" title={inquiry.phone}>
                              {inquiry.phone}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="space-y-1">
                          <p className="font-medium text-sm truncate" title={inquiry.subject}>
                            {inquiry.subject}
                          </p>
                          <p className="text-xs text-muted-foreground truncate" title={inquiry.message}>
                            {inquiry.message}
                          </p>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex flex-col space-y-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium text-center ${getStatusColor(inquiry.status)}`}>
                            {inquiry.status.toLowerCase()}
                          </span>
                          <span className="text-xs text-muted-foreground text-center">
                            {new Date(inquiry.createdAt).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </span>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium block text-center ${getPriorityColor(inquiry.priority)}`}>
                          {inquiry.priority.toLowerCase()}
                        </span>
                      </td>
                      <td className="p-3">
                        <Link href={`/dashboard/admin/inquiries/${inquiry.id}`}>
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

        {/* Inquiries Cards - Mobile/Tablet */}
        <div className="lg:hidden space-y-4">
          {filteredInquiries.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              {filter === 'all' ? 'No inquiries found' : `No ${filter} inquiries found`}
            </div>
          ) : (
            filteredInquiries.map((inquiry) => (
              <div key={inquiry.id} className="bg-card rounded-lg border border-border p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-mono text-xs text-muted-foreground">
                        #{inquiry.id.toString().slice(-4)}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(inquiry.status)}`}>
                        {inquiry.status.toLowerCase()}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(inquiry.priority)}`}>
                        {inquiry.priority.toLowerCase()}
                      </span>
                    </div>
                    <h3 className="font-medium text-sm truncate" title={inquiry.subject}>
                      {inquiry.subject}
                    </h3>
                    <p className="text-xs text-muted-foreground truncate mt-1" title={inquiry.message}>
                      {inquiry.message}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate" title={inquiry.name}>
                      {inquiry.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate" title={inquiry.email}>
                      {inquiry.email}
                    </p>
                    {inquiry.phone && inquiry.phone !== 'Not provided' && (
                      <p className="text-xs text-muted-foreground">
                        {inquiry.phone}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <span className="text-xs text-muted-foreground">
                      {new Date(inquiry.createdAt).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                    <Link href={`/dashboard/admin/inquiries/${inquiry.id}`}>
                      <Button variant="outline" size="sm" className="text-xs px-3 py-1 h-8">
                        View
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Empty State */}
        {inquiries.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📧</div>
            <h3 className="text-lg font-medium mb-2">No inquiries yet</h3>
            <p className="text-muted-foreground">Customer inquiries will appear here when they contact you.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}