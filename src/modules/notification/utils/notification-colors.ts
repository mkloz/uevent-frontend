export function getNotificationColor(type: string) {
  if (type.includes('EVENT')) {
    return 'text-blue-500';
  }

  if (type.includes('TICKET') || type.includes('PAYMENT')) {
    return 'text-green-500';
  }

  if (type.includes('COMMENT')) {
    return 'text-amber-500';
  }

  if (type.includes('FOLLOW') || type.includes('USER')) {
    return 'text-purple-500';
  }

  // Default color
  return 'text-primary';
}
