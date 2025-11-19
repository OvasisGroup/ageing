'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2 } from 'lucide-react';

export default function ServiceRecommender() {
  const [currentNeeds, setCurrentNeeds] = useState('');
  const [location, setLocation] = useState('');
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const getRecommendations = async () => {
    if (!currentNeeds.trim() || loading) return;

    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      if (!user.id) {
        throw new Error('User not authenticated');
      }

      const response = await fetch('/api/ai/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': String(user.id),
        },
        body: JSON.stringify({ currentNeeds, location: location || 'General area' }),
      });

      if (!response.ok) throw new Error('Failed to get recommendations');

      const data = await response.json();
      setRecommendations(data.recommendations);
    } catch (error) {
      console.error('Recommendations error:', error);
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <Sparkles className="h-5 w-5 mr-2 text-yellow-500" />
        AI Service Recommender
      </h3>

      <div className="space-y-4">
        {/* Current Needs */}
        <div>
          <label className="text-sm font-medium mb-1 block">What do you need help with?</label>
          <textarea
            value={currentNeeds}
            onChange={(e) => setCurrentNeeds(e.target.value)}
            placeholder="Describe your needs... (e.g., 'My elderly parent needs daily assistance with meals and medication')"
            className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring min-h-[100px]"
          />
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

        {/* Get Recommendations Button */}
        <Button
          onClick={getRecommendations}
          disabled={!currentNeeds.trim() || loading}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Finding services...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Get Recommendations
            </>
          )}
        </Button>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Recommended Services:</p>
            <div className="space-y-2">
              {recommendations.map((rec, index) => (
                <div key={index} className="bg-accent rounded-lg p-3 flex items-start">
                  <Sparkles className="h-4 w-4 text-yellow-500 mr-2 mt-0.5 shrink-0" />
                  <p className="text-sm">{rec}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
