import type { Comment } from '../../comments/interfaces/comment.interface';
import type { Company } from '../../company/interfaces/company.interface';
import type { Ticket } from '../../ticket/interfaces/ticket.interface';
import type { User } from '../../user/interfaces/user.interface';

export interface Location {
  address: string;
  lat: number;
  lng: number;
}

export enum EventFormatType {
  CONFERENCE = 'CONFERENCE',
  LECTURE = 'LECTURE',
  WORKSHOP = 'WORKSHOP',
  SEMINAR = 'SEMINAR',
  MEETUP = 'MEETUP',
  PANEL_DISCUSSION = 'PANEL_DISCUSSION',
  WEBINAR = 'WEBINAR',
  NETWORKING = 'NETWORKING',
  PERFORMANCE = 'PERFORMANCE',
  EXHIBITION = 'EXHIBITION',
  COMPETITION = 'COMPETITION',
  FESTIVAL = 'FESTIVAL',
  PARTY = 'PARTY',
  CEREMONY = 'CEREMONY',
  TRAINING = 'TRAINING',
  OTHER = 'OTHER'
}

export enum EventThemeType {
  ART = 'ART',
  MUSIC = 'MUSIC',
  TECHNOLOGY = 'TECHNOLOGY',
  BUSINESS = 'BUSINESS',
  EDUCATION = 'EDUCATION',
  HEALTH = 'HEALTH',
  SPORTS = 'SPORTS',
  FOOD = 'FOOD',
  TRAVEL = 'TRAVEL',
  FASHION = 'FASHION',
  CULTURE = 'CULTURE',
  SCIENCE = 'SCIENCE',
  ENVIRONMENT = 'ENVIRONMENT',
  ENTERTAINMENT = 'ENTERTAINMENT',
  POLITICS = 'POLITICS',
  SOCIAL = 'SOCIAL',
  OTHER = 'OTHER'
}

export interface Event {
  id: string;
  title: string;
  description: string;
  posterUrl?: string;
  startDate: Date;
  endDate: Date;
  price: number;
  maxAttendees?: number; // Null means unlimited
  publishDate: Date;
  showAttendeeList: boolean;
  notifyOnNewAttendee: boolean;
  redirectUrl?: string; // URL to redirect after ticket purchase
  format: EventFormatType;
  stripeProductId?: string;
  stripePriceId?: string;
  createdAt: Date;
  updatedAt: Date;
  locationId?: string;
  companyId: string;
  creatorId: string;
  // Relations
  creator: User;
  company: Company;
  location?: Location;
  attendees?: EventAttendee[];
  tickets?: Ticket[];
  comments?: Comment[];
  subscribers?: EventSubscription[];
  themes: EventThemeType[];
}

export interface EventAttendee {
  id: string;
  createdAt: Date;
  userId: string;
  eventId: string;
  // Relations
  event: Event;
  user: User;
  ticket?: Ticket;
}

export interface EventSubscription {
  id: string;
  createdAt: Date;
  userId: string;
  eventId: string;
  // Relations
  event: Event;
  user: User;
}
