'use client';

import { useQuery } from '@tanstack/react-query';
import { Calendar, Lock } from 'lucide-react';

import { Skeleton } from '@/shared/components/ui/skeleton';
import { QueryKeys } from '@/shared/constants/query-keys';

import { useAuth } from '../../../auth/queries/use-auth.query';
import { ShortEventCard } from '../../../event/components/short-event-card';
import { EventService } from '../../../event/services/event.service';
import { UserNoItems } from './user-no-items';

interface UserFollowingEventsProps {
  userId: string;
}

export const UserFollowingEvents = ({ userId }: UserFollowingEventsProps) => {
  const me = useAuth();

  // Fetch events the user is following
  const {
    data: followedEventsData,
    isLoading: isLoadingFollowedEvents,
    error: eventsError
  } = useQuery({
    queryKey: [QueryKeys.USER_EVENTS, userId, 'followed', me.data?.id],
    queryFn: () => (me.data?.id === userId ? EventService.getMyFollowed() : EventService.getUserFollowed(userId)),
    enabled: !!userId && !me.isLoading
  });

  const isPrivate = eventsError?.message?.toLowerCase().includes('private');

  if (isLoadingFollowedEvents) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 6 }, (_data, i) => (
          <div key={i} className="bg-card rounded-lg border p-4">
            <div className="flex gap-4">
              <Skeleton className="h-24 w-24 rounded-md flex-shrink-0" />
              <div className="flex-1">
                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isPrivate) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <Lock className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">Private Content</h3>
        <p className="text-muted-foreground max-w-md">This user has chosen to keep their followed events private.</p>
      </div>
    );
  }

  if (!followedEventsData?.length) {
    return (
      <UserNoItems icon={Calendar} title="No Events Followed" description="This user hasn't followed any events yet." />
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-rounded-full">
        {followedEventsData.map(({ event }) => (
          <ShortEventCard event={event} key={event.id} />
        ))}
      </div>
    </div>
  );
};
