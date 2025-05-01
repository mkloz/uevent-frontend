import { Bell, Calendar, CreditCard, MessageSquare, Users } from 'lucide-react';

export function getNotificationIcon(type: string) {
  if (type.includes('EVENT')) {
    return Calendar;
  }

  if (type.includes('TICKET') || type.includes('PAYMENT')) {
    return CreditCard;
  }

  if (type.includes('COMMENT')) {
    return MessageSquare;
  }

  if (type.includes('FOLLOW') || type.includes('USER')) {
    return Users;
  }

  // Default icon
  return Bell;
}
