import { useMutation, useQueryClient } from '@tanstack/react-query';

import { QueryKeys } from '../../../shared/constants/query-keys';
import { EventService } from '../services/event.service';

export const useEventUnfollowMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (eventId: string) => EventService.unfollow(eventId),
    onSuccess: (_, eventId) => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.EVENT_SUBSCRIBERS, eventId]
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.EVENT_SUBSCRIBERS, 'my']
      });
    }
  });
};
