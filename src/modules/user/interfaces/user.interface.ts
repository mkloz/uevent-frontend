import type { Comment } from '../../comments/interfaces/comment.interface';
import type { Reaction } from '../../comments/interfaces/reaction.interface';
import type { Company, CompanySubscription } from '../../company/interfaces/company.interface';
import type { Event, EventAttendee, EventSubscription } from '../../event/interfaces/event.interface';
import type { Notification } from '../../notification/interfaces/notification.interface';
import type { Payment } from '../../ticket/interfaces/payment.interface';
import type { Ticket } from '../../ticket/interfaces/ticket.interface';

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export enum AuthProviderType {
  EMAIL = 'EMAIL',
  GOOGLE = 'GOOGLE'
}

export enum NotificationChannelType {
  EMAIL = 'EMAIL',
  IN_APP = 'IN_APP',
  BOTH = 'BOTH',
  NONE = 'NONE'
}

export interface UserSettings {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  // privacy settings
  showInAttendeeList: boolean;
  showFollowingList: boolean;
  // Notification preferences
  eventReminderChannel: NotificationChannelType;
  ticketPurchaseChannel: NotificationChannelType;
  newCommentChannel: NotificationChannelType;
  companyUpdateChannel: NotificationChannelType;
  themeMainColor?: string; // Hex color code
  user?: User[];
}

export interface User {
  id: string;
  email: string;
  password?: string; // Null if using OAuth
  name: string;
  avatar?: string;
  bio?: string;
  authProvider: AuthProviderType;
  role: UserRole;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  settingsId?: string;
  // Relations
  settings?: UserSettings;
  companies?: Company[];
  tickets?: Ticket[];
  comments?: Comment[];
  notifications?: Notification[];
  sentNotifications?: Notification[];
  events?: Event[];
  attendingEvents?: EventAttendee[];
  subscribedEvents?: EventSubscription[];
  subscribedCompanies?: CompanySubscription[];
  payments?: Payment[];
  reaction?: Reaction[];
}
