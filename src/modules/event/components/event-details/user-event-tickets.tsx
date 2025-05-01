import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';

import { Pagination } from '@/shared/components/common/pagination';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { QueryKeys } from '@/shared/constants/query-keys';

import { useAuth } from '../../../auth/queries/use-auth.query';
import { TicketCard } from '../../../ticket/components/ticket-card';
import { UserService } from '../../../user/services/user.service';

interface UserTicketsProps {
  eventId?: string;
}

const ITEMS_PER_PAGE = 1;

export const UserEventTickets = ({ eventId }: UserTicketsProps) => {
  const me = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const query = useMemo(
    () => ({
      page: currentPage,
      limit: ITEMS_PER_PAGE,
      eventId
    }),
    [currentPage, eventId]
  );

  const { data: tickets, isLoading } = useQuery({
    queryKey: [QueryKeys.USER_TICKETS, query],
    queryFn: () => UserService.getTickets(query),
    enabled: !!me.data?.id
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 4 })
          .fill(0)
          .map((_data, i) => (
            <div key={i} className="bg-card rounded-lg border p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <Skeleton className="h-24 w-full md:w-24 rounded-md flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-5 w-24" />
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    );
  }

  if (!tickets?.items.length) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {tickets?.items.map((ticket) => <TicketCard ticket={ticket} key={ticket.id} className="w-full shadow-none" />)}
      </div>

      {(tickets?.meta?.totalPages || 0) > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination
            compact
            currentPage={tickets?.meta.currentPage || 1}
            totalPages={tickets?.meta?.totalPages || 0}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
};
