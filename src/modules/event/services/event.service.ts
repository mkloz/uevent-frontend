import dayjs from 'dayjs';
import { z } from 'zod';

import { UrlResponse } from '@/shared/types/url';

import { apiClient } from '../../../shared/api/api';
import type { Paginated } from '../../../shared/types/pagination';
import { objectToSearchParams } from '../../../shared/utils/converters.utils';
import { Success } from '../../auth/interfaces/auth.interface';
import type { User } from '../../user/interfaces/user.interface';
import { Event, EventFormatType, EventSubscription, EventThemeType } from '../interfaces/event.interface';

export type EventSortOption = 'date-asc' | 'date-desc' | 'price-low' | 'price-high' | 'name';

export const EventGetManySchema = z.object({
  search: z.string().optional(),
  companyId: z.string().nullable().optional(),
  format: z.array(z.nativeEnum(EventFormatType)).optional(),
  themes: z.array(z.nativeEnum(EventThemeType)).optional(),
  fromDate: z.coerce.date().optional().nullable(),
  toDate: z.coerce.date().optional().nullable(),
  priceFrom: z.number().optional().nullable(),
  priceTo: z.number().optional().nullable(),
  sort: z.enum(['date-asc', 'date-desc', 'price-low', 'price-high', 'name']).optional(),
  lat: z.number().nullable().optional(),
  lng: z.number().nullable().optional(),
  //ignore address for now it is FE only
  address: z.string().nullable().optional(),
  page: z.coerce.number().nullable().optional(),
  limit: z.coerce.number().nullable().optional(),
  isOnline: z.coerce.boolean().nullable().optional(),
  freeOnly: z.coerce.boolean().nullable().optional()
});

export type EventGetManyDto = z.infer<typeof EventGetManySchema>;
const BaseEventSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().optional(),
  publishAt: z.coerce
    .date()
    .refine((date) => dayjs(date).isAfter(), {
      message: 'Publish date must be in the future'
    })
    .optional(),
  location: z
    .object({
      lat: z.number(),
      lng: z.number(),
      address: z.string()
    })
    .nullable()
    .optional(),
  companyId: z.string().min(1),
  startDate: z.coerce
    .date()
    .refine((date) => dayjs(date).isAfter(), {
      message: 'Start date must be in the future'
    })
    .optional(),
  endDate: z.coerce
    .date()
    .refine((date) => dayjs(date).isAfter(), {
      message: 'End date must be in the future'
    })
    .optional(),
  posterUrl: z.string().optional(),
  price: z.number().min(0),
  maxAttendees: z.number().nullable().optional(),
  showAttendeeList: z.boolean(),
  notifyOnNewAttendee: z.boolean(),
  format: z.nativeEnum(EventFormatType),
  themes: z.array(z.nativeEnum(EventThemeType))
});

export const CreateEventSchema = BaseEventSchema.refine(
  (data) => (data.startDate && data.endDate ? dayjs(data.startDate).isBefore(data.endDate) : true),
  {
    path: ['endDate'],
    message: 'End date must be after the start date'
  }
)
  .refine((data) => (data.publishAt && data.startDate ? data.publishAt < data.startDate : true), {
    path: ['publishAt'],
    message: 'Publish date must be before start date'
  })
  .refine((data) => ((data.startDate && !data.endDate) || (!data.startDate && data.endDate) ? false : true), {
    path: ['endDate'],
    message: 'Both start date and end date must be provided or neither'
  });

export type CreateEventDto = z.infer<typeof CreateEventSchema>;

export const UpdateEventSchema = BaseEventSchema.partial();

export type UpdateEventDto = z.infer<typeof UpdateEventSchema>;

interface EventAttendeesGetManyDto {
  search: string;
  page: number;
  limit: number;
}

export class EventService {
  static getById(id: string): Promise<Event> {
    return apiClient.get(`events/${id}`).json<Event>();
  }

  private static createSearchParams(dto: EventGetManyDto) {
    const search = objectToSearchParams(dto);
    if (dto.lat === null && dto.lng === null) {
      search.set('lat', 'null');
      search.set('lng', 'null');
    }

    return search;
  }

  static getMany(dto: EventGetManyDto) {
    const searchParams = this.createSearchParams(dto);

    return apiClient.get('events', { searchParams }).json<Paginated<Event>>();
  }
  static async getMyEvents(dto: EventGetManyDto) {
    const searchParams = this.createSearchParams(dto);

    return apiClient.get('users/me/events', { searchParams }).json<Paginated<Event>>();
  }

  static getUserEvents(userId: string, dto: EventGetManyDto) {
    const searchParams = this.createSearchParams(dto);

    return apiClient.get(`users/${userId}/events`, { searchParams }).json<Paginated<Event>>();
  }

  static create(dto: CreateEventDto): Promise<Event> {
    return apiClient.post('events', { json: dto }).json<Event>();
  }

  static uploadPoster(id: string, file: File): Promise<Event> {
    const formData = new FormData();
    formData.append('poster', file);
    return apiClient.patch(`events/${id}/poster`, { body: formData }).json<Event>();
  }

  static update(id: string, dto: Partial<CreateEventDto>): Promise<Event> {
    return apiClient.patch(`events/${id}`, { json: dto }).json<Event>();
  }

  static delete(id: string): Promise<void> {
    return apiClient.delete(`events/${id}`).json<void>();
  }

  static async getAttendees(id: string, dto?: EventAttendeesGetManyDto): Promise<Paginated<User>> {
    const searchParams = dto && objectToSearchParams(dto);

    return await apiClient.get(`events/${id}/attendees`, { searchParams }).json<Paginated<User>>();
  }

  static getAttendeesCount(id: string): Promise<{ currentAttendees: number }> {
    return apiClient.get(`events/${id}/attendees/count`).json();
  }

  static purchase(id: string) {
    return apiClient.post(`events/${id}/purchase`).json<UrlResponse>();
  }

  static getMyFollowed() {
    return apiClient.get(`users/me/subscriptions/events`).json<EventSubscription[]>();
  }
  static getUserFollowed(userId: string) {
    return apiClient.get(`users/${userId}/subscriptions/events`).json<EventSubscription[]>();
  }

  static follow(id: string): Promise<Success> {
    return apiClient.post(`events/${id}/subscribe`).json<Success>();
  }

  static unfollow(id: string): Promise<Success> {
    return apiClient.delete(`events/${id}/unsubscribe`).json<Success>();
  }
}
