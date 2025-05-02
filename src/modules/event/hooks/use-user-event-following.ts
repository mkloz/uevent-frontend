import { useQuery } from '@tanstack/react-query';

import { QueryKeys } from '../../../shared/constants/query-keys';
import { useAuth } from '../../auth/queries/use-auth.query';
import { EventService } from '../services/event.service';

export const useUserEventFollowing = () => {
  const following = useQuery({
    queryKey: [QueryKeys.USERS_ME, 'my', 'followed', 'events'],
    staleTime: 1000 * 60 * 5,
    retry: false,
    queryFn: () => {
      try {
        return EventService.getMyFollowed();
      } catch {
        return [];
      }
    },
    enabled: useAuth().isLoggedIn
  });

  return {
    ...following,
    isFollowing: (eventId: string) => following.data?.some((event) => event.eventId === eventId)
  };
};
