'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Cookie, X } from 'lucide-react';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already given consent
    const hasConsent = localStorage.getItem('cookie-consent');
    if (!hasConsent) {
      // Show popup after a short delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setIsVisible(false);
  };

  const declineCookies = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setIsVisible(false);
  };

  const closeBanner = () => {
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: -100, y: 20 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: -100, y: 20 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="fixed bottom-6 left-6 z-50 max-w-sm"
        >
          <div className="bg-background border border-border rounded-lg shadow-lg p-6 relative">
            {/* Close Button */}
            <button
              onClick={closeBanner}
              className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Close cookie banner"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Cookie Icon */}
            <div className="flex items-start space-x-3 mb-4">
              <div className="flex-shrink-0">
                <Cookie className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-foreground mb-2">
                  We use cookies
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We use cookies to enhance your experience, analyze site usage, and provide personalized content. 
                  By continuing to use our site, you agree to our use of cookies.
                </p>
              </div>
            </div>

            {/* Learn More Link */}
            <div className="mb-4">
              <Link 
                href="/cookies" 
                className="text-sm text-primary hover:text-primary/80 transition-colors underline"
              >
                Learn more about our cookie policy
              </Link>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col space-y-2">
              <Button 
                onClick={acceptCookies}
                size="sm"
                className="w-full text-sm"
              >
                Accept All Cookies
              </Button>
              <Button 
                onClick={declineCookies}
                variant="outline"
                size="sm"
                className="w-full text-sm"
              >
                Decline
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}