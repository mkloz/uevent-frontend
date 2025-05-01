import { useQuery } from '@tanstack/react-query';

import { EventCard } from '@/modules/event/components/event.card';
import { EventsView } from '@/modules/event/components/event-view-toggle';
import { EventsMap } from '@/modules/event/components/events-map';
import { NoEventsFound } from '@/modules/event/components/no-events-found';
import { Pagination, PaginationResultsInfo } from '@/shared/components/common/pagination';
import { Skeleton } from '@/shared/components/ui/skeleton';

import { QueryKeys } from '../../../shared/constants/query-keys';
import { EventGetManyDto, EventService } from '../services/event.service';

interface EventsDisplayProps {
  viewMode: EventsView;
  queryFilters: EventGetManyDto;
  onPageChange: (page: number) => void;
  onResetFilters?: () => void;
}

export const EventsDisplay = ({ viewMode, queryFilters, onResetFilters, onPageChange }: EventsDisplayProps) => {
  const { data: events, isLoading } = useQuery({
    queryKey: [QueryKeys.EVENTS, queryFilters],
    queryFn: () => EventService.getMany(queryFilters)
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="bg-secondary rounded-xl overflow-hidden shadow h-96">
            <Skeleton className="h-1/3 w-full" />
            <div className="p-4 space-y-4">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-20 w-full" />
              <div className="flex justify-between">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-28" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (events?.items.length === 0 || !events?.meta) {
    return <NoEventsFound onResetFilters={onResetFilters} />;
  }

  return (
    <div className="space-y-8">
      {viewMode === EventsView.GRID && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8">
          {events?.items.map((event) => <EventCard event={event} key={event.id} />)}
        </div>
      )}

      {viewMode === EventsView.LIST && (
        <div className="space-y-8">{events?.items.map((event) => <EventCard event={event} key={event.id} />)}</div>
      )}

      {viewMode === EventsView.MAP && (
        <div className="h-150 rounded-lg overflow-hidden">
          <EventsMap events={events?.items} />
        </div>
      )}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <PaginationResultsInfo
          currentPage={events?.meta.currentPage}
          pageSize={events.meta.itemsPerPage}
          totalItems={events.meta.totalItemsCount}
        />

        <Pagination
          currentPage={events?.meta.currentPage}
          totalPages={events.meta.totalPages}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
};
