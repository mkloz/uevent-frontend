import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import {
  parseAsArrayOf,
  parseAsBoolean,
  parseAsFloat,
  parseAsInteger,
  parseAsIsoDate,
  parseAsString,
  parseAsStringEnum,
  parseAsStringLiteral,
  useQueryState,
  useQueryStates
} from 'nuqs';
import { useCallback, useMemo, useState } from 'react';
import { FiSliders } from 'react-icons/fi';

import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/utils';

import { Skeleton } from '../../../shared/components/ui/skeleton';
import { QueryKeys } from '../../../shared/constants/query-keys';
import { useUserGeolocation } from '../../../shared/hooks/maps/use-user-geolocation';
import { ActiveFilters } from '../components/active-filters';
import { EventCard } from '../components/event.card';
import { EventFilters } from '../components/event-filters';
import { EventsView, EventViewToggle } from '../components/event-view-toggle';
import { EventsDisplay } from '../components/events-display';
import { EventsSearch } from '../components/events-search';
import { EventsSort } from '../components/events-sort';
import { EventFormatType, EventThemeType } from '../interfaces/event.interface';
import { EventGetManyDto, EventService, EventSortOption } from '../services/event.service';

const EVENTS_PER_PAGE = 12;

export const EventsPage = () => {
  const [viewMode, setViewMode] = useQueryState<EventsView>(
    'view',
    parseAsStringEnum<EventsView>(Object.values(EventsView)).withDefault(EventsView.GRID)
  );
  const [showFilters, setShowFilters] = useState(false);
  const userLocation = useUserGeolocation();
  const [filters, setFilters] = useQueryStates({
    format: parseAsArrayOf(parseAsStringLiteral(Object.values(EventFormatType))).withDefault([]),
    search: parseAsString.withDefault(''),
    themes: parseAsArrayOf(parseAsStringLiteral(Object.values(EventThemeType))).withDefault([]),
    fromDate: parseAsIsoDate,
    toDate: parseAsIsoDate,
    priceTo: parseAsInteger,
    priceFrom: parseAsInteger,
    sort: parseAsStringLiteral(['date-asc', 'date-desc', 'price-low', 'price-high', 'name'] as const).withDefault(
      'date-asc'
    ),
    page: parseAsInteger.withDefault(1),
    lat: parseAsFloat,
    lng: parseAsFloat,
    companyId: parseAsString,
    address: parseAsString,
    isOnline: parseAsBoolean.withDefault(false),
    freeOnly: parseAsBoolean.withDefault(false)
  });

  const hasFilters = useMemo(() => {
    return (
      !!filters.format.length ||
      !!filters.themes.length ||
      !!filters.fromDate ||
      !!filters.toDate ||
      !!filters.priceTo ||
      !!filters.priceFrom ||
      !!filters.companyId ||
      !!filters.address
    );
  }, [filters]);

  const queryFilters: EventGetManyDto = useMemo(
    () => ({
      ...filters,
      fromDate: filters.fromDate || dayjs().startOf('minute').toDate(),
      companyId: filters.companyId || undefined,
      priceTo: filters.freeOnly ? 0 : (filters?.priceTo || 0) >= 300 ? null : filters.priceTo || 300,
      priceFrom: filters.freeOnly ? 0 : filters.priceFrom || 0,
      page: viewMode !== EventsView.MAP ? filters.page : null,
      limit: viewMode !== EventsView.MAP ? EVENTS_PER_PAGE : null,
      lat: filters.isOnline ? null : filters.lat || undefined,
      lng: filters.isOnline ? null : filters.lng || undefined,
      address: filters.isOnline ? null : filters.address || undefined
    }),
    [filters, viewMode]
  );

  const featuredQueryFilters: EventGetManyDto = useMemo(
    () => ({
      limit: 1,
      fromDate: dayjs().startOf('hour').toDate(),
      format: queryFilters.format,
      themes: queryFilters.themes,
      search: undefined,
      lat: userLocation.location?.lat,
      lng: userLocation.location?.lng
    }),
    [queryFilters.format, queryFilters.themes, userLocation.location]
  );

  const { data: featuredEvent, isLoading: isFeaturedEventLoading } = useQuery({
    queryKey: [QueryKeys.EVENTS, featuredQueryFilters],
    queryFn: () => EventService.getMany(featuredQueryFilters),
    select: (data) => data.items.at(0),
    enabled: !!userLocation.location
  });

  const handleFilterChange = useCallback(
    (filter: EventGetManyDto) => {
      const filteredEntries = Object.entries(filter).map(([key, value]) =>
        value === undefined ? [key, null] : [key, value]
      );

      const filteredObject = Object.fromEntries(filteredEntries);
      setFilters({
        ...filteredObject,
        page: 1
      });
    },
    [setFilters]
  );

  const handleSearchChange = useCallback(
    (query: string) => {
      setFilters((value) => ({ ...value, search: query, page: 1 }));
    },
    [setFilters]
  );

  const handleSortChange = useCallback(
    (option: EventSortOption) => {
      setFilters((value) => ({ ...value, sort: option, page: 1 }));
    },
    [setFilters]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      setFilters((value) => ({ ...value, page }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [setFilters]
  );

  const handleClearSearch = useCallback(() => {
    setFilters((value) => ({ ...value, search: '', page: 1 }));
  }, [setFilters]);

  const handleClearFilters = useCallback(() => {
    setFilters((value) => {
      const obj = Object.fromEntries(
        Object.entries(value).map(([key, value]) => {
          if (key === 'page' || key === 'sort' || key === 'search') {
            return [key, value];
          }
          return [key, null];
        })
      );
      return obj;
    });
  }, [setFilters]);

  const handleToggleFilters = useCallback(() => {
    setShowFilters((prev) => !prev);
  }, []);

  return (
    <div className="container mx-auto md:p-8 p-4 grid gap-6">
      <div className="grid items-center justify-center">
        <h1 className="text-3xl font-bold mb-2 text-center">Discover Events</h1>
        <p className="text-muted-foreground">Find and join exciting events happening around you</p>
      </div>

      {!!featuredEvent && (
        <div className="grid gap-2">
          <h1 className="text-2xl font-bold">Featured Event</h1>
          <p className="text-muted-foreground">Find and join exciting events happening around you</p>
          <EventCard event={featuredEvent} />
        </div>
      )}
      {isFeaturedEventLoading && (
        <div className="grid gap-2">
          <h1 className="text-2xl font-bold">Featured Event</h1>
          <p className="text-muted-foreground">Find and join exciting events happening around you</p>
          <div className="grid gap-2">
            <div className="bg-secondary rounded-xl overflow-hidden shadow h-96">
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
          </div>
        </div>
      )}

      <div className="grid gap-2">
        <div className="flex flex-col md:flex-row gap-4">
          <EventsSearch searchQuery={filters.search} onSearchChange={handleSearchChange} />

          <div className="flex gap-2 justify-between items-center flex-wrap">
            <EventsSort sortOption={filters.sort} onSortChange={handleSortChange} />
            <EventViewToggle view={viewMode} setView={setViewMode} />
            <Button
              variant="outline"
              size="icon"
              onClick={handleToggleFilters}
              className={cn(showFilters && 'bg-primary-light')}>
              <FiSliders className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <ActiveFilters
          searchQuery={filters.search}
          onClearSearch={handleClearSearch}
          hasFilters={hasFilters}
          onToggleFilters={handleClearFilters}
          companyId={filters.companyId || undefined}
          onClearCompanyId={() => setFilters((value) => ({ ...value, companyId: null }))}
        />

        <div
          className={cn(
            'p-4 bg-accent rounded-lg animate-in fade-in-0 zoom-in-95 duration-200',
            showFilters ? 'block' : 'hidden'
          )}>
          <EventFilters filters={queryFilters} onFilterChange={handleFilterChange} onReset={handleClearFilters} />
        </div>
      </div>

      <EventsDisplay
        queryFilters={queryFilters}
        viewMode={viewMode}
        onPageChange={handlePageChange}
        onResetFilters={() => {
          handleClearFilters();
          handleClearSearch();
        }}
      />
    </div>
  );
};
