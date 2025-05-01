import { z } from 'zod';

import { LocationSchema } from '@/shared/types/maps';

import type { Event, Location } from '../../event/interfaces/event.interface';
import type { User } from '../../user/interfaces/user.interface';
import type { CompanyNews } from './news.interface';

export interface Company {
  id: string;
  name: string;
  email: string;
  description?: string;
  logo?: string;
  website?: string;
  coverImage?: string;
  locationId: string;
  stripeAccountId?: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  ownerId: string;
  // Relations
  location: Location;
  owner: User;
  events?: Event[];
  news?: CompanyNews[];
  subscribers?: CompanySubscription[];
  _count?: {
    events?: number;
    subscribers?: number;
  };
}

export interface CompanySubscription {
  id: string;
  createdAt: Date;
  companyId: string;
  userId: string;
  // Relations
  user: User;
  company: Company;
}

export const CompanySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: 'Name is required' })
    .max(120, { message: 'Name must be at most 120 characters' }),
  description: z
    .string()
    .trim()
    .min(10, { message: 'Description must be at least 10 characters' })
    .max(1000, { message: 'Description must be at most 1000 characters' }),
  email: z
    .string()
    .trim()
    .email('Email is invalid')
    .min(1, { message: 'Email is required' })
    .max(120, { message: 'Email must be at most 120 characters' }),
  website: z
    .string()
    .trim()
    .url('Website is invalid')
    .min(1, { message: 'Website is required' })
    .max(120, { message: 'Website must be at most 50 characters' }),
  location: LocationSchema
});
export type CompanyDto = z.infer<typeof CompanySchema>;

export const CompanyPromoCodeSchema = z.object({
  discount: z
    .number({ invalid_type_error: '', coerce: false })
    .min(1, { message: 'Discount must be at least 1%' })
    .max(100, { message: 'Discount must be at most 100%' })
    .int({ message: 'Discount must be an integer' }),
  maxUses: z
    .number()
    .min(1, { message: 'Max uses must be at least 1' })
    .max(1000, { message: 'Max uses must be at most 1000' })
    .int({ message: 'Max uses must be an integer' })
});
export type CompanyPromoCodeDto = z.infer<typeof CompanyPromoCodeSchema>;

export interface CompanyPromoCode {
  id: string;
  code: string;
  discount: number;
  maxUses: number;
  uses: number;
}
