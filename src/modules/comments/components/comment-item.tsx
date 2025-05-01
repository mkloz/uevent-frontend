'use client';

import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MessageSquare } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Link } from '../../../shared/components/common/link';
import { UserAvatar } from '../../../shared/components/common/user-avatar';
import { Button } from '../../../shared/components/ui/button';
import { QueryKeys } from '../../../shared/constants/query-keys';
import { cn } from '../../../shared/lib/utils';
import { infiniteQueryOptions } from '../../../shared/query/infinite-query-options';
import { useAuth } from '../../auth/queries/use-auth.query';
import type { Comment } from '../interfaces/comment.interface';
import { CommentService } from '../services/comment.service';
import { CommentContent } from './comment-content';
import { CommentFooter } from './comment-footer';
import { CommentForm } from './comment-form';
import { CommentHeader } from './comment-header';
import { EditCommentForm } from './edit-comment-form';

interface CommentItemProps {
  comment: Comment;
  currentUserId?: string;
  isReply?: boolean;
}

export const CommentItem = ({ comment, currentUserId, isReply = false }: CommentItemProps) => {
  const [showReplies, setShowReplies] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const { data: user } = useAuth();

  const isAuthor = user?.id === comment.userId;

  // Get replies when needed
  const {
    data: repliesData,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage
  } = useInfiniteQuery(
    infiniteQueryOptions({
      queryKey: [QueryKeys.COMMENTS, comment.id, 'replies'],
      queryFn: ({ pageParam = 1 }) =>
        CommentService.getMany({
          parentId: comment.id,
          page: pageParam,
          limit: 5
        }),
      maxPages: undefined,
      enabled: showReplies
    })
  );
  const replyCount = repliesData?.pages?.at(0)?.items.length || comment._count?.replies || 0;
  const hasReplies = replyCount > 0;

  const replyMutation = useMutation({
    mutationFn: (content: string) => CommentService.create({ content, parentId: comment.id }),
    onSuccess: () => {
      toast.success('Reply posted successfully');
      queryClient.invalidateQueries({ queryKey: [QueryKeys.COMMENTS, comment.id, 'replies'] });
    }
  });

  const editCommentMutation = useMutation({
    mutationFn: (content: string) => CommentService.update(comment.id, { content }),
    onSuccess: () => {
      toast.success('Comment updated successfully');
      setIsEditing(false);
      queryClient.invalidateQueries({
        queryKey: [
          QueryKeys.COMMENTS,
          comment.parentId ? [QueryKeys.COMMENTS, comment.parentId, 'replies'] : null
        ].filter(Boolean)
      });
    }
  });
  // Mutation to delete a comment
  const deleteCommentMutation = useMutation({
    mutationFn: CommentService.delete,
    onSuccess: () => {
      toast.success('Comment deleted successfully');
      queryClient.invalidateQueries({ queryKey: [QueryKeys.COMMENTS] });
    }
  });
  // Handle loading more replies
  const handleLoadMoreReplies = async () => {
    if (!hasNextPage) return;
    fetchNextPage();
  };

  // Flatten replies from all pages
  const replies = repliesData?.pages.flatMap((page) => page.items) || [];

  return (
    <div className="animate-in fade-in-50 duration-300">
      <div className="flex gap-2">
        <Link to={`/users/${comment.userId}`} unstyled className="flex">
          <UserAvatar
            user={comment.user!}
            className={cn(
              'flex-shrink-0 hidden sm:block hover:border-primary',
              isReply ? 'h-8 w-8' : 'h-10 w-10',
              isCollapsed && 'self-center justify-self-center'
            )}
          />
        </Link>

        <div className="flex-1 gap-1 min-w-0 grid">
          <div className={`bg-card border rounded-lg p-2 shadow-sm grid gap-1`}>
            <CommentHeader
              user={comment.user!}
              userId={comment.userId}
              createdAt={comment.createdAt}
              updatedAt={comment.updatedAt}
              isAuthor={isAuthor}
              isReply={isReply}
              isCollapsed={isCollapsed}
              onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
              onDelete={() => deleteCommentMutation.mutate(comment.id)}
              onEdit={isAuthor ? () => setIsEditing(true) : undefined}
            />

            {!isCollapsed &&
              (isEditing ? (
                <EditCommentForm
                  initialContent={comment.content}
                  onSave={async (content) => {
                    await editCommentMutation.mutateAsync(content);
                  }}
                  onCancel={() => setIsEditing(false)}
                  isSubmitting={editCommentMutation.isPending}
                  isReply={isReply}
                />
              ) : (
                <>
                  <CommentContent content={comment.content} isReply={isReply} />
                  <CommentFooter
                    commentId={comment.id}
                    isReply={isReply}
                    hasReplies={hasReplies}
                    replyCount={replyCount || 0}
                    onToggleReplies={!isReply ? () => setShowReplies(!showReplies) : undefined}
                    showReplies={showReplies}
                  />
                </>
              ))}
          </div>

          {!isCollapsed && (
            <>
              {/* Replies section - only for non-replies */}
              {!isReply && showReplies && (
                <div className="pl-4 border-l-2 border-muted">
                  {hasReplies ? (
                    <>
                      {/* Reply form when showing replies */}
                      <CommentForm
                        onSubmit={async (content) => {
                          await replyMutation.mutateAsync(content);
                        }}
                        placeholder="Write a reply..."
                        autoFocus={true}
                        isReply
                        isSubmitting={replyMutation.isPending}
                      />
                      {/* Replies list */}
                      <div className="space-y-1 mt-4">
                        {replies.map((reply) => (
                          <CommentItem key={reply.id} comment={reply} currentUserId={currentUserId} isReply />
                        ))}
                      </div>

                      {/* Load more and hide replies buttons in the same row */}
                      <div className="flex justify-between items-center mt-2">
                        {hasNextPage && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs hover:bg-muted"
                            onClick={handleLoadMoreReplies}
                            disabled={isFetchingNextPage}>
                            {isFetchingNextPage ? 'Loading...' : 'Load more replies'}
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs hover:bg-muted ml-auto"
                          onClick={() => setShowReplies(false)}>
                          Hide replies
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Single reply form when no replies exist */}
                      <CommentForm
                        onSubmit={async (content) => {
                          await replyMutation.mutateAsync(content);
                        }}
                        placeholder="Write a reply..."
                        autoFocus={true}
                        isReply
                        isSubmitting={replyMutation.isPending}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs mt-2 hover:bg-muted"
                        onClick={() => setShowReplies(false)}>
                        Cancel
                      </Button>
                    </>
                  )}
                </div>
              )}

              {/* Show replies button - only for non-replies with replies */}
              <div className="flex-1 pl-4 border-l-2">
                {!isReply && hasReplies && !showReplies && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs hover:bg-muted w-fit"
                    onClick={() => setShowReplies(true)}>
                    <MessageSquare className="h-3.5 w-3.5 mr-1" />
                    Show {replyCount} {replyCount === 1 ? 'reply' : 'replies'}
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
