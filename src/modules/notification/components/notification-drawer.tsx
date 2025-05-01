'use client';

import { ScrollArea } from '@radix-ui/react-scroll-area';
import { Check, Loader2, X } from 'lucide-react';
import { useEffect } from 'react';
import { IoReloadOutline } from 'react-icons/io5';
import { MdDoneAll } from 'react-icons/md';
import { toast } from 'sonner';
import { useIntersectionObserver } from 'usehooks-ts';

import { Button } from '@/shared/components/ui/button';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/shared/components/ui/drawer';
import { Skeleton } from '@/shared/components/ui/skeleton';

import { cn } from '../../../shared/lib/utils';
import { useMarkAllRead } from '../hooks/use-mark-all-read';
import { useNotifications } from '../hooks/use-notifications';
import { NotificationItem } from './notification-item';

const Notifications = () => {
  const {
    notifications,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    markAsRead,
    markAsUnread,
    deleteNotification
  } = useNotifications();

  const [ref, inView] = useIntersectionObserver();

  // Fetch next page when scrolled to bottom
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Reset scroll position when drawer opens

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 px-4 py-2">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="flex items-start gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[300px] text-center px-4">
        <div className="rounded-full bg-muted p-3 mb-3">
          <Check className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="font-medium text-lg">All caught up!</h3>
        <p className="text-muted-foreground text-sm mt-1">You don&apos;t have any notifications right now.</p>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1 overflow-auto">
      <div className="flex flex-col divide-y">
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onMarkAsRead={markAsRead}
            onMarkAsUnread={markAsUnread}
            onDelete={deleteNotification}
          />
        ))}
      </div>

      {/* Load more trigger */}
      {hasNextPage && (
        <div ref={ref} className="py-4 flex justify-center">
          {isFetchingNextPage ? (
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          ) : (
            <span className="text-sm text-muted-foreground">Scroll for more</span>
          )}
        </div>
      )}
    </ScrollArea>
  );
};

interface NotificationDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NotificationDrawer({ open, onOpenChange }: NotificationDrawerProps) {
  const { unreadCount, isLoading, refetch } = useNotifications();
  const { markAllAsRead, isLoading: isMarkingAllRead } = useMarkAllRead();

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      toast.success('All notifications marked as read');
    } catch (error) {
      toast.error('Failed to mark all notifications as read');
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="w-full sm:max-w-md p-0 flex flex-col h-full fixed right-0 top-0 bottom-0 rounded-none border-l">
        <DrawerHeader className="px-6 py-4 border-b flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <DrawerTitle>Notifications</DrawerTitle>
            {unreadCount > 0 && (
              <span className="inline-flex items-center justify-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleMarkAllAsRead}
                disabled={isMarkingAllRead}
                isLoading={isMarkingAllRead}
                className="text-sm">
                <MdDoneAll className="h-3 w-3 mr-1" />
                <span className="sr-only">Mark all read</span>
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={() => refetch()} className="rounded-full">
              <IoReloadOutline className={cn('h-4 w-4', isLoading && 'animate-spin')} />
              <span className="sr-only">Reload</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="rounded-full">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
        </DrawerHeader>

        <Notifications />
      </DrawerContent>
    </Drawer>
  );
}
