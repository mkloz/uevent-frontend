import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Building2, CalendarClock, CalendarHeart, History, LogOut, Settings, Ticket, UserIcon } from 'lucide-react';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { useAuth, userGroupOptions } from '@/modules/auth/queries/use-auth.query';
import { AuthService } from '@/modules/auth/services/auth.service';
import { useTokens } from '@/modules/auth/stores/tokens.store';
import { Button } from '@/shared/components/ui/button';
import { Separator } from '@/shared/components/ui/separator';
import { SheetTitle } from '@/shared/components/ui/sheet';

import { cn } from '../../lib/utils';
import { Drawer, DrawerContent, DrawerHeader, DrawerTrigger } from '../ui/drawer';
import { Link } from './link';
import { UserAvatar } from './user-avatar';

const USER_MENU_OPTIONS = [
  { name: 'My Profile', icon: UserIcon, path: '' },
  { name: 'Upcoming Events', icon: CalendarClock, path: '/upcoming' },
  { name: 'Past Events', icon: History, path: '/past' },
  { name: 'Following Companies', icon: Building2, path: '/following/companies' },
  { name: 'Following Events', icon: CalendarHeart, path: '/following/events' },
  { name: 'Tickets', icon: Ticket, path: '/tickets' },
  { name: 'Settings', icon: Settings, path: '/settings' }
];

export const UserMenuSheet = () => {
  const [open, setOpen] = useState(false);
  const { data: user } = useAuth();
  const tokens = useTokens();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const path = useLocation().pathname;

  const logout = useMutation({
    mutationFn: () => {
      return AuthService.logout(tokens.tokens?.refreshToken || '');
    },
    onSuccess: () => {
      tokens.deleteTokens();
      queryClient.resetQueries(userGroupOptions());
      navigate('/');
      toast.success('Logged out successfully');
      setOpen(false);
    }
  });

  if (!user) return null;

  const navigateTo = (path: string) => {
    navigate(path);
    setOpen(false);
  };

  return (
    <Drawer open={open} onOpenChange={setOpen} direction="right">
      <DrawerTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full p-0 hover:border-0 border-0">
          <UserAvatar
            user={user}
            className={cn(
              'border-2  size-full hover:border-primary transition-colors cursor-pointer',
              path?.startsWith('/users') && 'border-primary!'
            )}
          />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="w-80 flex flex-col gap-4">
          <DrawerHeader className="text-left">
            <Link
              className="flex items-center gap-3 group/profile"
              to={`/users/${user.id}`}
              onClick={() => setOpen(false)}
              unstyled>
              <UserAvatar user={user} className="h-12 w-12 group-hover/profile:border-primary" />
              <div>
                <SheetTitle>{user.name}</SheetTitle>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </Link>
          </DrawerHeader>
          <div className="flex flex-col gap-2 px-4">
            {USER_MENU_OPTIONS.map((option) => (
              <Button
                key={option.name}
                variant="ghost"
                className="justify-start text-muted-foreground hover:text-primary hover:bg-primary/10"
                onClick={() => navigateTo(`/users/${user.id}${option.path}`)}>
                <option.icon className="mr-2 h-5 w-5" />
                {option.name}
              </Button>
            ))}
            <Separator className="my-2" />
            <Button
              variant="destructive"
              className="justify-start "
              onClick={() => logout.mutate()}
              disabled={logout.isPending}>
              <LogOut className="mr-2 h-5 w-5" />
              {logout.isPending ? 'Logging out...' : 'Logout'}
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
