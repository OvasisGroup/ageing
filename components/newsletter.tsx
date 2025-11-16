'use client';

import { useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setStatus('error');
      setMessage('Please enter your email address');
      return;
    }

    setIsLoading(true);
    setStatus('idle');
    setMessage('');

    try {
      const response = await axios.post('/api/newsletter/subscribe', {
        email,
        name
      });

      setStatus('success');
      setMessage(response.data.message);
      setEmail('');
      setName('');
      setShowSuccessModal(true);
    } catch (error) {
      setStatus('error');
      if (axios.isAxiosError(error)) {
        setMessage(error.response?.data?.error || 'Failed to subscribe. Please try again.');
      } else {
        setMessage('Failed to subscribe. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="relative bg-primary py-16 overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{
          backgroundImage: "url('/images/newsletter.jpg')"
        }}
      />
      {/* Overlay to ensure text readability */}
      <div className="absolute inset-0 bg-primary/60" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4">
            Stay Updated with Our Newsletter
          </h2>
          
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Get the latest insights, tips, and resources for aging well delivered directly to your inbox. 
            Join our community of seniors and families navigating the journey together.
          </p>

          {/* Subscription Form */}
          <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Your name (optional)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-white/20 bg-white/10 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
              />
              
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-white/20 bg-white/10 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-secondary text-white hover:bg-secondary/90 font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              {isLoading ? 'Subscribing...' : 'Subscribe to Newsletter'}
            </Button>
          </form>

          {/* Status Messages */}
          {status !== 'idle' && (
            <div className={`mt-4 flex items-center justify-center space-x-2 ${
              status === 'success' ? 'text-green-200' : 'text-red-200'
            }`}>
              {status === 'success' ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <AlertCircle className="h-5 w-5" />
              )}
              <span className="text-sm font-medium">{message}</span>
            </div>
          )}

          {/* Privacy Note */}
          <p className="text-sm text-white/70 mt-6">
            We respect your privacy. Unsubscribe at any time. 
            Read our{' '}
            <a href="/privacy" className="underline hover:text-white transition-colors">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowSuccessModal(false)}
            />
            
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative bg-background rounded-lg shadow-xl max-w-md w-full mx-4 p-6 text-center"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowSuccessModal(false)}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Logo */}
              <div className="flex justify-center mb-6">
                <Image
                  src="/images/mynestshield-icon.png"
                  alt="Senior Home Services Network Logo"
                  width={80}
                  height={80}
                  className="rounded-lg"
                />
              </div>

              {/* Success Content */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Thank You for Subscribing!
                </h3>
                
                <p className="text-muted-foreground mb-4">
                  {message}
                </p>
                
                <p className="text-sm text-muted-foreground">
                  You&apos;ll receive our latest updates, tips, and resources for aging well directly in your inbox.
                </p>
              </div>

              {/* Action Button */}
              <Button
                onClick={() => setShowSuccessModal(false)}
                className="w-full"
              >
                Continue
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}