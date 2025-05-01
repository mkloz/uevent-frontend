import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { Calendar, LucideScanEye } from 'lucide-react';
import { useMemo, useState } from 'react';

import { Pagination } from '@/shared/components/common/pagination';

import { Skeleton } from '../../../../shared/components/ui/skeleton';
import { QueryKeys } from '../../../../shared/constants/query-keys';
import { useAuth } from '../../../auth/queries/use-auth.query';
import { ShortEventCard } from '../../../event/components/short-event-card';
import { EventService } from '../../../event/services/event.service';
import { UserNoItems } from './user-no-items';

interface UserUpcomingEventsProps {
  userId: string;
}
const ITEMS_PER_PAGE = 10;

export const UserUpcomingEvents = ({ userId }: UserUpcomingEventsProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const me = useAuth();
  const eventQuery = useMemo(
    () => ({
      page: currentPage,
      limit: ITEMS_PER_PAGE,
      fromDate: dayjs().startOf('hour').toDate()
    }),
    [currentPage]
  );
  // Fetch user's attended events
  const {
    data: attendedEventsData,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: [QueryKeys.USER_EVENTS, userId, eventQuery, me.data?.id],
    queryFn: () =>
      me.data?.id === userId ? EventService.getMyEvents(eventQuery) : EventService.getUserEvents(userId, eventQuery),
    enabled: !!userId
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 8 }, (_data, i) => (
          <div key={i} className="bg-card rounded-lg border p-4">
            <div className="flex gap-4">
              <Skeleton className="h-16 w-16 rounded-full flex-shrink-0" />
              <div className="flex-1">
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-8 w-24" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  if (!attendedEventsData || attendedEventsData.items.length === 0) {
    return (
      <UserNoItems
        icon={Calendar}
        title="No Upcoming Events"
        description="This user hasn't registered for any upcoming events yet."
      />
    );
  }

  if (isError && error?.message?.toLocaleLowerCase().includes('private')) {
    return (
      <UserNoItems
        icon={LucideScanEye}
        title="Private Events"
        description="User has desided to keep their events private."
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {attendedEventsData.items.map((event) => (
          <ShortEventCard event={event} key={event.id} />
        ))}
      </div>

      {attendedEventsData.meta.totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination
            currentPage={attendedEventsData.meta.currentPage}
            totalPages={attendedEventsData.meta.totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
};
