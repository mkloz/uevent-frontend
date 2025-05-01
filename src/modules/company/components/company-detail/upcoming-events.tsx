import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { FC, useMemo } from 'react';

import { QueryKeys } from '../../../../shared/constants/query-keys';
import { useAuth } from '../../../auth/queries/use-auth.query';
import { EventGetManyDto, EventService } from '../../../event/services/event.service';
import { Company } from '../../interfaces/company.interface';
import { CompanyEvents } from './company-events';

interface UpcomingEventsProps {
  company: Company | undefined;
}

const ITEMS_PER_PAGE = 4;

export const UpcomingEvents: FC<UpcomingEventsProps> = ({ company }) => {
  const me = useAuth();
  const getManyQuery: EventGetManyDto = useMemo(
    () => ({
      companyId: company?.id ?? '',
      fromDate: dayjs().startOf('hour').toDate(),
      sort: 'date-asc',
      limit: ITEMS_PER_PAGE
    }),
    [company?.id]
  );

  const { data: upcomingEvents, isLoading } = useQuery({
    queryKey: [QueryKeys.COMPANY_EVENTS, company?.id, getManyQuery],
    queryFn: () => EventService.getMany(getManyQuery),
    enabled: !!company?.id && !!company
  });

  if (!upcomingEvents || !company?.id) {
    return null;
  }
  const isOwner = company?.ownerId === me?.data?.id;

  return (
    <CompanyEvents
      events={upcomingEvents.items}
      companyId={company?.id}
      title="Upcoming Events"
      isOwner={isOwner}
      isLoading={isLoading}
      isVerified={company?.isVerified}
    />
  );
};
