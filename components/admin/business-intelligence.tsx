'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Search, Loader2 } from 'lucide-react';

export default function BusinessIntelligence() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleQuery = async () => {
    if (!query.trim() || loading) return;

    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      if (!user.id) {
        throw new Error('User not authenticated');
      }

      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': String(user.id),
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: `Business intelligence query: ${query}. Provide data-driven insights based on typical platform metrics.`,
            },
          ],
        }),
      });

      if (!response.ok) throw new Error('Query failed');

      const data = await response.json();
      setResult(data.response);
    } catch (error) {
      console.error('Query error:', error);
      setResult('Failed to process query. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const quickQueries = [
    'Show me top performing providers this month',
    'Which services have highest cancellation rates?',
    'What are peak booking times?',
    'Analyze customer retention trends',
    'Compare revenue by service category',
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Business Intelligence Assistant</h3>
      
      <div className="space-y-4">
        {/* Search Input */}
        <div className="flex space-x-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleQuery()}
            placeholder="Ask a business question..."
            className="flex-1 px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <Button onClick={handleQuery} disabled={!query.trim() || loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          </Button>
        </div>

        {/* Quick Queries */}
        <div>
          <p className="text-sm text-muted-foreground mb-2">Quick queries:</p>
          <div className="flex flex-wrap gap-2">
            {quickQueries.map((q, index) => (
              <button
                key={index}
                onClick={() => setQuery(q)}
                className="text-xs px-3 py-1 bg-accent hover:bg-accent/80 rounded-full transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Result */}
        {result && (
          <div className="bg-muted rounded-lg p-4 mt-4">
            <p className="text-sm whitespace-pre-wrap">{result}</p>
          </div>
        )}
      </div>
    </div>
  );
}
