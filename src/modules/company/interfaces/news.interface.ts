import { z } from 'zod';

import type { Comment } from '../../comments/interfaces/comment.interface';
import type { Reaction } from '../../comments/interfaces/reaction.interface';
import type { Company } from './company.interface';

export interface CompanyNews {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  // Relations
  company: Company;
  comments?: Comment[];
  reaction?: Reaction[];
}

export const CompanyNewsSchema = z.object({
  companyId: z.string(),
  title: z.string().trim().min(1, 'Title is required').max(100, 'Title must be at most 100 characters'),
  content: z.string().trim().min(1, 'Content is required').max(1000, 'Content must be at most 1000 characters')
});
export type CompanyNewsDto = z.infer<typeof CompanyNewsSchema>;
