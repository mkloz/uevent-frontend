import { useQuery } from '@tanstack/react-query';

import { QueryKeys } from '../../../shared/constants/query-keys';
import { EventService } from '../services/event.service';

export const useUserEventFollowing = () => {
  const following = useQuery({
    queryKey: [QueryKeys.EVENT_SUBSCRIBERS, 'my'],
    queryFn: () => EventService.getMyFollowed()
  });

  return {
    ...following,
    isFollowing: (eventId: string) => following.data?.some((event) => event.eventId === eventId)
  };
};
