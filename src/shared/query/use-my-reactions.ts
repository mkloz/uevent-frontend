import { useQuery } from '@tanstack/react-query';

import { useAuth } from '../../modules/auth/queries/use-auth.query';
import { ReactionIdRelationField } from '../../modules/comments/interfaces/reaction.interface';
import { ReactionService } from '../../modules/comments/services/reaction.service';
import { QueryKeys } from '../constants/query-keys';

export const useMyReactions = () => {
  const reactions = useQuery({
    queryKey: [QueryKeys.USERS_ME, QueryKeys.MY_REACTIONS],
    staleTime: 1000 * 60 * 5,
    retry: false,

    queryFn: () => {
      try {
        return ReactionService.getMy();
      } catch {
        return [];
      }
    },
    enabled: useAuth().isLoggedIn
  });

  return {
    ...reactions,
    getReaction(to: ReactionIdRelationField) {
      return reactions.data?.find((reaction) => {
        return Object.entries(to)
          .filter(([_key, value]) => Boolean(value))
          .every(([key, value]) => {
            return reaction[key as keyof ReactionIdRelationField] === value;
          });
      });
    }
  };
};
