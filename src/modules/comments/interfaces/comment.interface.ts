import type { CompanyNews } from '../../company/interfaces/news.interface';
import type { Event } from '../../event/interfaces/event.interface';
import type { User } from '../../user/interfaces/user.interface';
import type { Reaction } from './reaction.interface';
export interface Comment {
  id: string;
  content: string;
  parentId?: string; // ID of the comment being replied to
  createdAt: Date;
  updatedAt: Date;
  eventId?: string;
  companyNewsId?: string;
  userId: string;
  // Relations
  event?: Event;
  user: User;
  companyNews?: CompanyNews;
  replies?: Comment[];
  replyTo?: Comment;
  reactions?: Reaction[];
  _count?: {
    replies?: number;
    reactions?: number;
  };
}
