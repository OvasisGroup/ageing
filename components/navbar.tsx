'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false);
  const [fontSize, setFontSize] = useState(100);
  const accessibilityRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleAccessibility = () => setIsAccessibilityOpen(!isAccessibilityOpen);

  // Apply font size changes
  useEffect(() => {
    document.body.style.fontSize = `${fontSize}%`;
  }, [fontSize]);

  // Close accessibility menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (accessibilityRef.current && !accessibilityRef.current.contains(event.target as Node)) {
        setIsAccessibilityOpen(false);
      }
    };

    if (isAccessibilityOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isAccessibilityOpen]);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-16 w-full items-center justify-between px-4 md:px-6">
        
        {/* Left Section - Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            {/* Mobile Logo */}
            <Image
              src="/images/mynestshield-icon.png"
              alt="Aging Platform Logo"
              width={0}
              height={0}
              sizes="100vw"
              className="h-12 w-auto md:hidden"
            />
            {/* Desktop Logo */}
            <Image
              src="/images/MyNestShield.png"
              alt="Aging Platform Logo"
              width={0}
              height={0}
              sizes="100vw"
              className="hidden md:block h-12 w-auto"
            />
          </Link>
        </div>

        {/* Center Section - Navigation Links (Desktop) */}
        <div className="hidden md:flex items-center space-x-8">
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              About
            </Link>
            <Link
              href="/get-more-info"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Get More Info
            </Link>
          </nav>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center space-x-4">
          {/* Accessibility Menu */}
          <div className="relative" ref={accessibilityRef}>
            <button
              onClick={toggleAccessibility}
              className="relative hover:opacity-80 transition-opacity"
              aria-label="Accessibility options"
            >
              <Image
                src="/images/accessibility-icon.webp"
                alt="Accessibility"
                width={32}
                height={32}
                className="w-8 h-8"
              />
            </button>

            {/* Accessibility Dropdown */}
            <AnimatePresence>
              {isAccessibilityOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-56 max-w-[calc(100vw-2rem)] rounded-md shadow-lg bg-background border border-border z-50"
                >
                  <div className="p-4 space-y-3">
                    <div className="text-sm font-semibold mb-2">
                      Accessibility
                      <span className="ml-2 text-xs text-muted-foreground">({fontSize}%)</span>
                    </div>
                    
                    <button
                      onClick={() => {
                        setFontSize(prev => Math.min(prev + 10, 200));
                      }}
                      className="w-full text-left px-3 py-2 text-sm rounded hover:bg-muted transition-colors flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                      Increase Text Size
                    </button>
                    
                    <button
                      onClick={() => {
                        setFontSize(prev => Math.max(prev - 10, 60));
                      }}
                      className="w-full text-left px-3 py-2 text-sm rounded hover:bg-muted transition-colors flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
                      </svg>
                      Decrease Text Size
                    </button>

                    <button
                      onClick={() => {
                        const root = document.documentElement;
                        const currentContrast = root.style.getPropertyValue('--contrast') || '1';
                        root.style.setProperty('--contrast', currentContrast === '1' ? '1.5' : '1');
                        document.body.style.filter = currentContrast === '1' ? 'contrast(1.5)' : 'contrast(1)';
                      }}
                      className="w-full text-left px-3 py-2 text-sm rounded hover:bg-muted transition-colors flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      High Contrast
                    </button>
                    
                    <button
                      onClick={() => {
                        setFontSize(100);
                        document.body.style.filter = 'contrast(1)';
                        const root = document.documentElement;
                        root.style.setProperty('--contrast', '1');
                      }}
                      className="w-full text-left px-3 py-2 text-sm rounded hover:bg-muted transition-colors flex items-center gap-2 border-t pt-3 mt-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Reset Settings
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Button asChild>
            <Link href="/login">
              Get Started
            </Link>
          </Button>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMenu}
              className="px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
            >
              <motion.svg
                strokeWidth="1.5"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                animate={isOpen ? "open" : "closed"}
              >
                <motion.path
                  d="M3 5H11"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  variants={{
                    closed: { d: "M3 5H21" },
                    open: { d: "M3 3L21 21" }
                  }}
                />
                <motion.path
                  d="M3 12H16"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  variants={{
                    closed: { opacity: 1 },
                    open: { opacity: 0 }
                  }}
                />
                <motion.path
                  d="M3 19H21"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  variants={{
                    closed: { d: "M3 19H21" },
                    open: { d: "M21 3L3 21" }
                  }}
                />
              </motion.svg>
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden border-b border-border/40 bg-background/95 backdrop-blur overflow-hidden"
          >
            <div className="container mx-auto px-4 py-4 space-y-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <Link
                  href="/"
                  onClick={() => setIsOpen(false)}
                  className="block py-2 text-lg font-medium text-foreground/80 hover:text-foreground transition-colors"
                >
                  Home
                </Link>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <Link
                  href="/about"
                  onClick={() => setIsOpen(false)}
                  className="block py-2 text-lg font-medium text-foreground/80 hover:text-foreground transition-colors"
                >
                  About
                </Link>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <Link
                  href="/get-more-info"
                  onClick={() => setIsOpen(false)}
                  className="block py-2 text-lg font-medium text-foreground/80 hover:text-foreground transition-colors"
                >
                  Get Involved
                </Link>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, delay: 0.5 }}
                className="pt-4 border-t border-border/40 space-y-4"
              >
                <Button asChild className="w-full">
                  <Link href="/login" onClick={() => setIsOpen(false)}>
                    Get Started
                  </Link>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}