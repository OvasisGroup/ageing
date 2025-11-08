'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';

type UserRole = 'CUSTOMER' | 'PROVIDER' | 'ADMIN';

interface DashboardSidebarProps {
  userRole: UserRole;
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  name: string;
  href: string;
  icon: string;
  roles: UserRole[];
}

const navItems: NavItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: '🏠',
    roles: ['CUSTOMER', 'PROVIDER', 'ADMIN']
  },
  // Customer specific items
  {
    name: 'Find Services',
    href: '/dashboard/customer/services',
    icon: '🔍',
    roles: ['CUSTOMER']
  },
  {
    name: 'My Bookings',
    href: '/dashboard/customer/bookings',
    icon: '📅',
    roles: ['CUSTOMER']
  },
  {
    name: 'Messages',
    href: '/dashboard/customer/messages',
    icon: '💬',
    roles: ['CUSTOMER']
  },
  // Provider specific items
  {
    name: 'My Clients',
    href: '/dashboard/provider/clients',
    icon: '👥',
    roles: ['PROVIDER']
  },
  {
    name: 'Schedule',
    href: '/dashboard/provider/schedule',
    icon: '📅',
    roles: ['PROVIDER']
  },
  {
    name: 'Messages',
    href: '/dashboard/provider/messages',
    icon: '💬',
    roles: ['PROVIDER']
  },
  {
    name: 'Earnings',
    href: '/dashboard/provider/earnings',
    icon: '💰',
    roles: ['PROVIDER']
  },
  // Admin specific items
  {
    name: 'Users',
    href: '/dashboard/admin/users',
    icon: '👥',
    roles: ['ADMIN']
  },
  {
    name: 'Providers',
    href: '/dashboard/admin/providers',
    icon: '🏢',
    roles: ['ADMIN']
  },
  {
    name: 'Inquiries',
    href: '/dashboard/admin/inquiries',
    icon: '📧',
    roles: ['ADMIN']
  },
  {
    name: 'Analytics',
    href: '/dashboard/admin/analytics',
    icon: '📊',
    roles: ['ADMIN']
  },
  {
    name: 'Settings',
    href: '/dashboard/admin/settings',
    icon: '⚙️',
    roles: ['ADMIN']
  },
  // Common items
  {
    name: 'Profile',
    href: '/dashboard/profile',
    icon: '👤',
    roles: ['CUSTOMER', 'PROVIDER', 'ADMIN']
  },
  {
    name: 'Settings',
    href: '/dashboard/settings',
    icon: '⚙️',
    roles: ['CUSTOMER', 'PROVIDER']
  }
];

export default function DashboardSidebar({ userRole, isOpen, onClose }: DashboardSidebarProps) {
  const pathname = usePathname();

  // Get the base dashboard path for the user role
  const getBaseDashboardPath = (role: UserRole) => {
    switch (role) {
      case 'CUSTOMER':
        return '/dashboard/customer';
      case 'PROVIDER':
        return '/dashboard/provider';
      case 'ADMIN':
        return '/dashboard/admin';
      default:
        return '/dashboard';
    }
  };

  // Filter nav items based on user role
  const filteredNavItems = navItems.filter(item => item.roles.includes(userRole));

  // Check if a nav item is active
  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === getBaseDashboardPath(userRole);
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-64 bg-card border-r border-border transform transition-transform duration-300 ease-in-out z-50
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center justify-center flex-1">
                <Image 
                  src="/images/MyNestShield.png" 
                  alt="MyNestShield Logo" 
                  width={187}
                  height={72}
                  className="object-contain"
                />
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="lg:hidden absolute right-4"
              >
                ✕
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {filteredNavItems.map((item) => {
              const href = item.href === '/dashboard' ? getBaseDashboardPath(userRole) : item.href;
              const active = isActive(item.href);
              
              return (
                <Link
                  key={item.name}
                  href={href}
                  onClick={onClose}
                  className={`
                    flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                    ${active 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    }
                  `}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-border">
            <div className="text-xs text-muted-foreground text-center">
              Aging Care Platform v1.0
            </div>
          </div>
        </div>
      </div>
    </>
  );
}