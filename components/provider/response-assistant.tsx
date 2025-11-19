'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare, Loader2, Copy, Check } from 'lucide-react';

export default function ResponseAssistant() {
  const [context, setContext] = useState('');
  const [customerMessage, setCustomerMessage] = useState('');
  const [tone, setTone] = useState<'professional' | 'friendly' | 'apologetic'>('professional');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateResponse = async () => {
    if (!context.trim() || !customerMessage.trim() || loading) return;

    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      if (!user.id) {
        throw new Error('User not authenticated');
      }

      const res = await fetch('/api/ai/response-generator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': String(user.id),
        },
        body: JSON.stringify({ context, customerMessage, tone }),
      });

      if (!res.ok) throw new Error('Failed to generate response');

      const data = await res.json();
      setResponse(data.response);
    } catch (error) {
      console.error('Response generation error:', error);
      setResponse('Failed to generate response. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <MessageSquare className="h-5 w-5 mr-2 text-blue-500" />
        AI Response Assistant
      </h3>

      <div className="space-y-4">
        {/* Context */}
        <div>
          <label className="text-sm font-medium mb-1 block">Service Context</label>
          <input
            type="text"
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="e.g., Plumbing repair scheduled for tomorrow"
            className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* Customer Message */}
        <div>
          <label className="text-sm font-medium mb-1 block">Customer Message</label>
          <textarea
            value={customerMessage}
            onChange={(e) => setCustomerMessage(e.target.value)}
            placeholder="Paste the customer's message here..."
            className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring min-h-[100px]"
          />
        </div>

        {/* Tone Selection */}
        <div>
          <label className="text-sm font-medium mb-2 block">Response Tone</label>
          <div className="flex space-x-2">
            {(['professional', 'friendly', 'apologetic'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTone(t)}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  tone === t
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-accent hover:bg-accent/80'
                }`}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <Button
          onClick={generateResponse}
          disabled={!context.trim() || !customerMessage.trim() || loading}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            'Generate Response'
          )}
        </Button>

        {/* Generated Response */}
        {response && (
          <div className="bg-muted rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium">Suggested Response:</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyToClipboard}
                className="h-8"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-1" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </>
                )}
              </Button>
            </div>
            <p className="text-sm whitespace-pre-wrap">{response}</p>
          </div>
        )}
      </div>
    </div>
  );
}
