import { toast } from 'sonner';

import { useAuth } from '../../auth/queries/use-auth.query';
import { useCompanyFollowMutation } from './use-company-follow-mutation';
import { useCompanyUnfollowMutation } from './use-company-unfollow-mutation';
import { useUserCompanyFollowing } from './use-user-company-following';

export const useCompanyFollow = (companyId: string) => {
  const following = useUserCompanyFollowing();
  const follow = useCompanyFollowMutation();
  const unfollow = useCompanyUnfollowMutation();
  const isFollowing = following.isFollowing(companyId);
  const me = useAuth();

  return {
    isFollowing,
    follow: () => {
      if (!me.data) {
        toast.error('You need to be logged in to follow a company');
        return;
      }
      if (isFollowing) return;
      follow.mutate(companyId);
    },
    unfollow: () => {
      if (!me.data) {
        toast.error('You need to be logged in to unfollow a company');
        return;
      }
      if (!isFollowing) return;
      unfollow.mutate(companyId);
    },
    toggle: () => {
      if (!me.data) {
        toast.error('You need to be logged in to follow a company');
        return;
      }
      if (isFollowing) {
        unfollow.mutate(companyId);
        return;
      }
      follow.mutate(companyId);
      toast.success('Subscribed to company');
    },
    isLoading: follow.isPending || unfollow.isPending || following.isLoading,
    isError: follow.isError || unfollow.isError || following.isError
  };
};
