'use client';

import { useState, useEffect, Suspense } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import toast from 'react-hot-toast';
import { Calendar as CalendarIcon, Check, X, Clock, MapPin, Phone, Mail } from 'lucide-react';
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
  category: {
    id: string;
    title: string;
    slug: string;
  };
  customer: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    address?: string;
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

function ProviderBookingsPageContent() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasCalendar, setHasCalendar] = useState(false);
  const [view, setView] = useState<'calendar' | 'list'>('calendar');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    fetchBookings();
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
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // Auto-switch to list view on mobile
      if (mobile) {
        setView('list');
      }
    };
    checkMobile();
    
    // Add resize listener
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const fetchBookings = async () => {
    try {
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

  const handleUpdateStatus = async (bookingId: string, status: string) => {
    try {
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      const userId = user?.id;
      
      if (!userId) {
        toast.error('Please log in to update booking status');
        return;
      }
      
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId,
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        toast.success(`Booking ${status.toLowerCase()}`);
        fetchBookings();
        setSelectedEvent(null);
      } else {
        toast.error('Failed to update booking');
      }
    } catch (error) {
      console.error('Error updating booking:', error);
      toast.error('Failed to update booking');
    }
  };

  // Convert bookings to calendar events
  const events: CalendarEvent[] = bookings.map(booking => ({
    id: booking.id,
    title: `${booking.title} - ${booking.customer.firstName} ${booking.customer.lastName}`,
    start: new Date(booking.startTime),
    end: new Date(booking.endTime),
    resource: booking,
  }));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'CONFIRMED': return 'bg-green-100 text-green-800 border-green-300';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'COMPLETED': return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'CANCELLED': return 'bg-red-100 text-red-800 border-red-300';
      case 'NO_SHOW': return 'bg-orange-100 text-orange-800 border-orange-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  // Filter bookings by status
  const upcomingBookings = bookings.filter(b => 
    ['PENDING', 'CONFIRMED'].includes(b.status) && 
    new Date(b.startTime) > new Date()
  );
  const todayBookings = bookings.filter(b => {
    const start = new Date(b.startTime);
    const today = new Date();
    return start.toDateString() === today.toDateString();
  });

  return (
    <DashboardLayout>
      <div className="space-y-4 md:space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">My Schedule</h1>
            <p className="text-muted-foreground mt-1 text-sm md:text-base">Manage your service bookings and appointments</p>
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
            {!isMobile && (
              <div className="flex bg-muted rounded-lg p-1">
                <button
                  onClick={() => setView('calendar')}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    view === 'calendar' 
                      ? 'bg-background shadow-sm' 
                      : 'hover:bg-background/50'
                  }`}
                >
                  Calendar
                </button>
                <button
                  onClick={() => setView('list')}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    view === 'list' 
                      ? 'bg-background shadow-sm' 
                      : 'hover:bg-background/50'
                  }`}
                >
                  List
                </button>
              </div>
            )}
          </div>
        </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
        <div className="bg-card border border-border rounded-lg p-3 md:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-muted-foreground">Today&apos;s Bookings</p>
              <p className="text-xl md:text-2xl font-bold mt-1">{todayBookings.length}</p>
            </div>
            <Clock className="w-6 h-6 md:w-8 md:h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-3 md:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-muted-foreground">Upcoming</p>
              <p className="text-xl md:text-2xl font-bold mt-1">{upcomingBookings.length}</p>
            </div>
            <CalendarIcon className="w-6 h-6 md:w-8 md:h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-3 md:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-muted-foreground">Total Bookings</p>
              <p className="text-xl md:text-2xl font-bold mt-1">{bookings.length}</p>
            </div>
            <Check className="w-6 h-6 md:w-8 md:h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {view === 'calendar' ? (
        /* Calendar View */
        <div className="bg-card rounded-lg shadow-sm border border-border p-4 md:p-6">
          <div className="h-[500px] md:h-[600px]">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-muted-foreground">Loading schedule...</div>
              </div>
            ) : (
              <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                onSelectEvent={(event: CalendarEvent) => setSelectedEvent(event.resource)}
                style={{ height: '100%' }}
                eventPropGetter={(event: CalendarEvent) => {
                  let backgroundColor = '#3b82f6';
                  switch (event.resource.status) {
                    case 'PENDING': backgroundColor = '#eab308'; break;
                    case 'CONFIRMED': backgroundColor = '#22c55e'; break;
                    case 'IN_PROGRESS': backgroundColor = '#3b82f6'; break;
                    case 'COMPLETED': backgroundColor = '#6b7280'; break;
                    case 'CANCELLED': backgroundColor = '#ef4444'; break;
                    case 'NO_SHOW': backgroundColor = '#f97316'; break;
                  }
                  return { style: { backgroundColor } };
                }}
              />
            )}
          </div>
        </div>
      ) : (
        /* List View */
        <div className="space-y-3 md:space-y-4">
          {/* Today's Bookings */}
          {todayBookings.length > 0 && (
            <div className="bg-card rounded-lg shadow-sm border border-border p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">Today&apos;s Schedule</h2>
              <div className="space-y-2 md:space-y-3">
                {todayBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="border border-border rounded-lg p-3 md:p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setSelectedEvent(booking)}
                  >
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-base md:text-lg truncate">{booking.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {booking.customer.firstName} {booking.customer.lastName}
                        </p>
                        <div className="flex flex-col sm:flex-row sm:gap-4 mt-2 text-xs md:text-sm space-y-1 sm:space-y-0">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4 flex-shrink-0" />
                            <span>{format(new Date(booking.startTime), 'h:mm a')} - {format(new Date(booking.endTime), 'h:mm a')}</span>
                          </span>
                          {booking.location && (
                            <span className="flex items-center gap-1 text-muted-foreground pl-5 sm:pl-0">
                              <MapPin className="w-4 h-4 flex-shrink-0" />
                              <span className="truncate">{booking.location}</span>
                            </span>
                          )}
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border whitespace-nowrap ${getStatusColor(booking.status)}`}>
                        {booking.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* All Bookings */}
          <div className="bg-card rounded-lg shadow-sm border border-border p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">All Bookings</h2>
            <div className="space-y-2 md:space-y-3">
              {bookings.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CalendarIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No bookings yet</p>
                  <p className="text-sm mt-1">Bookings from customers will appear here</p>
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
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold text-base md:text-lg">{booking.title}</h3>
                          <span className="text-xs px-2 py-1 bg-muted rounded whitespace-nowrap">
                            {booking.category.title}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {booking.customer.firstName} {booking.customer.lastName}
                        </p>
                        <div className="flex flex-col sm:flex-row sm:gap-4 mt-2 text-xs md:text-sm space-y-1 sm:space-y-0">
                          <span className="flex items-center gap-1">
                            <CalendarIcon className="w-4 h-4 flex-shrink-0" />
                            <span className="truncate">{format(new Date(booking.startTime), 'PPp')}</span>
                          </span>
                          {booking.location && (
                            <span className="flex items-center gap-1 text-muted-foreground pl-5 sm:pl-0">
                              <MapPin className="w-4 h-4 flex-shrink-0" />
                              <span className="truncate">{booking.location}</span>
                            </span>
                          )}
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
                        {booking.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                ))
              )}
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
                  <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedEvent.status)}`}>
                    {selectedEvent.status.replace('_', ' ')}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="p-2 hover:bg-accent rounded-lg transition-colors shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 md:space-y-4">
                <div>
                  <h3 className="font-semibold text-sm text-muted-foreground">Customer</h3>
                  <p className="mt-1 font-medium">
                    {selectedEvent.customer.firstName} {selectedEvent.customer.lastName}
                  </p>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm flex items-center gap-2 text-muted-foreground break-all">
                      <Mail className="w-4 h-4 shrink-0" />
                      {selectedEvent.customer.email}
                    </p>
                    {selectedEvent.customer.phone && (
                      <p className="text-sm flex items-center gap-2 text-muted-foreground">
                        <Phone className="w-4 h-4 shrink-0" />
                        {selectedEvent.customer.phone}
                      </p>
                    )}
                    {selectedEvent.customer.address && (
                      <p className="text-sm flex items-center gap-2 text-muted-foreground">
                        <MapPin className="w-4 h-4 shrink-0" />
                        <span className="break-words">{selectedEvent.customer.address}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-sm text-muted-foreground">Service Type</h3>
                  <p className="mt-1">{selectedEvent.category.title}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-sm text-muted-foreground">Date & Time</h3>
                  <p className="mt-1 text-sm md:text-base">{format(new Date(selectedEvent.startTime), 'PPPP')}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {format(new Date(selectedEvent.startTime), 'h:mm a')} - {format(new Date(selectedEvent.endTime), 'h:mm a')}
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

                {selectedEvent.notes && (
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground">Notes</h3>
                    <p className="mt-1 text-sm break-words">{selectedEvent.notes}</p>
                  </div>
                )}

                {selectedEvent.googleEventId && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5 text-green-600 shrink-0" />
                    <span className="text-sm text-green-800">Synced with Google Calendar</span>
                  </div>
                )}

                {/* Status Actions */}
                {selectedEvent.status !== 'COMPLETED' && selectedEvent.status !== 'CANCELLED' && (
                  <div className="border-t border-border pt-3 md:pt-4 mt-3 md:mt-4">
                    <h3 className="font-semibold text-sm mb-3">Update Status</h3>
                    <div className="flex gap-2 flex-wrap">
                      {selectedEvent.status === 'PENDING' && (
                        <button
                          onClick={() => handleUpdateStatus(selectedEvent.id, 'CONFIRMED')}
                          className="flex items-center justify-center gap-2 px-3 md:px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                        >
                          <Check className="w-4 h-4" />
                          <span>Confirm</span>
                        </button>
                      )}
                      {selectedEvent.status === 'CONFIRMED' && (
                        <button
                          onClick={() => handleUpdateStatus(selectedEvent.id, 'IN_PROGRESS')}
                          className="flex items-center justify-center gap-2 px-3 md:px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                        >
                          <Clock className="w-4 h-4" />
                          <span>Start Service</span>
                        </button>
                      )}
                      {selectedEvent.status === 'IN_PROGRESS' && (
                        <button
                          onClick={() => handleUpdateStatus(selectedEvent.id, 'COMPLETED')}
                          className="flex items-center justify-center gap-2 px-3 md:px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                        >
                          <Check className="w-4 h-4" />
                          <span>Complete</span>
                        </button>
                      )}
                      <button
                        onClick={() => handleUpdateStatus(selectedEvent.id, 'CANCELLED')}
                        className="flex items-center justify-center gap-2 px-3 md:px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                      >
                        <X className="w-4 h-4" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  </div>
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

export default function ProviderBookingsPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <ProviderBookingsPageContent />
    </Suspense>
  );
}
