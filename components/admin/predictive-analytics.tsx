'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, Users, Activity, Loader2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function PredictiveAnalytics() {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<{
    insights: string[];
    predictions: string[];
    currentMetrics: {
      totalBookings: number;
      totalProviders: number;
      totalCustomers: number;
    };
  } | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      if (!user.id) {
        throw new Error('User not authenticated');
      }

      const response = await fetch('/api/ai/analytics', {
        headers: { 'x-user-id': String(user.id) },
      });

      if (!response.ok) throw new Error('Failed to fetch analytics');

      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error('Analytics error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mock chart data
  const chartData = [
    { day: 'Mon', bookings: 12, revenue: 1200 },
    { day: 'Tue', bookings: 15, revenue: 1500 },
    { day: 'Wed', bookings: 18, revenue: 1800 },
    { day: 'Thu', bookings: 14, revenue: 1400 },
    { day: 'Fri', bookings: 20, revenue: 2000 },
    { day: 'Sat', bookings: 22, revenue: 2200 },
    { day: 'Sun', bookings: 19, revenue: 1900 },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Bookings (7d)</p>
              <p className="text-2xl font-bold mt-1">{analytics?.currentMetrics.totalBookings || 0}</p>
            </div>
            <Activity className="h-8 w-8 text-blue-500" />
          </div>
          <p className="text-xs text-green-600 mt-2">↑ 12% from last week</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">New Providers (7d)</p>
              <p className="text-2xl font-bold mt-1">{analytics?.currentMetrics.totalProviders || 0}</p>
            </div>
            <Users className="h-8 w-8 text-purple-500" />
          </div>
          <p className="text-xs text-green-600 mt-2">↑ 8% from last week</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">New Customers (7d)</p>
              <p className="text-2xl font-bold mt-1">{analytics?.currentMetrics.totalCustomers || 0}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-500" />
          </div>
          <p className="text-xs text-green-600 mt-2">↑ 15% from last week</p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Bookings Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="bookings" stroke="#8884d8" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* AI Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-blue-500" />
            Key Insights
          </h3>
          <ul className="space-y-2">
            {analytics?.insights.map((insight, index) => (
              <li key={index} className="text-sm text-muted-foreground flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                {insight}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <Activity className="h-5 w-5 mr-2 text-purple-500" />
            Predictions
          </h3>
          <ul className="space-y-2">
            {analytics?.predictions.map((prediction, index) => (
              <li key={index} className="text-sm text-muted-foreground flex items-start">
                <span className="text-purple-500 mr-2">•</span>
                {prediction}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
