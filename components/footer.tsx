import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-secondary border-t border-border/40">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          
          {/* First Div - Logo and Description */}
          <div className="space-y-4">
            <div className="flex items-center">
              <Image
                src="/images/white-logo.svg"
                alt="Aging Platform Logo"
                width={0}
                height={0}
                sizes="100vw"
                className="h-12 w-auto"
              />
            </div>
            <p className="text-sm text-white leading-relaxed">
              Advanced aging analysis and management platform designed to help seniors and their families 
              navigate the journey of aging with confidence, support, and comprehensive resources.
            </p>
            <div className="flex items-center space-x-4 pt-2">
              <Link href="#" className="transition-opacity hover:opacity-80">
                <Image
                  src="/images/google-store.png"
                  alt="Download on Google Play"
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="h-10 w-auto"
                />
              </Link>
              <Link href="#" className="transition-opacity hover:opacity-80">
                <Image
                  src="/images/apple-store.png"
                  alt="Download on App Store"
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="h-10 w-auto"
                />
              </Link>
            </div>
          </div>

          {/* Second Div - Categories */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-primary">Categories</h3>
            <nav className="flex flex-col space-y-3">
              <Link
                href="/health"
                className="text-sm text-white/70 hover:text-white transition-colors"
              >
                Health & Wellness
              </Link>
              <Link
                href="/care"
                className="text-sm text-white/70 hover:text-white transition-colors"
              >
                Care Services
              </Link>
              <Link
                href="/housing"
                className="text-sm text-white/70 hover:text-white transition-colors"
              >
                Housing Solutions
              </Link>
              <Link
                href="/resources"
                className="text-sm text-white/70 hover:text-white transition-colors"
              >
                Resources
              </Link>
              <Link
                href="/support"
                className="text-sm text-white/70 hover:text-white transition-colors"
              >
                Support Groups
              </Link>
            </nav>
          </div>

          {/* Third Div - Top Menu Items */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-primary">Navigation</h3>
            <nav className="flex flex-col space-y-3">
              <Link
                href="/"
                className="text-sm text-white/70 hover:text-white transition-colors"
              >
                Home
              </Link>
              <Link
                href="/about"
                className="text-sm text-white/70 hover:text-white transition-colors"
              >
                About
              </Link>
              <Link
                href="/features"
                className="text-sm text-white/70 hover:text-white transition-colors"
              >
                Features
              </Link>
              <Link
                href="/contact"
                className="text-sm text-white/70 hover:text-white transition-colors"
              >
                Contact
              </Link>
              <Link
                href="/privacy"
                className="text-sm text-white/70 hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
            </nav>
          </div>
        </div>

        {/* Bottom Section - Copyright */}
        <div className="mt-12 pt-8 border-t border-white/20">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-white/70">
              © 2025 Aging Platform. All rights reserved.
            </p>
            <div className="flex items-center space-x-6">
              <Link
                href="/terms"
                className="text-sm text-white/70 hover:text-white transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="/cookies"
                className="text-sm text-white/70 hover:text-white transition-colors"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}