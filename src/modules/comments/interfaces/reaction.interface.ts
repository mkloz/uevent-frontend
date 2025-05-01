import type { CompanyNews } from '../../company/interfaces/news.interface';
import type { User } from '../../user/interfaces/user.interface';
import type { Comment } from './comment.interface';

export enum ReactionType {
  LIKE = 'LIKE',
  DISLIKE = 'DISLIKE',
  LOVE = 'LOVE',
  LAUGH = 'LAUGH',
  SAD = 'SAD',
  ANGRY = 'ANGRY'
}
export interface ReactionIdRelationField {
  commentId?: string;
  newsId?: string;
}

export interface Reaction {
  id: string;
  type: ReactionType;
  createdAt: Date;
  userId: string;
  commentId?: string;
  newsId?: string;
  // Relations
  comment?: Comment;
  news?: CompanyNews;
  user: User;
}

export type ReactionCount = Array<{ type: ReactionType; count: number }>;
