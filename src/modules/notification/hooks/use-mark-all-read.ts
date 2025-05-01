import { InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query';

import { QueryKeys } from '../../../shared/constants/query-keys';
import { Paginated } from '../../../shared/types/pagination';
import type { Notification } from '../interfaces/notification.interface';
import { NotificationService } from '../services/notification.service';

export function useMarkAllRead() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      // Get all unread notifications
      const data = queryClient.getQueryData<InfiniteData<Paginated<Notification>>>([QueryKeys.NOTIFICATIONS]);
      if (!data) return;

      const unreadNotifications = data.pages
        .flatMap((page) => page.items)
        .filter((notification: Notification) => !notification.isRead);

      // Mark each as read
      const promises = unreadNotifications.map((notification: Notification) =>
        NotificationService.update(notification.id, true)
      );

      await Promise.all(promises);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.NOTIFICATIONS] });
    }
  });

  return {
    markAllAsRead: mutation.mutateAsync,
    isLoading: mutation.isPending
  };
}
