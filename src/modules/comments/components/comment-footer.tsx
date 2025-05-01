'use client';

import { FaReply } from 'react-icons/fa6';

import { Button } from '../../../shared/components/ui/button';
import { Reactions } from './reactions';

interface CommentFooterProps {
  commentId: string;
  isReply?: boolean;
  hasReplies?: boolean;
  replyCount?: number;
  onToggleReplies?: () => void;
  showReplies?: boolean;
}

export const CommentFooter = ({
  isReply = false,
  hasReplies = false,
  replyCount = 0,
  commentId,
  onToggleReplies,
  showReplies = false
}: CommentFooterProps) => {
  return (
    <div className="flex flex-wrap items-center gap-1">
      <Reactions small={isReply} commentId={commentId} />

      {/* Reply button with count - only show for non-replies */}
      {!isReply && onToggleReplies && (
        <Button variant="ghost" size="sm" className="h-7 text-xs rounded-full hover:bg-muted" onClick={onToggleReplies}>
          <FaReply className="h-3.5 w-3.5 mr-1" />
          {hasReplies ? `${replyCount === 1 ? 'Reply' : 'Replies'} (${replyCount})` : showReplies ? 'Cancel' : 'Reply'}
        </Button>
      )}
    </div>
  );
};
