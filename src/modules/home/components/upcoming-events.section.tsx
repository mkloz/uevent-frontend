import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import type React from 'react';
import { useMemo, useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

import { Link } from '../../../shared/components/common/link';
import { Pagination } from '../../../shared/components/common/pagination';
import { Button } from '../../../shared/components/ui/button';
import { Skeleton } from '../../../shared/components/ui/skeleton';
import { QueryKeys } from '../../../shared/constants/query-keys';
import { EventCard } from '../../event/components/event.card';
import { EventThemeType } from '../../event/interfaces/event.interface';
import { EventGetManyDto, EventService } from '../../event/services/event.service';

// Define filters
enum FilterType {
  ALL = 'All',
  TODAY = 'Today',
  WEEKEND = 'Weekend',
  FREE = 'Free',
  ONLINE = 'Online',
  HEALTH = 'Health',
  SCIENCE = 'Science',
  ART = 'Art',
  ENTERTAINMENT = 'Entertainment'
}
const createEventsFilters = (filter: FilterType, page?: number) => {
  const queryFilters: EventGetManyDto = {
    search: '',
    page: page || 1,
    limit: 4,
    sort: 'date-asc',
    format: [],
    themes: [],
    fromDate: null,
    toDate: null,
    priceFrom: null,
    priceTo: null
  };
  const now = dayjs().startOf('hour').toDate();

  switch (filter) {
    case FilterType.ALL:
      queryFilters.search = '';
      queryFilters.fromDate = now;

      break;
    case FilterType.TODAY:
      queryFilters.fromDate = now;
      queryFilters.toDate = dayjs(now).endOf('day').toDate();
      break;
    case FilterType.WEEKEND:
      queryFilters.fromDate = dayjs(now).day(5).startOf('day').toDate(); // Friday
      queryFilters.toDate = dayjs(now).day(7).endOf('day').toDate(); // Sunday
      break;
    case FilterType.FREE:
      queryFilters.priceFrom = 0;
      queryFilters.priceTo = 0;
      break;
    case FilterType.ONLINE:
      queryFilters.lat = null;
      queryFilters.lng = null;
      queryFilters.address = null;
      break;
    case FilterType.HEALTH:
      queryFilters.themes?.push(EventThemeType.HEALTH);
      break;
    case FilterType.SCIENCE:
      queryFilters.themes?.push(EventThemeType.SCIENCE);
      break;
    case FilterType.ART:
      queryFilters.themes?.push(EventThemeType.ART);
      break;
    case FilterType.ENTERTAINMENT:
      queryFilters.themes?.push(EventThemeType.ENTERTAINMENT);
      break;
    default:
      break;
  }
  return queryFilters;
};

const UpcomingEventsSection: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState(FilterType.ALL);
  const [currentPage, setCurrentPage] = useState(1);
  const filters = useMemo(() => createEventsFilters(activeFilter, currentPage), [activeFilter, currentPage]);
  // Fetch events with React Query
  const { data: eventsData, isLoading } = useQuery({
    queryKey: [QueryKeys.EVENTS, filters],
    queryFn: () => EventService.getMany(filters),
    enabled: !!filters
  });

  const totalPages = eventsData?.meta.totalPages || 1;

  return (
    <section className="py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold mb-2">Upcoming Events</h2>
          <p className="text-muted-foreground">Discover events that match your interests</p>
        </div>

        <div className="mt-4 md:mt-0 items-center hidden md:flex">
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 disabled:opacity-50">
              <FiChevronLeft />
            </button>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 disabled:opacity-50">
              <FiChevronRight />
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className={`mb-8 overflow-x-auto scrollbar-hide`}>
        <div className="flex gap-2 pb-2 flex-wrap">
          {Object.values(FilterType).map((filter) => (
            <Button
              key={filter}
              onClick={() => {
                setActiveFilter(filter);
                setCurrentPage(1);
              }}
              variant={activeFilter === filter ? 'default' : 'outline'}>
              {filter}
            </Button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((index) => (
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
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-8">
          {eventsData?.items?.map((event) => <EventCard key={event.id} event={event} />)}
        </div>
      )}
      {eventsData?.items?.length === 0 && !isLoading && (
        <div className="text-center h-96 grid justify-center items-center border-2  rounded-xl bg-muted">
          <p className="text-muted-foreground text-xl">No events found for this filter</p>
        </div>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => {
          setCurrentPage(page);
        }}
        className="mt-8 md:hidden"
      />

      {/* View all button */}
      <div className="mt-8 text-center">
        <Link to="/events" className="text-xl font-semibold" withArrowRight>
          View All Events
        </Link>
      </div>
    </section>
  );
};

export default UpcomingEventsSection;
