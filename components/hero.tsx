'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function Hero() {
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState<string>('');

  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      setIsGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        // Use our server-side API to geocode the coordinates
        fetch(`/api/location/geocode?lat=${latitude}&lng=${longitude}`)
          .then((response) => response.json())
          .then((data) => {
            if (data.error) {
              setLocationError(data.error);
              setIsGettingLocation(false);
              return;
            }

            if (data.address) {
              setCurrentLocation(data.shortAddress);
              
              // Update search input with full address
              const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
              if (searchInput) {
                searchInput.value = data.address;
              }
            }
            setIsGettingLocation(false);
          })
          .catch(() => {
            setLocationError('Failed to get address');
            setIsGettingLocation(false);
          });
      },
      (error) => {
        let errorMessage = 'Unable to retrieve location';
        if (error.code === 1) {
          errorMessage = 'Location permission denied';
        } else if (error.code === 2) {
          errorMessage = 'Location unavailable';
        } else if (error.code === 3) {
          errorMessage = 'Location request timeout';
        }
        setLocationError(errorMessage);
        setIsGettingLocation(false);
      }
    );
  };

  // Automatically detect location on page load
  useEffect(() => {
    // Delay the call to avoid cascading renders
    const timer = setTimeout(() => {
      getCurrentLocation();
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="pb-16 md:pb-4">
      <div className="w-screen relative mx-auto">
        <div 
          className="relative h-[80vh] overflow-hidden bg-cover bg-center bg-no-repeat flex items-center justify-center md:justify-start"
          style={{
            backgroundImage: "url('/images/mbaba.jpg')"
          }}
        >
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-slate-900/80"></div>

          {/* Hero Content - Responsive */}
          <div className="relative z-10 w-full text-center md:text-left">
            <div className="container mx-auto px-4 md:px-6 lg:px-12 max-w-7xl">
              <div className="w-full md:w-1/2 max-w-full md:max-w-none mx-auto md:mx-0">
                <motion.h1 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6 leading-tight"
                >
                  Safe, Independent Living at Home
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="text-base sm:text-lg md:text-xl text-white/90 mb-6 md:mb-8 leading-relaxed max-w-2xl mx-auto md:mx-0"
                >
                  Connect with certified CAPS professionals, licensed contractors and Trusted cleaning service professionals to make your home safer, more accessible, and comfortable for aging in place and disability support.
                </motion.p>
                
                {/* Search Input */}
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="mb-6 md:mb-8 w-full max-w-sm sm:max-w-md mx-auto md:mx-0 px-4 sm:px-0"
                >
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-0">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        placeholder="Search for services in your area..."
                        className="w-full px-4 py-3 pl-12 pr-4 rounded-lg sm:rounded-l-lg sm:rounded-r-none bg-white/10 backdrop-blur border border-white/20 sm:border-r-0 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40"
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" />
                        </svg>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="w-full sm:w-auto px-6 py-3 bg-primary text-primary-foreground rounded-lg sm:rounded-l-none sm:rounded-r-lg font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-white/30 transition-colors cursor-pointer"
                    >
                      Search
                    </button>
                  </div>
                  
                  {/* Current Location Button */}
                  <div className="mt-3 flex items-center justify-center sm:justify-start">
                    <button
                      type="button"
                      onClick={getCurrentLocation}
                      disabled={isGettingLocation}
                      className="inline-flex items-center gap-2 px-4 py-2 text-sm text-white/90 bg-white/10 backdrop-blur border border-white/20 rounded-lg hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isGettingLocation ? (
                        <>
                          <svg className="animate-spin h-4 w-4 text-white/70" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Getting location...</span>
                        </>
                      ) : (
                        <>
                          <svg className="h-4 w-4 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>{currentLocation || 'Use current location'}</span>
                        </>
                      )}
                    </button>
                  </div>
                  
                  {/* Error Message */}
                  {locationError && (
                    <div className="mt-2 text-sm text-red-300 text-center sm:text-left">
                      {locationError}
                    </div>
                  )}
                </motion.div>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          >
            <div className="animate-bounce">
              <svg className="w-6 h-6 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}