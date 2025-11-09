'use client';

import { Button } from '@/components/ui/button';

export default function PWATestPage() {
  const handleClearDismissed = () => {
    localStorage.removeItem('pwa-prompt-dismissed');
    alert('PWA prompt dismissed state cleared! Reload the page to see the prompt.');
  };

  const handleCheckStatus = () => {
    const dismissed = localStorage.getItem('pwa-prompt-dismissed');
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isIOS = /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
    
    alert(`
PWA Status:
- Dismissed: ${dismissed || 'No'}
- Standalone: ${isStandalone}
- iOS Device: ${isIOS}
- User Agent: ${window.navigator.userAgent}
    `);
  };

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-2xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold">PWA Installation Test</h1>
        
        <div className="bg-card p-6 rounded-lg border space-y-4">
          <h2 className="text-2xl font-semibold">Debug PWA Install Prompt</h2>
          
          <div className="space-y-3">
            <Button 
              onClick={handleCheckStatus}
              variant="outline"
              className="w-full"
            >
              Check PWA Status
            </Button>
            
            <Button 
              onClick={handleClearDismissed}
              className="w-full"
            >
              Clear Dismissed State & Reload
            </Button>
          </div>

          <div className="mt-6 p-4 bg-muted rounded-md text-sm space-y-2">
            <p><strong>How to test:</strong></p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Click &quot;Check PWA Status&quot; to see current state</li>
              <li>Click &quot;Clear Dismissed State&quot; to reset</li>
              <li>Reload the page (Cmd+R or F5)</li>
              <li>Wait 3 seconds for the prompt to appear</li>
            </ol>
            
            <p className="mt-4"><strong>Note:</strong></p>
            <ul className="list-disc list-inside space-y-1">
              <li>On Chrome/Edge: The prompt only shows if PWA criteria are met</li>
              <li>On iOS Safari: The prompt always shows (with install instructions)</li>
              <li>In dev mode (localhost), Chrome may not fire the beforeinstallprompt event</li>
              <li>For full testing, build and serve the app in production mode</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
