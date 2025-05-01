'use client';

import { LucideLogIn } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { FiBell, FiMenu, FiSearch, FiX } from 'react-icons/fi';
import { NavLink } from 'react-router-dom';

import { Logo } from '../../../assets/logos/logo';
import { useAuth } from '../../../modules/auth/queries/use-auth.query';
import { NotificationDrawer } from '../../../modules/notification/components/notification-drawer';
import { useNotifications } from '../../../modules/notification/hooks/use-notifications';
import { cn } from '../../lib/utils';
import { Button, buttonVariants } from '../ui/button';
import { CommandPalette } from './command-palette';
import { Link } from './link';
import { ThemeToggle } from './theme-toggle';
import { UserMenuSheet } from './user-menu-sheet';

const LINKS = [
  { name: 'Home', path: '/' },
  { name: 'Events', path: '/events' },
  { name: 'Companies', path: '/companies' }
];
const getNavLinkClassName = ({ isActive }: { isActive: boolean }) =>
  cn('font-medium hover:text-primary transition-colors duration-300', isActive && 'text-primary');

export const Header: React.FC = () => {
  const user = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const { unreadCount } = useNotifications();

  return (
    <header className="top-0 left-0 right-0 z-50 sticky transition-all duration-300 bg-accent/20 backdrop-blur-sm shadow-md max-h-header min-h-full h-header">
      <div className="m-auto p-2 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Logo and Name */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center" unstyled>
              <Logo className="size-10 mb-1" />
              <span className="text-3xl font-bold">
                U<span className="text-primary">e</span>vent
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {LINKS.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => window.scrollTo({ top: 0 })}
                className={getNavLinkClassName}>
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Search and User Actions */}
          <div className="flex items-center gap-2">
            {/* Command Palette Button */}
            <ThemeToggle />
            <Button
              variant="default"
              size="icon"
              onClick={() => setIsCommandPaletteOpen(true)}
              aria-label="Command Menu"
              className="relative">
              <FiSearch className="text-xl stroke-3" />
            </Button>

            {user.data ? (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative"
                  onClick={() => setIsNotificationsOpen(true)}
                  aria-label="Notifications">
                  <FiBell className="text-xl" />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full animate-ping"></span>
                  )}
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="md:hidden">
                  {isMobileMenuOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
                </Button>
                <UserMenuSheet />
              </>
            ) : (
              <NavLink
                to="/auth/login"
                onClick={() => window.scrollTo({ top: 0 })}
                className={({ isActive }) =>
                  buttonVariants({ variant: isActive ? 'default' : 'outline', size: 'icon' })
                }>
                <LucideLogIn className="text-xl stroke-3" />
              </NavLink>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white dark:bg-gray-900 shadow-lg">
            <nav className="flex flex-col py-4">
              {LINKS.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) =>
                    cn(
                      'block px-4 py-2 text-lg font-medium hover:text-primary transition-colors duration-300',
                      isActive && 'text-primary'
                    )
                  }>
                  {link.name}
                </NavLink>
              ))}
            </nav>
          </div>
        )}
      </div>

      {/* Command Palette */}
      <CommandPalette open={isCommandPaletteOpen} onOpenChange={setIsCommandPaletteOpen} />
      {/* Notifications Drawer */}
      <NotificationDrawer open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen} />
    </header>
  );
};
