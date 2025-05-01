import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Skeleton } from '@/shared/components/ui/skeleton';

import { Pagination } from '../../../../shared/components/common/pagination';
import { QueryKeys } from '../../../../shared/constants/query-keys';
import type { Event } from '../../interfaces/event.interface';
import { EventService } from '../../services/event.service';
import { ShortEventCard } from '../short-event-card';

interface SimilarEventsProps {
  event: Event;
}

const ITEMS_PER_PAGE = 5;

export const SimilarEvents = ({ event }: SimilarEventsProps) => {
  const [page, setPage] = useState(1);
  const { data: relatedEvents, isLoading } = useQuery({
    queryKey: [
      QueryKeys.EVENTS,
      {
        format: event.format,
        themes: event.themes,
        limit: ITEMS_PER_PAGE,
        page
      }
    ],
    queryFn: () => EventService.getMany({ format: [event.format], limit: ITEMS_PER_PAGE, themes: event.themes, page })
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Similar Events</CardTitle>
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

  if (relatedEvents?.items.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Similar Events</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {relatedEvents?.items.map((event) => (
          <ShortEventCard key={event.id} event={event} className="border-transparent" />
        ))}
        {relatedEvents?.items && relatedEvents?.items.length > 0 && (
          <Pagination currentPage={page} totalPages={relatedEvents.meta.totalPages} onPageChange={setPage} compact />
        )}
      </CardContent>
    </Card>
  );
};
