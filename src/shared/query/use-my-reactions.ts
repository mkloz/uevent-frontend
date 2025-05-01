import { useQuery } from '@tanstack/react-query';

import { ReactionIdRelationField } from '../../modules/comments/interfaces/reaction.interface';
import { ReactionService } from '../../modules/comments/services/reaction.service';
import { QueryKeys } from '../constants/query-keys';

export const useMyReactions = () => {
  const reactions = useQuery({
    queryKey: [QueryKeys.MY_REACTIONS],
    queryFn: () => ReactionService.getMy()
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
