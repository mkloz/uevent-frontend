import type { Event, EventAttendee } from '../../event/interfaces/event.interface';
import type { User } from '../../user/interfaces/user.interface';
import type { Payment } from './payment.interface';

export enum TicketStatusType {
  VALID = 'VALID',
  USED = 'USED',
  CANCELLED = 'CANCELLED'
}

export interface Ticket {
  id: string;
  purchaseDate: Date;
  status: TicketStatusType;
  attendeeId: string;
  promoCodeId?: string;
  eventId: string;
  userId: string;
  // Relations
  event: Event;
  user: User;
  payment?: Payment;
  attendee: EventAttendee;
}
