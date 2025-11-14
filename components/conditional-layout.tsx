'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/navbar';
import Newsletter from '@/components/newsletter';
import Footer from '@/components/footer';

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  
  // Check if current path is an auth page or dashboard page
  const isAuthPage = pathname === '/login' || pathname.startsWith('/register');
  const isDashboardPage = pathname.startsWith('/dashboard');
  const isGetMoreInfoPage = pathname === '/get-more-info';
  
  if (isAuthPage || isDashboardPage || isGetMoreInfoPage) {
    // Return children without header/footer for auth pages and dashboard pages
    return <>{children}</>;
  }
  
  // Return children with header/footer for all other pages
  return (
    <>
      <Navbar />
      {children}
      <Newsletter />
      <Footer />
    </>
  );
}