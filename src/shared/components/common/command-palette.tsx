'use client';

import {
  Bell,
  Building,
  Building2,
  Calendar,
  CalendarCheck,
  CalendarClock,
  CalendarHeart,
  CircleUser,
  Compass,
  Filter,
  Heart,
  History,
  Home,
  KeyRound,
  Lock,
  LogIn,
  Map,
  Search,
  Settings,
  Ticket,
  UserCog,
  UserPlus,
  Zap
} from 'lucide-react';
import type React from 'react';
import { CgColorPicker } from 'react-icons/cg';
import { useLocation, useNavigate } from 'react-router-dom';

import { useAuth } from '@/modules/auth/queries/use-auth.query';

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut
} from '../ui/command';

// Define all navigation items grouped by category
const NAVIGATION_GROUPS: NavigationGroup[] = [
  {
    name: 'Main Navigation',
    items: [
      {
        icon: Home,
        name: 'Home',
        path: '/',
        description: 'Return to the homepage',
        keywords: ['main', 'start', 'landing']
      },
      {
        icon: Calendar,
        name: 'Events',
        path: '/events',
        description: 'Browse all events',
        keywords: ['all', 'browse', 'discover']
      },
      {
        icon: Building2,
        name: 'Companies',
        path: '/companies',
        description: 'Browse all companies',
        keywords: ['organizations', 'business', 'browse']
      },
      {
        icon: CircleUser,
        name: 'My Profile',
        path: '/users/{id}',
        description: 'View your profile',
        keywords: ['account', 'me', 'personal']
      }
    ]
  },
  {
    name: 'Events',
    items: [
      {
        icon: Search,
        name: 'Find Events',
        path: '/events',
        description: 'Search for events',
        keywords: ['search', 'discover', 'find']
      },
      {
        icon: Map,
        name: 'Events Map',
        path: '/events?view=map',
        description: 'View events on a map',
        keywords: ['location', 'nearby', 'geographic']
      },
      {
        icon: Filter,
        name: 'Filter Events',
        path: '/events',
        description: 'Filter events by criteria',
        keywords: ['search', 'criteria', 'sort']
      },
      {
        icon: CalendarClock,
        name: 'Upcoming Events',
        path: `/events?fromDate=${new Date().toISOString()}`,
        description: 'View upcoming events',
        keywords: ['future', 'soon', 'scheduled']
      },
      {
        icon: CalendarCheck,
        name: 'Past Events',
        path: `/events?toDate=${new Date().toISOString()}`,
        description: 'View past events',
        keywords: ['previous', 'completed', 'history']
      }
    ]
  },
  {
    name: 'Companies',
    items: [
      {
        icon: Search,
        name: 'Find Companies',
        path: '/companies',
        description: 'Search for companies',
        keywords: ['search', 'discover', 'organizations']
      },
      {
        icon: Building,
        name: 'Create Company',
        path: '/users/{id}/upcoming?create-company-modal=true',
        description: 'Create a new company',
        keywords: ['new', 'add', 'register']
      }
    ]
  },
  {
    name: 'Your Profile',
    items: [
      {
        icon: CalendarClock,
        name: 'Your Upcoming Events',
        path: '/users/{id}/upcoming',
        description: "Events you're attending",
        keywords: ['my', 'attending', 'future']
      },
      {
        icon: History,
        name: 'Your Past Events',
        path: '/users/{id}/past',
        description: "Events you've attended",
        keywords: ['my', 'history', 'previous']
      },
      {
        icon: Heart,
        name: 'Following',
        path: '/users/{id}/following/companies',
        description: 'Companies you follow',
        keywords: ['subscribed', 'saved', 'favorite']
      },
      {
        icon: CalendarHeart,
        name: 'Following Events',
        path: '/users/{id}/following/events',
        description: 'Events you follow',
        keywords: ['subscribed', 'saved', 'favorite']
      },
      {
        icon: Ticket,
        name: 'Your Tickets',
        path: '/users/{id}/tickets',
        description: 'View your tickets',
        keywords: ['my', 'passes', 'bookings']
      },
      {
        icon: Settings,
        name: 'Settings',
        path: '/users/{id}/settings',
        description: 'Manage your account',
        keywords: ['preferences', 'account', 'profile']
      },
      {
        icon: UserCog,
        name: 'Profile Settings',
        path: '/users/{id}/settings?tab=profile',
        description: 'Edit your profile',
        keywords: ['edit', 'personal', 'information']
      },
      {
        icon: Bell,
        name: 'Notification Settings',
        path: '/users/{id}/settings?tab=notifications',
        description: 'Manage notifications',
        keywords: ['alerts', 'preferences', 'email']
      },
      {
        icon: CgColorPicker,
        name: 'Appearance Settings',
        path: '/users/{id}/settings?tab=appearance',
        description: 'Customize appearance',
        keywords: ['theme', 'dark mode', 'light mode']
      },
      {
        icon: Lock,
        name: 'Privacy Settings',
        path: '/users/{id}/settings?tab=privacy',
        description: 'Manage privacy',
        keywords: ['security', 'visibility', 'personal']
      }
    ]
  },
  {
    name: 'Authentication',
    items: [
      {
        icon: LogIn,
        name: 'Login',
        path: '/auth/login',
        description: 'Sign in to your account',
        keywords: ['signin', 'access', 'account']
      },
      {
        icon: UserPlus,
        name: 'Sign Up',
        path: '/auth/sign-up',
        description: 'Create a new account',
        keywords: ['register', 'create', 'account']
      },
      {
        icon: KeyRound,
        name: 'Forgot Password',
        path: '/auth/forgot-password',
        description: 'Reset your password',
        keywords: ['reset', 'recover', 'password']
      }
    ]
  }
];

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface NavigationItem {
  icon: React.ElementType;
  name: string;
  path: string;
  description?: string;
  keywords?: string[];
}

interface NavigationGroup {
  name: string;
  items: NavigationItem[];
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: user } = useAuth();

  const handleSelect = (path: string) => {
    if (path.includes('{id}')) {
      if (!user) {
        navigate('/auth/login', { replace: true });
        onOpenChange(false);
        return;
      }
      path = path.replace('{id}', user.id);

      navigate(path);
      onOpenChange(false);
      return;
    }

    navigate(path);
    onOpenChange(false);
  };

  // Get current section based on path
  const getCurrentSection = () => {
    const path = location.pathname;
    if (path.includes('/events')) return 'Events';
    if (path.includes('/companies')) return 'Companies';
    if (path.includes('/users')) return 'Your Profile';
    if (path.includes('/auth')) return 'Authentication';
    return 'Main Navigation';
  };

  const currentSection = getCurrentSection();

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList className="min-h-100 h-full grid">
        <CommandEmpty className="flex flex-col items-center justify-center min-h-full">
          <div className="flex flex-col items-center justify-center py-6">
            <Compass className="size-20 text-muted-foreground opacity-20" />
            <p className="mt-2 text-muted-foreground">No results found.</p>
          </div>
        </CommandEmpty>

        {/* Current section first */}
        {NAVIGATION_GROUPS.map((group) =>
          group.name === currentSection ? (
            <CommandGroup key={group.name} heading={`${group.name} (Current)`} className="text-">
              {group.items.map((item) => (
                <CommandItem
                  key={`${group.name}-${item.path}`}
                  onSelect={() => handleSelect(item.path)}
                  className="flex cursor-pointer items-center">
                  <div className="mr-2 flex items-center justify-center rounded-md bg-primary p-2">
                    <item.icon className="size-4 text-primary-foreground" />
                  </div>
                  <div className="flex flex-col">
                    <span>{item.name}</span>
                    {item.description && <span className="text-xs text-muted-foreground">{item.description}</span>}
                  </div>
                  <CommandShortcut>
                    <Zap className="h-3 w-3" />
                  </CommandShortcut>
                </CommandItem>
              ))}
            </CommandGroup>
          ) : null
        )}

        <CommandSeparator />

        {/* Other sections */}
        {NAVIGATION_GROUPS.map((group) =>
          group.name !== currentSection ? (
            <CommandGroup key={group.name} heading={group.name}>
              {group.items.map((item) => (
                <CommandItem
                  key={`${group.name}-${item.path}`}
                  onSelect={() => handleSelect(item.path)}
                  className="flex cursor-pointer items-center">
                  <div className="mr-2 flex items-center justify-center rounded-md border-2 p-2">
                    <item.icon className="size-4" />
                  </div>
                  <div className="flex flex-col">
                    <span>{item.name}</span>
                    {item.description && <span className="text-xs text-muted-foreground">{item.description}</span>}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          ) : null
        )}
      </CommandList>
    </CommandDialog>
  );
}
