'use client';

import { Button } from '../../../shared/components/ui/button';
import type { ReactionType } from '../interfaces/reaction.interface';

// Reaction type to emoji mapping
const REACTION_EMOJIS: Record<ReactionType, string> = {
  LIKE: '👍',
  DISLIKE: '👎',
  LOVE: '❤️',
  LAUGH: '😂',
  SAD: '😢',
  ANGRY: '😡'
};

interface ReactionListProps {
  reactions: Array<{ type: ReactionType; count: number }>;
  userReaction: { id: string; type: ReactionType } | null;
  isReply?: boolean;
  onReact: (type: ReactionType) => void;
  onRemoveReaction: (id: string) => void;
}

export const ReactionList = ({
  reactions,
  userReaction,
  isReply = false,
  onReact,
  onRemoveReaction
}: ReactionListProps) => {
  if (!reactions || reactions.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1 mr-2">
      {reactions
        .filter(({ count }) => count > 0)
        .map(({ type, count }) => (
          <Button
            key={type}
            variant={userReaction?.type === type ? 'default' : 'outline'}
            size="sm"
            className={`px-2 text-xs rounded-full ${isReply ? 'h-6' : 'h-7'}`}
            onClick={() => {
              if (userReaction?.type === type) {
                onRemoveReaction(userReaction.id);
              } else {
                onReact(type);
              }
            }}>
            {REACTION_EMOJIS[type]} {count}
          </Button>
        ))}
    </div>
  );
};
