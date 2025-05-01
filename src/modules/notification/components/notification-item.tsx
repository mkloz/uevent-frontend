'use client';

import { MoreVertical, Trash, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { UserAvatar } from '@/shared/components/common/user-avatar';
import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/shared/components/ui/dropdown-menu';

import { ConditionalLink } from '../../../shared/components/common/link';
import { cn } from '../../../shared/lib/utils';
import type { Notification } from '../interfaces/notification.interface';
import { formatNotificationTime } from '../utils/format-notification-time';
import { getNotificationColor } from '../utils/notification-colors';
import { getNotificationIcon } from '../utils/notification-icons';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => Promise<void>;
  onMarkAsUnread: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function NotificationItem({ notification, onMarkAsRead, onMarkAsUnread, onDelete }: NotificationItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const NotificationIcon = getNotificationIcon(notification.type);
  const colorClass = getNotificationColor(notification.type);
  const formattedTime = formatNotificationTime(notification.createdAt);

  const handleToggleRead = async () => {
    try {
      setIsUpdating(true);
      if (notification.isRead) {
        await onMarkAsUnread(notification.id);
      } else {
        await onMarkAsRead(notification.id);
      }
    } catch (error) {
      toast.error('Failed to update notification status');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await onDelete(notification.id);
      toast.success('Notification deleted successfully');
    } catch (error) {
      toast.error('Failed to delete notification');
      setIsDeleting(false);
    }
  };

  return (
    <div
      className={cn(
        `flex gap-3 p-4 transition-colors bg-background border-2 border-primary hover:bg-accent relative`,
        notification.isRead && 'bg-accent border-border'
      )}>
      <div className="flex-1 min-w-0">
        <ConditionalLink
          to={notification.link}
          className="block group p-0"
          onClick={() => {
            if (!notification.isRead) {
              onMarkAsRead(notification.id);
            }
          }}>
          <div
            className={cn(
              'flex items-center gap-2',
              notification.isRead ? 'text-muted-foreground' : 'text-foreground'
            )}>
            {/* Notification Icon */}
            <div className={`flex-shrink-0 rounded-full ${colorClass} bg-opacity-10`}>
              <NotificationIcon className={`h-5 w-5 ${colorClass}`} />
            </div>
            <h4 className={`font-medium text-sm ${!notification.isRead ? 'text-foreground' : 'text-muted-foreground'}`}>
              {notification.title}
            </h4>
            <span className="text-xs text-muted-foreground whitespace-nowrap flex-shrink-0 ml-auto">
              {formattedTime}
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-6"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                  }}>
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">More options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleToggleRead} disabled={isUpdating}>
                  <X className="mr-2 h-4 w-4" />
                  {notification.isRead ? 'Mark as Unread' : 'Mark as Read'}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="text-destructive focus:text-destructive">
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{notification.content}</p>

          {notification.sentBy && (
            <div className="flex items-center gap-2 mt-2">
              <UserAvatar user={notification.sentBy} className="h-5 w-5" />
              <span className="text-xs text-muted-foreground">{notification.sentBy.name}</span>
            </div>
          )}
        </ConditionalLink>
      </div>
    </div>
  );
}
