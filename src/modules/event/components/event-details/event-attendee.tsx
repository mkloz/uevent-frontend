import { UserAvatar } from '../../../../shared/components/common/user-avatar';
import type { User } from '../../../user/interfaces/user.interface';

interface EventAttendeeProps {
  attendee: User;
}
export const EventAttendee = ({ attendee }: EventAttendeeProps) => {
  return (
    <div
      key={attendee.id}
      className="flex flex-col items-center text-center p-2 rounded-lg hover:bg-accent transition-colors group flex-none w-26 aspect-square border hover:border-primary">
      <UserAvatar user={attendee} className="w-16 h-16 mb-2 group-hover:border-primary" />
      <span className="font-medium text-xs line-clamp-1 group-hover:text-primary transition-colors">
        {attendee.name}
      </span>
    </div>
  );
};
