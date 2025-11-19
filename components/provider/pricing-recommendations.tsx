'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DollarSign, Loader2, TrendingUp } from 'lucide-react';

export default function PricingRecommendations() {
  const [serviceType, setServiceType] = useState('');
  const [location, setLocation] = useState('');
  const [pricing, setPricing] = useState<{
    suggestedPrice: number;
    reasoning: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const getPricing = async () => {
    if (!serviceType.trim() || loading) return;

    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      if (!user.id) {
        throw new Error('User not authenticated');
      }

      const response = await fetch('/api/ai/pricing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': String(user.id),
        },
        body: JSON.stringify({ serviceType, location: location || 'General area' }),
      });

      if (!response.ok) throw new Error('Failed to get pricing');

      const data = await response.json();
      setPricing(data);
    } catch (error) {
      console.error('Pricing error:', error);
    } finally {
      setLoading(false);
    }
  };

  const commonServices = [
    'Home Health Care',
    'Plumbing',
    'Electrical Work',
    'House Cleaning',
    'Lawn Maintenance',
    'Physical Therapy',
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <DollarSign className="h-5 w-5 mr-2 text-green-500" />
        AI Pricing Recommendations
      </h3>

      <div className="space-y-4">
        {/* Service Type */}
        <div>
          <label className="text-sm font-medium mb-1 block">Service Type</label>
          <input
            type="text"
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value)}
            placeholder="Enter service type..."
            className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <div className="flex flex-wrap gap-2 mt-2">
            {commonServices.map((service) => (
              <button
                key={service}
                onClick={() => setServiceType(service)}
                className="text-xs px-3 py-1 bg-accent hover:bg-accent/80 rounded-full transition-colors"
              >
                {service}
              </button>
            ))}
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="text-sm font-medium mb-1 block">Location (Optional)</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="City or area..."
            className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* Get Pricing Button */}
        <Button onClick={getPricing} disabled={!serviceType.trim() || loading} className="w-full">
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <TrendingUp className="h-4 w-4 mr-2" />
              Get Pricing Recommendation
            </>
          )}
        </Button>

        {/* Pricing Result */}
        {pricing && (
          <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 rounded-lg p-6 border border-green-200 dark:border-green-800">
            <div className="text-center mb-4">
              <p className="text-sm text-muted-foreground mb-1">Suggested Hourly Rate</p>
              <p className="text-4xl font-bold text-green-600 dark:text-green-400">
                ${pricing.suggestedPrice.toFixed(2)}
              </p>
            </div>
            <div className="pt-4 border-t border-green-200 dark:border-green-800">
              <p className="text-sm font-medium mb-2">Analysis:</p>
              <p className="text-sm text-muted-foreground">{pricing.reasoning}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
