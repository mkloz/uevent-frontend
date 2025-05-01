'use client';

import { MessageSquare } from 'lucide-react';

import { Button } from '@/shared/components/ui/button';
import { Skeleton } from '@/shared/components/ui/skeleton';

import type { Comment } from '../interfaces/comment.interface';
import { CommentItem } from './comment-item';

interface CommentListProps {
  comments: Comment[];
  isLoading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  isLoadingMore: boolean;
  currentUserId?: string;
}

export const CommentList = ({
  comments,
  isLoading,
  hasMore,
  onLoadMore,
  isLoadingMore,
  currentUserId
}: CommentListProps) => {
  if (isLoading) {
    return (
      <div className="space-y-2 mt-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-16 w-full rounded-md" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!comments || comments.length === 0) {
    return (
      <div className="text-center py-12 bg-muted/30 rounded-lg mt-6">
        <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-1">No comments yet</h3>
        <p className="text-muted-foreground">Be the first to share your thoughts!</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} currentUserId={currentUserId} />
      ))}

      {hasMore && (
        <div className="text-center mt-6">
          <Button variant="outline" onClick={onLoadMore} disabled={isLoadingMore}>
            {isLoadingMore ? 'Loading...' : 'Load More Comments'}
          </Button>
        </div>
      )}
    </div>
  );
};
