'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Home,
  Search,
  Calendar,
  Users,
  MessageSquare,
  ShoppingCart,
  ClipboardList,
  FileText,
  Pill,
  Building2,
  DollarSign,
  BarChart3,
  User,
  Settings,
  FolderTree,
  Mail,
} from 'lucide-react';
import { LucideIcon } from 'lucide-react';

type UserRole = 'CUSTOMER' | 'PROVIDER' | 'ADMIN' | 'FAMILY_MEMBER' | 'CAREGIVER';

interface DashboardSidebarProps {
  userRole: UserRole;
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
  roles: UserRole[];
}

const navItems: NavItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: Home,
    roles: ['CUSTOMER', 'PROVIDER', 'ADMIN', 'FAMILY_MEMBER', 'CAREGIVER']
  },
  // Customer specific items
  {
    name: 'Find Services',
    href: '/dashboard/customer/services',
    icon: Search,
    roles: ['CUSTOMER']
  },
  {
    name: 'My Bookings',
    href: '/dashboard/customer/bookings',
    icon: Calendar,
    roles: ['CUSTOMER']
  },
  {
    name: 'Family Members',
    href: '/dashboard/customer/family-members',
    icon: Users,
    roles: ['CUSTOMER']
  },
  {
    name: 'Messages',
    href: '/dashboard/customer/messages',
    icon: MessageSquare,
    roles: ['CUSTOMER']
  },
  // Family Member specific items
  {
    name: 'Order Services',
    href: '/dashboard/family-member/services',
    icon: ShoppingCart,
    roles: ['FAMILY_MEMBER']
  },
  {
    name: 'Appointments',
    href: '/dashboard/family-member/appointments',
    icon: Calendar,
    roles: ['FAMILY_MEMBER']
  },
  {
    name: 'Service History',
    href: '/dashboard/family-member/history',
    icon: ClipboardList,
    roles: ['FAMILY_MEMBER']
  },
  {
    name: 'Messages',
    href: '/dashboard/family-member/messages',
    icon: MessageSquare,
    roles: ['FAMILY_MEMBER']
  },
  // Caregiver specific items
  {
    name: 'Order Care Services',
    href: '/dashboard/caregiver/services',
    icon: ShoppingCart,
    roles: ['CAREGIVER']
  },
  {
    name: 'Care Schedule',
    href: '/dashboard/caregiver/schedule',
    icon: Calendar,
    roles: ['CAREGIVER']
  },
  {
    name: 'Care Notes',
    href: '/dashboard/caregiver/notes',
    icon: FileText,
    roles: ['CAREGIVER']
  },
  {
    name: 'Medication Log',
    href: '/dashboard/caregiver/medications',
    icon: Pill,
    roles: ['CAREGIVER']
  },
  {
    name: 'Messages',
    href: '/dashboard/caregiver/messages',
    icon: MessageSquare,
    roles: ['CAREGIVER']
  },
  // Provider specific items
  {
    name: 'My Bookings',
    href: '/dashboard/provider/bookings',
    icon: Calendar,
    roles: ['PROVIDER']
  },
  {
    name: 'My Clients',
    href: '/dashboard/provider/clients',
    icon: Users,
    roles: ['PROVIDER']
  },
  {
    name: 'Schedule',
    href: '/dashboard/provider/schedule',
    icon: Calendar,
    roles: ['PROVIDER']
  },
  {
    name: 'Messages',
    href: '/dashboard/provider/messages',
    icon: MessageSquare,
    roles: ['PROVIDER']
  },
  {
    name: 'Earnings',
    href: '/dashboard/provider/earnings',
    icon: DollarSign,
    roles: ['PROVIDER']
  },
  // Admin specific items
  {
    name: 'Users',
    href: '/dashboard/admin/users',
    icon: Users,
    roles: ['ADMIN']
  },
  {
    name: 'Providers',
    href: '/dashboard/admin/providers',
    icon: Building2,
    roles: ['ADMIN']
  },
  {
    name: 'Categories',
    href: '/dashboard/admin/categories',
    icon: FolderTree,
    roles: ['ADMIN']
  },
  {
    name: 'Inquiries',
    href: '/dashboard/admin/inquiries',
    icon: Mail,
    roles: ['ADMIN']
  },
  {
    name: 'Analytics',
    href: '/dashboard/admin/analytics',
    icon: BarChart3,
    roles: ['ADMIN']
  },
  {
    name: 'Profile',
    href: '/dashboard/admin/profile',
    icon: User,
    roles: ['ADMIN']
  },
  {
    name: 'Settings',
    href: '/dashboard/admin/settings',
    icon: Settings,
    roles: ['ADMIN']
  },
  // Common items
  {
    name: 'Profile',
    href: '/dashboard/customer/profile',
    icon: User,
    roles: ['CUSTOMER']
  },
  {
    name: 'Profile',
    href: '/dashboard/provider/profile',
    icon: User,
    roles: ['PROVIDER']
  },
  {
    name: 'Settings',
    href: '/dashboard/customer/settings',
    icon: Settings,
    roles: ['CUSTOMER']
  },
  {
    name: 'Settings',
    href: '/dashboard/provider/settings',
    icon: Settings,
    roles: ['PROVIDER']
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
              const IconComponent = item.icon;
              
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
                  <IconComponent className="w-5 h-5" />
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