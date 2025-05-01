import { useQuery } from '@tanstack/react-query';
import { Search, Users } from 'lucide-react';
import { useMemo, useState } from 'react';

import { Link } from '@/shared/components/common/link';
import { Pagination } from '@/shared/components/common/pagination';
import { Badge } from '@/shared/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Progress } from '@/shared/components/ui/progress';
import { QueryKeys } from '@/shared/constants/query-keys';

import { useDebounce } from '../../../../shared/components/ui/multi-selector';
import { EventService } from '../../services/event.service';
import { EventAttendee } from './event-attendee';

interface EventAttendeesProps {
  eventId?: string;
  maxAttendees?: number;
  currentAttendees?: number;
}

export const EventAttendees = ({ eventId, maxAttendees, currentAttendees = 0 }: EventAttendeesProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const [debouncedSearch] = useDebounce(searchQuery);

  const attendeesQuery = useMemo(
    () => ({ search: debouncedSearch, page: currentPage, limit: 16 }),
    [debouncedSearch, currentPage]
  );

  const { data, isLoading } = useQuery({
    queryKey: [QueryKeys.EVENT_ATTENDEES, eventId, attendeesQuery],
    queryFn: () => EventService.getAttendees(eventId!, attendeesQuery),
    enabled: !!eventId
  });

  const attendees = data?.items ?? [];
  const meta = data?.meta ?? { currentPage: 1, totalPages: 1 };

  const attendancePercentage = useMemo(() => {
    if (!maxAttendees) return 0;
    return Math.round((currentAttendees / maxAttendees) * 100);
  }, [currentAttendees, maxAttendees]);

  return (
    <Card className="gap-2">
      <CardHeader className="flex justify-between items-center flex-wrap gap-3">
        <CardTitle className="flex items-center gap-2 grow">
          <Users className="h-5 w-5 text-primary" />
          Attendees
          <Badge variant="outline" className="ml-2">
            {currentAttendees}
          </Badge>
        </CardTitle>

        <div className="relative basis-40 grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search attendees..."
            className="pl-9 h-9"
            type="search"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1); // Reset to page 1 on new search
            }}
          />
        </div>
      </CardHeader>

      <CardContent className="pt-2 gap-2 flex flex-col min-h-80">
        {/* Attendance progress */}
        {maxAttendees && (
          <div className="mb-2">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">
                {currentAttendees} of {maxAttendees} spots filled
              </span>
              <span className="font-medium">{maxAttendees - currentAttendees} remaining</span>
            </div>
            <Progress value={attendancePercentage} className="h-2" />
          </div>
        )}

        {/* Loading state */}
        {isLoading ? (
          <div className="text-muted-foreground flex grow justify-center items-center text-sm">
            Loading attendees...
          </div>
        ) : (
          <>
            {/* No attendees */}
            {attendees.length === 0 ? (
              <div className="text-muted-foreground flex grow justify-center items-center text-sm text-center">
                {currentAttendees > 0
                  ? 'Some attendees have hidden their profiles or cannot be found due to search filters.'
                  : 'No attendees yet. Be the first!'}
              </div>
            ) : (
              <>
                {/* Attendee grid */}
                <div className="grid w-full grid-flow-row grid-cols-[repeat(auto-fill,_6.5rem)] grid-rows-[auto] justify-center gap-2 grow">
                  {attendees.map((attendee) => (
                    <Link key={attendee.id} to={`/users/${attendee.id}`} unstyled className="mx-auto">
                      <EventAttendee attendee={attendee} />
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                <Pagination currentPage={meta.currentPage} totalPages={meta.totalPages} onPageChange={setCurrentPage} />
              </>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
