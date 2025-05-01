import { toast } from 'sonner';

import { useEventFollowMutation } from './use-event-follow-mutation';
import { useEventUnfollowMutation } from './use-event-unfollow-mutation';
import { useUserEventFollowing } from './use-user-event-following';

export const useEventFollow = (eventId: string) => {
  const following = useUserEventFollowing();
  const follow = useEventFollowMutation();
  const unfollow = useEventUnfollowMutation();
  const isFollowing = following.isFollowing(eventId);

  return {
    isFollowing,
    follow: () => {
      if (isFollowing) return;
      follow.mutate(eventId);
    },
    unfollow: () => {
      if (!isFollowing) return;
      unfollow.mutate(eventId);
    },
    toggle: () => {
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
