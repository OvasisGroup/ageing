'use client';

import { useState, useEffect, Suspense } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import toast from 'react-hot-toast';
import { Calendar as CalendarIcon, Plus, X, Check } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/layout';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface Booking {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  status: string;
  location?: string;
  budget?: number;
  category: {
    id: string;
    title: string;
    slug: string;
  };
  provider: {
    id: string;
    firstName: string;
    lastName: string;
    businessName?: string;
    email: string;
    phone?: string;
  };
  googleEventId?: string;
  notes?: string;
}

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: Booking;
}

interface Provider {
  id: string;
  firstName: string;
  lastName: string;
  businessName?: string;
  email: string;
  phone?: string;
}

interface Category {
  id: string;
  title: string;
  slug: string;
}

function BookingsPageContent() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Booking | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [hasCalendar, setHasCalendar] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    providerId: '',
    categoryId: '', // Changed from serviceType to categoryId
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    location: '',
    budget: '',
    notes: '',
  });

  useEffect(() => {
    fetchBookings();
    fetchProviders();
    fetchCategories();
    checkGoogleCalendar();
    
    // Check for calendar connection success or error
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('calendar_connected') === 'true') {
      toast.success('Google Calendar connected successfully! Your bookings will now sync automatically.');
      setHasCalendar(true);
      // Clean up URL
      window.history.replaceState({}, '', window.location.pathname);
    } else if (urlParams.get('calendar_error')) {
      const error = urlParams.get('calendar_error');
      if (error === 'access_denied') {
        toast.error('Calendar connection was cancelled. You can try again anytime.');
      } else {
        toast.error('Failed to connect Google Calendar. Please try again.');
      }
      // Clean up URL
      window.history.replaceState({}, '', window.location.pathname);
    }
    
    // Check if mobile on mount
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    
    // Add resize listener
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const fetchBookings = async () => {
    try {
      // Get user ID from localStorage
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      const userId = user?.id;
      
      if (!userId) {
        console.warn('No user ID found in localStorage');
        setIsLoading(false);
        return;
      }
      
      const response = await fetch('/api/bookings', {
        headers: {
          'x-user-id': userId,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setBookings(data.bookings);
      } else {
        toast.error('Failed to load bookings');
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProviders = async () => {
    try {
      const response = await fetch('/api/admin/providers');
      if (response.ok) {
        const data = await response.json();
        setProviders(data.providers || []);
      }
    } catch (error) {
      console.error('Error fetching providers:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories?isActive=true');
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched categories:', data);
        setCategories(data || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const checkGoogleCalendar = async () => {
    try {
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      const userId = user?.id;
      
      if (!userId) {
        console.warn('No userId found in localStorage');
        return;
      }
      
      const response = await fetch('/api/auth/google/status', {
        headers: {
          'x-user-id': userId,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setHasCalendar(data.isConnected);
      }
    } catch (error) {
      console.error('Error checking calendar:', error);
    }
  };

  const handleConnectCalendar = async () => {
    try {
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      const userId = user?.id;
      
      if (!userId) {
        toast.error('Please log in to connect your Google Calendar');
        return;
      }
      
      const response = await fetch('/api/auth/google/connect', {
        headers: {
          'x-user-id': userId,
        },
      });

      if (response.ok) {
        const data = await response.json();
        window.location.href = data.authUrl;
      } else {
        toast.error('Failed to connect Google Calendar');
      }
    } catch (error) {
      console.error('Error connecting calendar:', error);
      toast.error('Failed to connect Google Calendar');
    }
  };

  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.providerId || !formData.title || !formData.startTime || !formData.endTime) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!formData.categoryId || formData.categoryId === '') {
      toast.error('Please select a service type');
      return;
    }

    try {
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      const userId = user?.id;
      
      if (!userId) {
        toast.error('Please log in to create a booking');
        return;
      }

      // Convert datetime-local to ISO string
      const startTimeISO = new Date(formData.startTime).toISOString();
      const endTimeISO = new Date(formData.endTime).toISOString();
      
      const bookingData = {
        ...formData,
        startTime: startTimeISO,
        endTime: endTimeISO,
      };
      
      // Debug logging
      console.log('Submitting booking data:', bookingData);
      console.log('Category ID:', bookingData.categoryId, 'Type:', typeof bookingData.categoryId);
      
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId,
        },
        body: JSON.stringify(bookingData),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(data.calendarAdded 
          ? 'Booking created and added to your Google Calendar!' 
          : 'Booking created successfully!');
        setShowBookingForm(false);
        setFormData({
          providerId: '',
          categoryId: '',
          title: '',
          description: '',
          startTime: '',
          endTime: '',
          location: '',
          budget: '',
          notes: '',
        });
        fetchBookings();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to create booking');
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      toast.error('Failed to create booking');
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      const userId = user?.id;
      
      if (!userId) {
        toast.error('Please log in to cancel booking');
        return;
      }
      
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: {
          'x-user-id': userId,
        },
      });

      if (response.ok) {
        toast.success('Booking cancelled successfully');
        setSelectedEvent(null);
        fetchBookings();
      } else {
        toast.error('Failed to cancel booking');
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast.error('Failed to cancel booking');
    }
  };

  // Convert bookings to calendar events
  const events: CalendarEvent[] = bookings.map(booking => ({
    id: booking.id,
    title: booking.title,
    start: new Date(booking.startTime),
    end: new Date(booking.endTime),
    resource: booking,
  }));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED': return 'bg-green-100 text-green-800';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800';
      case 'COMPLETED': return 'bg-gray-100 text-gray-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-4 md:space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">My Bookings</h1>
            <p className="text-muted-foreground mt-1 text-sm md:text-base">Manage your service bookings</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            {hasCalendar ? (
              <div className="flex items-center justify-center gap-2 px-4 py-2 bg-secondary text-white rounded-lg">
                <Check className="w-5 h-5" />
                <span>Calendar Connected</span>
              </div>
            ) : (
              <button
                onClick={handleConnectCalendar}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors whitespace-nowrap"
              >
                <CalendarIcon className="w-5 h-5" />
                <span className="hidden sm:inline">Connect Google Calendar</span>
                <span className="sm:hidden">Connect Calendar</span>
              </button>
            )}
            <button
              onClick={() => setShowBookingForm(true)}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors w-full sm:w-auto"
            >
              <Plus className="w-5 h-5" />
              <span>New Booking</span>
            </button>
          </div>
        </div>

      {/* Calendar View - Hidden on mobile */}
      {!isMobile && (
        <div className="bg-card rounded-lg shadow-sm border border-border p-4 md:p-6">
          <div className="h-[500px] md:h-[600px]">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-muted-foreground">Loading bookings...</div>
              </div>
            ) : (
              <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                onSelectEvent={(event) => setSelectedEvent(event.resource)}
                style={{ height: '100%' }}
                eventPropGetter={(event) => ({
                  style: {
                    backgroundColor: event.resource.status === 'CANCELLED' ? '#ef4444' : '#3b82f6',
                  },
                })}
              />
            )}
          </div>
        </div>
      )}

      {/* Booking List */}
      <div className="bg-card rounded-lg shadow-sm border border-border p-4 md:p-6">
        <h2 className="text-lg md:text-xl font-semibold mb-4">{isMobile ? 'My Bookings' : 'Upcoming Bookings'}</h2>
        <div className="space-y-3 md:space-y-4">
          {bookings.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CalendarIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No bookings yet</p>
              <p className="text-sm mt-1">Create your first booking to get started</p>
            </div>
          ) : (
            bookings.map((booking) => (
              <div
                key={booking.id}
                className="border border-border rounded-lg p-3 md:p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedEvent(booking)}
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base md:text-lg truncate">{booking.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1 truncate">
                      {booking.provider.businessName || `${booking.provider.firstName} ${booking.provider.lastName}`}
                    </p>
                    <div className="flex flex-col sm:flex-row sm:gap-4 mt-2 text-xs md:text-sm space-y-1 sm:space-y-0">
                      <span className="flex items-center gap-1">
                        <CalendarIcon className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{format(new Date(booking.startTime), 'PPp')}</span>
                      </span>
                      {booking.location && (
                        <span className="text-muted-foreground truncate pl-5 sm:pl-0">{booking.location}</span>
                      )}
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Booking Form Modal */}
      {showBookingForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 md:p-6">
              <div className="flex justify-between items-center mb-4 md:mb-6">
                <h2 className="text-xl md:text-2xl font-bold">New Booking</h2>
                <button
                  onClick={() => setShowBookingForm(false)}
                  className="p-2 hover:bg-accent rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateBooking} className="space-y-3 md:space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Provider *</label>
                  <select
                    value={formData.providerId}
                    onChange={(e) => setFormData({ ...formData, providerId: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  >
                    <option value="">Select a provider</option>
                    {providers.map((provider) => (
                      <option key={provider.id} value={provider.id}>
                        {provider.businessName || `${provider.firstName} ${provider.lastName}`}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Service Type *</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => {
                      const categoryId = e.target.value;
                      console.log('Category selected:', categoryId);
                      setFormData({ ...formData, categoryId });
                    }}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  >
                    <option value="">Select a service type</option>
                    {categories.map((category) => {
                      console.log('Category option:', category.title, 'ID:', category.id);
                      return (
                        <option key={category.id} value={category.id}>
                          {category.title}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="e.g., Weekly Home Care Visit"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    rows={3}
                    placeholder="Any additional details..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Start Time *</label>
                    <input
                      type="datetime-local"
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">End Time *</label>
                    <input
                      type="datetime-local"
                      value={formData.endTime}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Service location"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Budget</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter budget amount (optional)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    rows={2}
                    placeholder="Special instructions or requirements..."
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Create Booking
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowBookingForm(false)}
                    className="px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Booking Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 md:p-6">
              <div className="flex justify-between items-start mb-4 md:mb-6">
                <div className="flex-1 min-w-0 pr-2">
                  <h2 className="text-xl md:text-2xl font-bold break-words">{selectedEvent.title}</h2>
                  <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedEvent.status)}`}>
                    {selectedEvent.status}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="p-2 hover:bg-accent rounded-lg transition-colors flex-shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 md:space-y-4">
                <div>
                  <h3 className="font-semibold text-sm text-muted-foreground">Provider</h3>
                  <p className="mt-1 break-words">
                    {selectedEvent.provider.businessName || `${selectedEvent.provider.firstName} ${selectedEvent.provider.lastName}`}
                  </p>
                  <p className="text-sm text-muted-foreground break-all">{selectedEvent.provider.email}</p>
                  {selectedEvent.provider.phone && (
                    <p className="text-sm text-muted-foreground">{selectedEvent.provider.phone}</p>
                  )}
                </div>

                <div>
                  <h3 className="font-semibold text-sm text-muted-foreground">Date & Time</h3>
                  <p className="mt-1 text-sm md:text-base">{format(new Date(selectedEvent.startTime), 'PPPp')}</p>
                  <p className="text-sm text-muted-foreground">
                    to {format(new Date(selectedEvent.endTime), 'PPPp')}
                  </p>
                </div>

                {selectedEvent.location && (
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground">Location</h3>
                    <p className="mt-1 break-words">{selectedEvent.location}</p>
                  </div>
                )}

                {selectedEvent.description && (
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground">Description</h3>
                    <p className="mt-1 break-words">{selectedEvent.description}</p>
                  </div>
                )}

                {selectedEvent.googleEventId && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-sm text-green-800">Added to Google Calendar</span>
                  </div>
                )}

                {selectedEvent.status !== 'CANCELLED' && selectedEvent.status !== 'COMPLETED' && (
                  <button
                    onClick={() => handleCancelBooking(selectedEvent.id)}
                    className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </DashboardLayout>
  );
}

export default function BookingsPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <BookingsPageContent />
    </Suspense>
  );
}
