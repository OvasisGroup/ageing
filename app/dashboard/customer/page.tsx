'use client';

import DashboardLayout from '@/components/dashboard/layout';
import ServiceRecommender from '@/components/customer/service-recommender';
import CarePlanningAssistant from '@/components/customer/care-planning-assistant';
import AIChatbot from '@/components/ai-chatbot';

export default function CustomerDashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-lg font-semibold mb-2">Active Services</h3>
            <p className="text-3xl font-bold text-primary">0</p>
            <p className="text-sm text-muted-foreground">Services currently in use</p>
          </div>
          
          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-lg font-semibold mb-2">Upcoming Appointments</h3>
            <p className="text-3xl font-bold text-blue-600">0</p>
            <p className="text-sm text-muted-foreground">Scheduled appointments</p>
          </div>
          
          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-lg font-semibold mb-2">Total Spent</h3>
            <p className="text-3xl font-bold text-green-600">$0</p>
            <p className="text-sm text-muted-foreground">This month</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-card p-6 rounded-lg border border-border">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="text-center py-8 text-muted-foreground">
            <p>No recent activity to display</p>
            <p className="text-sm mt-2">Start by finding and booking services!</p>
          </div>
        </div>

        {/* AI-Powered Tools */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ServiceRecommender />
          <CarePlanningAssistant />
        </div>
      </div>

      {/* AI Chatbot */}
      <AIChatbot />
    </DashboardLayout>
  );
}