import type { FC } from 'react';

import type { User } from '../../../modules/user/interfaces/user.interface';
import { cn } from '../../lib/utils';
import { Image } from './image';

interface UserAvatarProps {
  user: User | null;
  className?: string;
}
const getInitials = (fullName?: string) => {
  if (!fullName) return '';

  return (
    fullName
      .split(' ') // Split by space
      .filter(Boolean) // Remove empty strings
      .map((name) => name[0].toUpperCase()) // Take first character, capitalize
      .slice(0, 2) // Take first two initials
      .join('') || ''
  ); // Join into initials
};

const AvatarFallback = ({ user }: { user: User | null }) => {
  return (
    <div className="bg-muted flex items-center justify-center w-full h-full">
      <span className="text-muted-foreground text-sm font-semibold">{getInitials(user?.name)}</span>
    </div>
  );
};
export const UserAvatar: FC<UserAvatarProps> = ({ className, user }) => {
  return (
    <Image
      src={user?.avatar || ''}
      alt={user?.name || ''}
      className={cn('rounded-full w-full h-full object-cover object-center', className)}
      noImageComponent={<AvatarFallback user={user} />}
      fallbackComponent={<AvatarFallback user={user} />}
      wrapperClassName={cn('rounded-full overflow-hidden border-2 aspect-square', className)}
    />
  );
};
