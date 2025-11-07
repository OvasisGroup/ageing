'use client';

import { motion } from 'framer-motion';

export default function Hero() {
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
                  Connect with certified CAPS professionals and trusted cleaning services to make your home safer, more accessible, and comfortable for aging in place and disability support.
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