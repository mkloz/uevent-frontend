'use client';

import { useRef, useState } from 'react';
import { RiEmojiStickerLine } from 'react-icons/ri';

import { Button } from '../../../shared/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../../../shared/components/ui/popover';
import { cn } from '../../../shared/lib/utils';
import { ReactionType } from '../interfaces/reaction.interface';

// Reaction type to emoji mapping
const REACTION_EMOJIS: Record<ReactionType, string> = {
  LIKE: '👍',
  DISLIKE: '👎',
  LOVE: '❤️',
  LAUGH: '😂',
  SAD: '😢',
  ANGRY: '😡'
};

// All available reaction types
const REACTION_TYPES: ReactionType[] = Object.values(ReactionType);

interface ReactionButtonProps {
  userReaction: { id: string; type: ReactionType } | null;
  isReply?: boolean;
  onReact: (type: ReactionType) => void;
  onRemoveReaction: (id: string) => void;
}

export const ReactionButton = ({ userReaction, isReply = false, onReact, onRemoveReaction }: ReactionButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button ref={buttonRef} variant="ghost" size="sm" className="h-7 text-xs rounded-full hover:bg-muted">
          <RiEmojiStickerLine /> React
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2" side="top">
        <div className="flex flex-wrap gap-1 max-w-[135px]">
          {REACTION_TYPES.map((type) => (
            <Button
              key={type}
              variant={userReaction?.type === type ? 'default' : 'outline'}
              className={cn(
                'p-1.5 hover:bg-muted rounded-md cursor-pointer transition-colors text-xl',
                isReply && 'text-lg',
                userReaction?.type === type && 'bg-primary/20 hover:text-white'
              )}
              onClick={() => {
                if (userReaction?.type === type) {
                  onRemoveReaction(userReaction.id);
                } else {
                  onReact(type);
                }
                setIsOpen(false);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  if (userReaction?.type === type) {
                    onRemoveReaction(userReaction.id);
                  } else {
                    onReact(type);
                  }
                  setIsOpen(false);
                }
              }}
              tabIndex={0}
              aria-label={`React with ${type.toLowerCase()}`}
              title={type.toLowerCase()}>
              {REACTION_EMOJIS[type]}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
