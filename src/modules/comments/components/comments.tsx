'use client';

import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MessageSquare } from 'lucide-react';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

import { useAuth } from '@/modules/auth/queries/use-auth.query';
import { Card, CardContent, CardTitle } from '@/shared/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';

import { Toggle } from '../../../shared/components/ui/toggle';
import { QueryKeys } from '../../../shared/constants/query-keys';
import { infiniteQueryOptions } from '../../../shared/query/infinite-query-options';
import { CommentService } from '../services/comment.service';
import { CommentForm } from './comment-form';
import { CommentList } from './comment-list';

type SortOption = 'newest' | 'oldest' | 'popular';
type FilterOption = 'all' | 'mine';

interface CommentsProps {
  eventId?: string;
  newsId?: string;
  parentId?: string;
  title?: string;
}

export const Comments = ({ eventId, newsId, parentId, title = 'Comments' }: CommentsProps) => {
  const [activeFilter, setActiveFilter] = useState<FilterOption>('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const { data: currentUser } = useAuth();
  const queryClient = useQueryClient();

  const showOnlyMyComments = activeFilter === 'mine';

  const commentsQueryKey = [
    QueryKeys.COMMENTS,
    { eventId, newsId, parentId, showOnlyMyComments, sortBy, userId: currentUser?.id }
  ];

  const {
    data: comments,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage
  } = useInfiniteQuery(
    infiniteQueryOptions({
      queryKey: commentsQueryKey,
      queryFn: ({ pageParam = 1 }) =>
        CommentService.getMany({
          newsId,
          parentId,
          eventId,
          page: pageParam,
          limit: 10,
          userId: showOnlyMyComments ? currentUser?.id : undefined,
          sortBy: sortBy === 'popular' ? 'popularity' : 'date',
          sortOrder: sortBy === 'oldest' ? 'asc' : 'desc'
        }),
      maxPages: undefined
    })
  );

  const createCommentMutation = useMutation({
    mutationFn: (content: string) => {
      return CommentService.create({
        content,
        eventId,
        newsId,
        parentId
      });
    },
    onSuccess: () => {
      toast.success('Comment posted successfully');
      queryClient.invalidateQueries({ queryKey: commentsQueryKey });
    }
  });

  const handleSubmitComment = useCallback(
    async (content: string) => {
      if (!currentUser) {
        toast.error('You must be logged in to comment');
        return;
      }

      await createCommentMutation.mutateAsync(content);
    },
    [currentUser]
  );

  // Handle loading more comments
  const handleLoadMore = useCallback(async () => {
    if (!hasNextPage) return;
    fetchNextPage();
  }, [hasNextPage, fetchNextPage]);

  const totalComments = comments?.pages.at(0)?.meta.totalItemsCount || 0;

  return (
    <Card className="max-sm:py-0 order-last" id="comments">
      <CardContent className="gap-4 grid max-sm:p-3">
        <div className="flex flex-row items-center gap-4 flex-wrap">
          <CardTitle className="flex items-center gap-2 grow">
            <MessageSquare className="h-5 w-5 text-primary" />
            {title}
            {totalComments > 0 && (
              <span className="text-sm font-normal text-muted-foreground ml-2">({totalComments})</span>
            )}
          </CardTitle>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 justify-end">
              <Toggle
                pressed={showOnlyMyComments}
                onPressedChange={() => setActiveFilter((prev) => (prev === 'all' ? 'mine' : 'all'))}
                className="min-w-30 rounded-full"
                disabled={!currentUser}>
                {showOnlyMyComments ? 'My Only' : 'All Comments'}
              </Toggle>
            </div>

            <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <CommentForm
          onSubmit={handleSubmitComment}
          isSubmitting={createCommentMutation.isPending}
          placeholder={eventId ? 'Share your thoughts about this event...' : 'Write a comment...'}
        />

        <div className="mt-6">
          <CommentList
            comments={comments?.pages.flatMap((page) => page.items) || []}
            isLoading={isLoading}
            hasMore={hasNextPage}
            onLoadMore={handleLoadMore}
            isLoadingMore={isFetchingNextPage}
            currentUserId={currentUser?.id}
          />
        </div>
      </CardContent>
    </Card>
  );
};
