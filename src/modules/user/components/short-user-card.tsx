import { ArrowRight } from 'lucide-react';
import type { FC } from 'react';
import { Link } from 'react-router-dom';

import { UserAvatar } from '@/shared/components/common/user-avatar';

import type { User } from '../interfaces/user.interface';

interface ShortUserCardProps {
  user: User;
  className?: string;
}

export const ShortUserCard: FC<ShortUserCardProps> = ({ user, className }) => {
  return (
    <Link
      to={`/users/${user.id}`}
      className={`flex gap-3 group hover:bg-muted p-3 rounded-md transition-colors border border-transparent hover:border-primary/20 items-center @container ${className}`}>
      <UserAvatar
        user={user}
        className="size-14 flex-shrink-0 border-2 border-border group-hover:border-primary transition-colors"
      />

      <div className="flex-1 min-w-0 flex flex-col justify-between gap-1">
        <h3 className="font-medium text-base line-clamp-1 group-hover:text-primary transition-colors">{user.name}</h3>

        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
          {user.bio ? user.bio : `${user.role === 'ADMIN' ? 'Administrator' : 'No bio available'}`}
        </p>
      </div>

      <div className="flex flex-col items-end justify-between">
        <div className="self-center opacity-0 group-hover:opacity-100 transition-opacity mt-auto">
          <ArrowRight className="h-4 w-4 text-primary" />
        </div>
      </div>
    </Link>
  );
};
