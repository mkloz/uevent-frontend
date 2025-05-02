'use client';

import { InfiniteData, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { QueryKeys } from '../../../shared/constants/query-keys';
import { infiniteQueryOptions } from '../../../shared/query/infinite-query-options';
import { Paginated } from '../../../shared/types/pagination';
import { useAuth } from '../../auth/queries/use-auth.query';
import type { Notification } from '../interfaces/notification.interface';
import { NotificationService } from '../services/notification.service';

const ITEMS_PER_PAGE = 20;
export function useNotifications() {
  const queryClient = useQueryClient();

  // Fetch notifications with infinite query
  const { data, isLoading, isFetchingNextPage, isFetching, hasNextPage, fetchNextPage, refetch } = useInfiniteQuery(
    infiniteQueryOptions<Notification>({
      queryKey: [QueryKeys.USERS_ME, QueryKeys.NOTIFICATIONS],
      staleTime: Infinity,
      refetchInterval: 1000 * 60 * 3,
      retry: false,
      queryFn: async ({ pageParam = 0 }) => {
        try {
          return await NotificationService.getMy({
            page: pageParam,
            limit: ITEMS_PER_PAGE
          });
        } catch {
          return {
            items: [],
            meta: {
              totalItemsCount: 0,
              itemsPerPage: ITEMS_PER_PAGE,
              totalPages: 0,
              currentPage: 0
            }
          };
        }
      },
      enabled: useAuth().isLoggedIn
    })
  );
  // Calculate all notifications and unread count
  const notifications = data?.pages.flatMap((page) => page.items) || [];
  const unreadCount = notifications.filter((notification) => !notification.isRead).length;

  // Mark notification as read
  const markAsReadMutation = useMutation({
    mutationFn: async (id: string) => {
      await NotificationService.update(id, true);
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: [QueryKeys.USERS_ME, QueryKeys.NOTIFICATIONS] });
      const previousData = queryClient.getQueryData([QueryKeys.USERS_ME, QueryKeys.NOTIFICATIONS]);

      // Optimistically update
      queryClient.setQueryData(
        [QueryKeys.USERS_ME, QueryKeys.NOTIFICATIONS],
        (old: InfiniteData<Paginated<Notification>>) => {
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              items: page.items.map((item: Notification) => (item.id === id ? { ...item, isRead: true } : item))
            }))
          };
        }
      );

      return { previousData };
    }
  });

  const markAsUnreadMutation = useMutation({
    mutationFn: async (id: string) => {
      await NotificationService.update(id, false);
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: [QueryKeys.USERS_ME, QueryKeys.NOTIFICATIONS] });
      const previousData = queryClient.getQueryData([QueryKeys.USERS_ME, QueryKeys.NOTIFICATIONS]);

      queryClient.setQueryData(
        [QueryKeys.USERS_ME, QueryKeys.NOTIFICATIONS],
        (old: InfiniteData<Paginated<Notification>>) => {
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              items: page.items.map((item: Notification) => (item.id === id ? { ...item, isRead: false } : item))
            }))
          };
        }
      );

      return { previousData };
    }
  });

  // Delete notification
  const deleteNotificationMutation = useMutation({
    mutationFn: async (id: string) => {
      await NotificationService.delete(id);
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: [QueryKeys.USERS_ME, QueryKeys.NOTIFICATIONS] });
      const previousData = queryClient.getQueryData([QueryKeys.USERS_ME, QueryKeys.NOTIFICATIONS]);

      queryClient.setQueryData(
        [QueryKeys.USERS_ME, QueryKeys.NOTIFICATIONS],
        (old: InfiniteData<Paginated<Notification>>) => {
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              items: page.items.filter((item: Notification) => item.id !== id)
            }))
          };
        }
      );

      return { previousData };
    }
  });

  return {
    notifications,
    unreadCount,
    isLoading: isLoading || isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
    markAsRead: markAsReadMutation.mutateAsync,
    markAsUnread: markAsUnreadMutation.mutateAsync,
    deleteNotification: deleteNotificationMutation.mutateAsync
  };
}
