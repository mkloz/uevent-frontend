import { Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Skeleton } from '@/shared/components/ui/skeleton';

import { CreateEventModal } from '../../../event/components/modals/create-event-modal';
import { ShortEventCard } from '../../../event/components/short-event-card';
import { Event } from '../../../event/interfaces/event.interface';

interface CompanyEventsProps {
  events: Event[];
  title: string;
  isLoading?: boolean;
  companyId: string;
  isOwner?: boolean;
  isVerified?: boolean;
}

export const CompanyEvents = ({
  events,
  companyId,
  title,
  isOwner = false,
  isLoading,
  isVerified
}: CompanyEventsProps) => {
  const nav = useNavigate();
  const displayEvents = events?.length > 0 ? events : [];

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="h-16 w-16 rounded-md flex-shrink-0" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
        {isOwner && title === 'Upcoming Events' && <CreateEventModal companyId={companyId} disabled={!isVerified} />}
      </CardHeader>
      <CardContent>
        {displayEvents.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-muted-foreground text-lg">No events scheduled.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayEvents.slice(0, 3).map((event) => (
              <ShortEventCard key={event.id} event={event} className="border-transparent" />
            ))}
            <Button variant="outline" className="w-full" onClick={() => nav(`/events?companyId=${companyId}`)}>
              View All Events
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
