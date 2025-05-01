import { useMutation } from '@tanstack/react-query';
import { CreditCard, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '@/modules/auth/queries/use-auth.query';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Progress } from '@/shared/components/ui/progress';
import { Separator } from '@/shared/components/ui/separator';
import dayjs from '@/shared/lib/dayjs';

import type { Event } from '../../interfaces/event.interface';
import { EventService } from '../../services/event.service';

interface EventTicketsProps {
  event: Event;
  currentAttendees: number;
}

export const EventTickets = ({ event, currentAttendees }: EventTicketsProps) => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const isSoldOut = event.maxAttendees && currentAttendees === event.maxAttendees;
  const isEventPassed = event.endDate
    ? dayjs(event.endDate).isBefore(dayjs())
    : dayjs(event.startDate).isBefore(dayjs());

  // Calculate attendance percentage
  const attendancePercentage =
    event.maxAttendees && currentAttendees !== undefined
      ? Math.round((currentAttendees / event.maxAttendees) * 100)
      : 0;

  // Calculate remaining tickets
  const remainingTickets =
    event.maxAttendees && currentAttendees !== undefined ? event.maxAttendees - currentAttendees : null;

  const { mutate: purchase, isPending: isPurchasing } = useMutation({
    mutationFn: EventService.purchase,
    onSuccess: ({ url }) => {
      window.location.href = url;
    }
  });

  const handlePurchase = () => {
    if (!isLoggedIn) {
      navigate('/auth/login');
      return;
    }

    purchase(event.id);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Tickets</span>
            {event.price ? (
              <span className="text-xl font-bold">${event.price.toFixed(2)}</span>
            ) : (
              <span className="text-green-600">Free</span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {event.maxAttendees && (
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Availability</span>
                </span>
                <span className="font-medium">
                  {isSoldOut ? (
                    <span className="text-destructive">Sold Out</span>
                  ) : (
                    <span>{remainingTickets} left</span>
                  )}
                </span>
              </div>
              <Progress value={attendancePercentage} className="h-2" />
            </div>
          )}
          <Button
            className="w-full"
            size="lg"
            disabled={isSoldOut || isEventPassed || isPurchasing}
            onClick={handlePurchase}
            isLoading={isPurchasing}>
            <CreditCard className="mr-2 h-4 w-4" />
            {isSoldOut ? 'Sold Out' : isEventPassed ? 'Event Ended' : `Get ${event.price ? 'Tickets' : 'Free Ticket'}`}
          </Button>
          <Separator />

          <div className="rounded-lg bg-muted/50 p-4">
            <h3 className="font-medium mb-3">Event Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date:</span>
                <span>{dayjs(event.startDate).format('MMM D, YYYY')}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Time:</span>
                <span>{dayjs(event.startDate).format('h:mm A')}</span>
              </div>

              {event.location && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Location:</span>
                  <span className="text-right max-w-[180px] truncate">{event.location.address}</span>
                </div>
              )}

              {event.company && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Organizer:</span>
                  <span>{event.company.name}</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};
