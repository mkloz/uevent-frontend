import type { User } from '../../user/interfaces/user.interface';
import type { Ticket } from './ticket.interface';

export enum PaymentStatusType {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED'
}

export interface Payment {
  id: string;
  amount: number;
  status: PaymentStatusType;
  paymentIntent?: string; // Stripe payment intent ID
  createdAt: Date;
  updatedAt: Date;
  ticketId: string;
  // Relations
  user: User;
  userId: string;
  ticket: Ticket;
}
