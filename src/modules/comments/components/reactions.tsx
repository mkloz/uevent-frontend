import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FC } from 'react';
import { MdAddReaction } from 'react-icons/md';

import { Button } from '../../../shared/components/ui/button';
import { QueryKeys } from '../../../shared/constants/query-keys';
import { useMyReactions } from '../../../shared/query/use-my-reactions';
import { useAuth } from '../../auth/queries/use-auth.query';
import { ReactionIdRelationField, ReactionType } from '../interfaces/reaction.interface';
import { ReactionService } from '../services/reaction.service';
import { ReactionButton } from './reaction-button';
import { ReactionList } from './reaction-list';

interface ReactionListProps extends ReactionIdRelationField {
  small?: boolean;
}
export const Reactions: FC<ReactionListProps> = ({ small, commentId, newsId }) => {
  const queryClient = useQueryClient();
  const myReactions = useMyReactions();
  const me = useAuth();
  const relationId = { commentId, newsId };
  const { data: reactions } = useQuery({
    queryKey: [QueryKeys.REACTIONS, relationId],
    queryFn: () => ReactionService.getCounts(relationId),
    enabled: !!commentId || !!newsId
  });

  const reactMutation = useMutation({
    mutationFn: (reactionType: ReactionType) => {
      if (!me.data) {
        throw new Error('You need to be logged in to react');
      }
      return ReactionService.react(relationId, reactionType);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.REACTIONS, relationId] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.MY_REACTIONS] });
    }
  });

  // Mutation to remove a reaction
  const deleteReactionMutation = useMutation({
    mutationFn: (id: string) => {
      if (!me.data) {
        throw new Error('You need to be logged in to remove a reaction');
      }
      return ReactionService.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.REACTIONS, relationId] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.MY_REACTIONS] });
    }
  });

  // Check if current user has reacted
  const userReaction = myReactions.getReaction(relationId);

  return (
    <div className="flex flex-wrap items-center gap-1">
      {/* Reaction counts */}
      {reactions && reactions.length > 0 && (
        <>
          <div className="max-md:hidden">
            <ReactionList
              reactions={reactions}
              userReaction={userReaction || null}
              isReply={small}
              onReact={reactMutation.mutate}
              onRemoveReaction={(id) => {
                deleteReactionMutation.mutate(id);
              }}
            />
          </div>
          <div className="md:hidden">
            <Button
              variant={userReaction ? 'default' : 'outline'}
              size="sm"
              className={`px-2 text-xs rounded-full text-primary ${small ? 'h-6' : 'h-7'} ${
                userReaction ? 'bg-primary/20' : 'bg-muted/50'
              }`}
              onClick={() => {
                if (userReaction) {
                  deleteReactionMutation.mutate(userReaction.id);
                } else {
                  reactMutation.mutate(ReactionType.LIKE);
                }
              }}>
              <MdAddReaction />
              {reactions.reduce((acc, reaction) => acc + reaction.count, 0)}
            </Button>
          </div>
        </>
      )}

      {/* Add reaction button */}
      <ReactionButton
        userReaction={userReaction || null}
        isReply={small}
        onReact={reactMutation.mutate}
        onRemoveReaction={(id) => {
          deleteReactionMutation.mutate(id);
        }}
      />
    </div>
  );
};
