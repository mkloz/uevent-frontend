import { toast } from 'sonner';

import { useAuth } from '../../auth/queries/use-auth.query';
import { useEventFollowMutation } from './use-event-follow-mutation';
import { useEventUnfollowMutation } from './use-event-unfollow-mutation';
import { useUserEventFollowing } from './use-user-event-following';

export const useEventFollow = (eventId: string) => {
  const following = useUserEventFollowing();
  const follow = useEventFollowMutation();
  const unfollow = useEventUnfollowMutation();
  const isFollowing = following.isFollowing(eventId);
  const me = useAuth();

  return {
    isFollowing,
    follow: () => {
      if (!me.data) {
        toast.error('You need to be logged in to subscribe to events');
        return;
      }
      if (isFollowing) return;
      follow.mutate(eventId);
    },
    unfollow: () => {
      if (!me.data) {
        toast.error('You need to be logged in to subscribe to events');
        return;
      }
      if (!isFollowing) return;
      unfollow.mutate(eventId);
    },
    toggle: () => {
      if (!me.data) {
        toast.error('You need to be logged in to subscribe to events');
        return;
      }
      if (isFollowing) {
        unfollow.mutate(eventId);
        toast.success('Unsubscribed from event');
        return;
      }
      follow.mutate(eventId);
      toast.success('Subscribed to event');
    },
    isLoading: follow.isPending || unfollow.isPending || following.isLoading,
    isError: follow.isError || unfollow.isError || following.isError
  };
};
