import type { User } from '@/modules/user/interfaces/user.interface';
export enum NotificationType {
  COMPANY_UPDATE = 'COMPANY_UPDATE',
  EVENT_REMINDER = 'EVENT_REMINDER',
  EVENT_UPDATE = 'EVENT_UPDATE',
  EVENT_DELETE = 'EVENT_DELETE',
  EVENT_PURCHASE = 'EVENT_PURCHASE',
  COMMENT_REPLY = 'COMMENT_REPLY',
  EVENT_NEW_ATTENDEE = 'EVENT_NEW_ATTENDEE'
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  content: string;
  isRead: boolean;
  link: string | undefined;
  createdAt: Date;

  user?: User;
  userId: string;
  sentBy?: User;
  sentById?: string;
}
