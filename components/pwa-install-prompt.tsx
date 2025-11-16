'use client';

import { useEffect, useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  // Check if running on iOS - use useMemo to avoid setState in useEffect
  const isIOS = useMemo(() => {
    if (typeof window === 'undefined') return false;
    const userAgent = window.navigator.userAgent.toLowerCase();
    return /iphone|ipad|ipod/.test(userAgent);
  }, []);

  // Check if already installed (standalone mode)
  const isStandalone = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(display-mode: standalone)').matches;
  }, []);

  useEffect(() => {
    console.log('PWA Install Prompt - Component mounted');
    console.log('Is Standalone:', isStandalone);
    console.log('Is iOS:', isIOS);
    
    // Don't show if already installed
    if (isStandalone) {
      console.log('App already installed in standalone mode');
      return;
    }

    // Check if user has already dismissed the prompt
    const hasPromptBeenDismissed = localStorage.getItem('pwa-prompt-dismissed');
    const dismissedTime = hasPromptBeenDismissed ? parseInt(hasPromptBeenDismissed) : 0;
    const daysSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);

    console.log('Prompt dismissed:', hasPromptBeenDismissed);
    console.log('Days since dismissed:', daysSinceDismissed);

    // Show prompt if not dismissed or if 7 days have passed
    if (!hasPromptBeenDismissed || daysSinceDismissed > 7) {
      // For iOS, show after 3 seconds
      if (isIOS) {
        console.log('Setting timer to show iOS prompt');
        const timer = setTimeout(() => {
          console.log('Showing iOS prompt');
          setShowPrompt(true);
        }, 3000);
        return () => clearTimeout(timer);
      }

      // For other browsers, listen for beforeinstallprompt event
      const handler = (e: Event) => {
        console.log('beforeinstallprompt event fired');
        e.preventDefault();
        setDeferredPrompt(e as BeforeInstallPromptEvent);
        
        // Show prompt after 3 seconds
        setTimeout(() => {
          console.log('Showing install prompt');
          setShowPrompt(true);
        }, 3000);
      };

      window.addEventListener('beforeinstallprompt', handler);

      return () => {
        window.removeEventListener('beforeinstallprompt', handler);
      };
    } else {
      console.log('Prompt was dismissed recently');
    }
  }, [isIOS, isStandalone]);

  const handleInstallClick = async () => {
    if (!deferredPrompt && !isIOS) {
      return;
    }

    if (deferredPrompt) {
      // Show the install prompt
      deferredPrompt.prompt();

      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }

      // Clear the deferredPrompt
      setDeferredPrompt(null);
    }

    // Hide the prompt
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-prompt-dismissed', Date.now().toString());
  };

  const handleNeverShow = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-prompt-dismissed', '9999999999999'); // Far future date
  };

  if (!showPrompt || isStandalone) {
    return null;
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-9998 animate-in fade-in duration-300"
        onClick={handleDismiss}
      />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-9999 w-[90%] max-w-md animate-in zoom-in-95 duration-300">
        <div className="bg-card border-2 border-primary rounded-2xl shadow-2xl overflow-hidden">
          {/* Header with gradient */}
          <div className="bg-linear-to-r from-primary to-primary/80 p-6 text-white">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                <span className="text-2xl">📱</span>
              </div>
              <div>
                <h3 className="text-lg font-bold">Install Senior Home Services Network</h3>
                <p className="text-sm text-white/90">Quick access from your home screen</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            {isIOS ? (
              // iOS Instructions
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Install this app on your iPhone for quick and easy access:
                </p>
                <div className="space-y-2">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-primary">1</span>
                    </div>
                    <p className="text-sm">
                      Tap the <span className="font-semibold">Share button</span> <span className="inline-block">□↑</span> at the bottom of Safari
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-primary">2</span>
                    </div>
                    <p className="text-sm">
                      Scroll down and tap <span className="font-semibold">&ldquo;Add to Home Screen&rdquo;</span>
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-primary">3</span>
                    </div>
                    <p className="text-sm">
                      Tap <span className="font-semibold">&ldquo;Add&rdquo;</span> to confirm
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              // Android/Desktop Instructions
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Get quick access to Senior Home Services Network with these features:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center space-x-2 text-sm">
                    <span className="text-green-500">✓</span>
                    <span>Works offline</span>
                  </li>
                  <li className="flex items-center space-x-2 text-sm">
                    <span className="text-green-500">✓</span>
                    <span>Faster loading times</span>
                  </li>
                  <li className="flex items-center space-x-2 text-sm">
                    <span className="text-green-500">✓</span>
                    <span>App-like experience</span>
                  </li>
                  <li className="flex items-center space-x-2 text-sm">
                    <span className="text-green-500">✓</span>
                    <span>Quick access from home screen</span>
                  </li>
                </ul>
              </div>
            )}

            {/* Action buttons */}
            <div className="space-y-2 pt-2">
              {!isIOS && (
                <Button 
                  onClick={handleInstallClick}
                  className="w-full"
                  size="lg"
                >
                  <span className="mr-2">📥</span>
                  Install Now
                </Button>
              )}
              <div className="flex space-x-2">
                <Button 
                  onClick={handleDismiss}
                  variant="outline"
                  className="flex-1"
                >
                  {isIOS ? 'Got it!' : 'Maybe Later'}
                </Button>
                <Button 
                  onClick={handleNeverShow}
                  variant="ghost"
                  className="flex-1 text-muted-foreground"
                  size="sm"
                >
                  Don&apos;t Show Again
                </Button>
              </div>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
      </div>
    </>
  );
}
