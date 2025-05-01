import dayjs from 'dayjs';
import { CalendarClock, Mail } from 'lucide-react';

import type { User } from '@/modules/user/interfaces/user.interface';
import { UserAvatar } from '@/shared/components/common/user-avatar';
import { Badge } from '@/shared/components/ui/badge';

interface UserProfileHeaderProps {
  user: User;
}

export const UserProfileHeader = ({ user }: UserProfileHeaderProps) => {
  return (
    <div className="bg-card rounded-lg border p-6">
      <div className="flex flex-col gap-6">
        {/* Avatar section */}
        <div className="flex justify-center gap-6 w-full">
          <div className="flex-shrink-0 flex justify-center">
            <UserAvatar user={user} className="h-28 w-28 md:h-32 md:w-32 border-2 border-primary/20" />
          </div>

          {/* User info section */}
          <div className="flex-1 flex flex-col">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <h1 className="text-2xl font-bold">{user.name}</h1>
              {user.role === 'ADMIN' && (
                <Badge variant="default" className="ml-1">
                  Admin
                </Badge>
              )}
            </div>

            <p className="text-muted-foreground text-sm line-clamp-4">{user.bio ? user.bio : 'No bio provided'}</p>
          </div>
        </div>
        <div>
          <div className="w-full space-y-2 mb-4">
            <div className="flex items-center text-sm text-muted-foreground">
              <CalendarClock className="h-4 w-4 mr-2 text-primary" />
              <span>Member since {dayjs(user.createdAt).format('MMMM YYYY')}</span>
            </div>

            <div className="flex items-center text-sm text-muted-foreground">
              <Mail className="h-4 w-4 mr-2 text-primary" />
              <span>{user.email}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
