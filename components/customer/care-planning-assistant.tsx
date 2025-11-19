'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Heart, Loader2, CheckCircle2 } from 'lucide-react';

export default function CarePlanningAssistant() {
  const [seniorAge, setSeniorAge] = useState('');
  const [conditions, setConditions] = useState('');
  const [mobilityLevel, setMobilityLevel] = useState('moderate');
  const [currentServices, setCurrentServices] = useState('');
  const [carePlan, setCarePlan] = useState<{
    plan: string;
    recommendations: string[];
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const generatePlan = async () => {
    if (!seniorAge || !conditions.trim() || loading) return;

    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      if (!user.id) {
        throw new Error('User not authenticated');
      }

      const response = await fetch('/api/ai/care-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': String(user.id),
        },
        body: JSON.stringify({
          seniorAge: parseInt(seniorAge),
          conditions: conditions.split(',').map((c) => c.trim()),
          mobilityLevel,
          currentServices: currentServices.split(',').map((s) => s.trim()).filter(Boolean),
        }),
      });

      if (!response.ok) throw new Error('Failed to generate care plan');

      const data = await response.json();
      setCarePlan(data);
    } catch (error) {
      console.error('Care plan error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <Heart className="h-5 w-5 mr-2 text-red-500" />
        Care Planning Assistant
      </h3>

      <div className="space-y-4">
        {/* Senior Age */}
        <div>
          <label className="text-sm font-medium mb-1 block">Senior&apos;s Age</label>
          <input
            type="number"
            value={seniorAge}
            onChange={(e) => setSeniorAge(e.target.value)}
            placeholder="e.g., 75"
            min="60"
            max="120"
            className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* Conditions */}
        <div>
          <label className="text-sm font-medium mb-1 block">
            Health Conditions (comma-separated)
          </label>
          <input
            type="text"
            value={conditions}
            onChange={(e) => setConditions(e.target.value)}
            placeholder="e.g., arthritis, diabetes, memory loss"
            className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* Mobility Level */}
        <div>
          <label className="text-sm font-medium mb-2 block">Mobility Level</label>
          <div className="flex space-x-2">
            {['high', 'moderate', 'low', 'wheelchair'].map((level) => (
              <button
                key={level}
                onClick={() => setMobilityLevel(level)}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  mobilityLevel === level
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-accent hover:bg-accent/80'
                }`}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Current Services */}
        <div>
          <label className="text-sm font-medium mb-1 block">
            Current Services (optional, comma-separated)
          </label>
          <input
            type="text"
            value={currentServices}
            onChange={(e) => setCurrentServices(e.target.value)}
            placeholder="e.g., home health aide, meal delivery"
            className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* Generate Button */}
        <Button
          onClick={generatePlan}
          disabled={!seniorAge || !conditions.trim() || loading}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Creating care plan...
            </>
          ) : (
            <>
              <Heart className="h-4 w-4 mr-2" />
              Generate Care Plan
            </>
          )}
        </Button>

        {/* Care Plan Result */}
        {carePlan && (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950/20 dark:to-pink-950/20 rounded-lg p-4 border border-red-200 dark:border-red-800">
              <p className="text-sm font-medium mb-2">Care Plan Summary:</p>
              <p className="text-sm text-muted-foreground">{carePlan.plan}</p>
            </div>

            <div>
              <p className="text-sm font-medium mb-3">Recommended Services:</p>
              <div className="space-y-2">
                {carePlan.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start bg-accent rounded-lg p-3">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 mt-0.5 shrink-0" />
                    <p className="text-sm">{rec}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
