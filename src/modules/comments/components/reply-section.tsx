'use client';
import { Button } from '../../../shared/components/ui/button';
import type { Comment } from '../interfaces/comment.interface';
import { CommentForm } from './comment-form';
import { CommentItem } from './comment-item';

interface ReplySectionProps {
  replies: Comment[] | undefined;
  isLoading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  isLoadingMore: boolean;
  currentUserId?: string;
  onSubmitReply: (content: string) => Promise<void>;
  isSubmittingReply: boolean;
  onHideReplies: () => void;
}

export const ReplySection = ({
  replies,
  isLoading,
  hasMore,
  onLoadMore,
  isLoadingMore,
  currentUserId,
  onSubmitReply,
  isSubmittingReply,
  onHideReplies
}: ReplySectionProps) => {
  return (
    <div className="pl-4 border-l-2 border-muted">
      {/* Reply form */}
      <CommentForm
        onSubmit={onSubmitReply}
        placeholder="Write a reply..."
        autoFocus={true}
        isReply
        isSubmitting={isSubmittingReply}
      />

      {/* Replies list */}
      {replies && replies.length > 0 ? (
        <div className="space-y-1 mt-4">
          {replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} currentUserId={currentUserId} isReply />
          ))}
        </div>
      ) : isLoading ? (
        <p className="text-sm text-muted-foreground mt-2">Loading replies...</p>
      ) : (
        <p className="text-sm text-muted-foreground mt-2">No replies yet</p>
      )}

      {/* Load more and hide replies buttons in the same row */}
      <div className="flex justify-between items-center mt-2">
        {hasMore && (
          <Button
            variant="ghost"
            size="sm"
            className="text-xs hover:bg-muted"
            onClick={onLoadMore}
            disabled={isLoadingMore}>
            {isLoadingMore ? 'Loading...' : 'Load more replies'}
          </Button>
        )}
        <Button variant="ghost" size="sm" className="text-xs hover:bg-muted ml-auto" onClick={onHideReplies}>
          Hide replies
        </Button>
      </div>
    </div>
  );
};
