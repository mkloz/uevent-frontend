import { useQuery } from '@tanstack/react-query';
import { type FC } from 'react';
import { Link } from 'react-router-dom';

import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Skeleton } from '@/shared/components/ui/skeleton';

import { QueryKeys } from '../../../../shared/constants/query-keys';
import { EventService } from '../../services/event.service';
import { ShortEventCard } from '../short-event-card';

interface CompanyEventsProps {
  companyId?: string;
}

export const CompanyEvents: FC<CompanyEventsProps> = ({ companyId }) => {
  const { data: organizerEvents, isLoading } = useQuery({
    queryKey: [QueryKeys.COMPANY_EVENTS, { companyId }],
    queryFn: () => EventService.getMany({ companyId, limit: 2 })
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>More from this Organizer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
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

  if (!organizerEvents?.items || organizerEvents.items.length < 1) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">More from this Company</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {organizerEvents?.items.map((event) => (
          <ShortEventCard key={event.id} event={event} className="border-transparent" />
        ))}

        {organizerEvents.meta.totalPages > 0 && (
          <Link to={`/events?companyId=${companyId}`} className="block w-full">
            <Button variant="outline" className="w-full">
              View All Events
            </Button>
          </Link>
        )}
      </CardContent>
    </Card>
  );
};
