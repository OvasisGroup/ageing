'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import DashboardLayout from '@/components/dashboard/layout';
import toast from 'react-hot-toast';

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

export default function InquiryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const inquiryId = params.id as string;
  
  const [inquiry, setInquiry] = useState<Inquiry | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [response, setResponse] = useState('');

  useEffect(() => {
    const fetchInquiry = async () => {
      try {
        const response = await fetch(`/api/inquiries/${inquiryId}`);
        if (response.ok) {
          const data = await response.json();
          setInquiry(data);
        } else {
          toast.error('Inquiry not found');
          router.push('/dashboard/admin/inquiries');
        }
      } catch (error) {
        console.error('Error fetching inquiry:', error);
        toast.error('Error loading inquiry');
      } finally {
        setLoading(false);
      }
    };

    if (inquiryId) {
      fetchInquiry();
    }
  }, [inquiryId, router]);

  const updateStatus = async (newStatus: string) => {
    if (!inquiry) return;
    
    setUpdating(true);
    try {
      const response = await fetch(`/api/inquiries/${inquiry.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus.toUpperCase() }),
      });

      if (response.ok) {
        const updatedInquiry = await response.json();
        setInquiry(updatedInquiry);
        toast.success(`Status updated to ${newStatus}`);
      } else {
        toast.error('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Error updating status');
    } finally {
      setUpdating(false);
    }
  };

  const updatePriority = async (newPriority: string) => {
    if (!inquiry) return;
    
    setUpdating(true);
    try {
      const response = await fetch(`/api/inquiries/${inquiry.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priority: newPriority.toUpperCase() }),
      });

      if (response.ok) {
        const updatedInquiry = await response.json();
        setInquiry(updatedInquiry);
        toast.success(`Priority updated to ${newPriority}`);
      } else {
        toast.error('Failed to update priority');
      }
    } catch (error) {
      console.error('Error updating priority:', error);
      toast.error('Error updating priority');
    } finally {
      setUpdating(false);
    }
  };

  const sendResponse = async () => {
    if (!inquiry || !response.trim()) {
      toast.error('Please enter a response');
      return;
    }

    setUpdating(true);
    try {
      // In a real app, you would send an email here
      await updateStatus('responded');
      setResponse('');
      toast.success('Response sent successfully');
    } catch (error) {
      console.error('Error sending response:', error);
      toast.error('Error sending response');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'reviewed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'responded': return 'bg-green-100 text-green-800 border-green-200';
      case 'closed': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading inquiry...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!inquiry) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Inquiry Not Found</h2>
          <Button onClick={() => router.push('/dashboard/admin/inquiries')}>
            Back to Inquiries
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              onClick={() => router.push('/dashboard/admin/inquiries')}
            >
              ← Back to Inquiries
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Inquiry #{inquiry.id}</h1>
              <p className="text-muted-foreground mt-1">
                Submitted on {new Date(inquiry.createdAt).toLocaleDateString()} at{' '}
                {new Date(inquiry.createdAt).toLocaleTimeString()}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(inquiry.status)}`}>
              {inquiry.status.toLowerCase()}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(inquiry.priority)}`}>
              {inquiry.priority.toLowerCase()} priority
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Inquiry Details */}
            <div className="bg-card p-6 rounded-lg border border-border">
              <h2 className="text-xl font-semibold mb-4">Inquiry Details</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Subject</label>
                  <p className="text-lg font-medium mt-1">{inquiry.subject}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Message</label>
                  <div className="mt-2 p-4 bg-muted/25 rounded-md">
                    <p className="whitespace-pre-wrap">{inquiry.message}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Response Section */}
            <div className="bg-card p-6 rounded-lg border border-border">
              <h2 className="text-xl font-semibold mb-4">Send Response</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    Response Message
                  </label>
                  <textarea
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    placeholder="Type your response here..."
                    className="w-full h-32 px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                
                <div className="flex space-x-3">
                  <Button 
                    onClick={sendResponse} 
                    disabled={updating || !response.trim()}
                    className="flex-1"
                  >
                    {updating ? 'Sending...' : 'Send Response'}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setResponse('')}
                    disabled={!response.trim()}
                  >
                    Clear
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <div className="bg-card p-6 rounded-lg border border-border">
              <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Name</label>
                  <p className="font-medium">{inquiry.name}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="font-medium">
                    <a 
                      href={`mailto:${inquiry.email}`}
                      className="text-primary hover:underline"
                    >
                      {inquiry.email}
                    </a>
                  </p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Phone</label>
                  <p className="font-medium">
                    <a 
                      href={`tel:${inquiry.phone}`}
                      className="text-primary hover:underline"
                    >
                      {inquiry.phone}
                    </a>
                  </p>
                </div>
              </div>
            </div>

            {/* Status Management */}
            <div className="bg-card p-6 rounded-lg border border-border">
              <h3 className="text-lg font-semibold mb-4">Status Management</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    Update Status
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant={inquiry.status.toLowerCase() === 'pending' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updateStatus('pending')}
                      disabled={updating}
                    >
                      Pending
                    </Button>
                    <Button
                      variant={inquiry.status.toLowerCase() === 'reviewed' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updateStatus('reviewed')}
                      disabled={updating}
                    >
                      Reviewed
                    </Button>
                    <Button
                      variant={inquiry.status.toLowerCase() === 'responded' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updateStatus('responded')}
                      disabled={updating}
                    >
                      Responded
                    </Button>
                    <Button
                      variant={inquiry.status.toLowerCase() === 'closed' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updateStatus('closed')}
                      disabled={updating}
                    >
                      Closed
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    Update Priority
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant={inquiry.priority.toLowerCase() === 'low' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updatePriority('low')}
                      disabled={updating}
                    >
                      Low
                    </Button>
                    <Button
                      variant={inquiry.priority.toLowerCase() === 'medium' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updatePriority('medium')}
                      disabled={updating}
                    >
                      Medium
                    </Button>
                    <Button
                      variant={inquiry.priority.toLowerCase() === 'high' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updatePriority('high')}
                      disabled={updating}
                    >
                      High
                    </Button>
                    <Button
                      variant={inquiry.priority.toLowerCase() === 'urgent' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updatePriority('urgent')}
                      disabled={updating}
                    >
                      Urgent
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-card p-6 rounded-lg border border-border">
              <h3 className="text-lg font-semibold mb-4">Timeline</h3>
              
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium">Inquiry Submitted</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(inquiry.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                
                {inquiry.updatedAt !== inquiry.createdAt && (
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium">Last Updated</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(inquiry.updatedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}