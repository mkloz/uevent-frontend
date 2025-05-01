import { useQuery } from '@tanstack/react-query';
import { Building2, TrendingUp, Users } from 'lucide-react';

import { QueryKeys } from '../../../shared/constants/query-keys';
import { EventService } from '../../event/services/event.service';
import { CompanyService } from '../services/company.service';

export const CompaniesStatistics = () => {
  const { data: allCompaniesData, isLoading: isLoadingAll } = useQuery({
    queryKey: [QueryKeys.COMPANIES],
    queryFn: () => CompanyService.getMany({ limit: 0 })
  });

  const { data: allEventsData, isLoading: isLoadingEvents } = useQuery({
    queryKey: [QueryKeys.EVENTS],
    queryFn: () => EventService.getMany({ limit: 0 })
  });

  const { data: allSubscribersData, isLoading: isLoadingSubscribers } = useQuery({
    queryKey: [QueryKeys.COMPANIES, 'subscribers'],
    queryFn: () => CompanyService.getSubscriptionsCount()
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-card rounded-xl p-6 border shadow-sm flex items-center">
        <div className="rounded-full bg-primary/10 p-3 mr-4">
          <Building2 className="h-6 w-6 text-primary" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Total Companies</p>
          <h3 className="text-2xl font-bold">
            {isLoadingAll ? 'Loading...' : allCompaniesData?.meta?.totalItemsCount}
          </h3>
        </div>
      </div>

      <div className="bg-card rounded-xl p-6 border shadow-sm flex items-center">
        <div className="rounded-full bg-primary/10 p-3 mr-4">
          <TrendingUp className="h-6 w-6 text-primary" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Total Events</p>
          <h3 className="text-2xl font-bold">
            {isLoadingEvents ? 'Loading...' : allEventsData?.meta?.totalItemsCount}
          </h3>
        </div>
      </div>

      <div className="bg-card rounded-xl p-6 border shadow-sm flex items-center">
        <div className="rounded-full bg-primary/10 p-3 mr-4">
          <Users className="h-6 w-6 text-primary" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Total Followers</p>
          <h3 className="text-2xl font-bold">
            {isLoadingSubscribers ? 'Loading...' : allSubscribersData?.companySubscriptions}
          </h3>
        </div>
      </div>
    </div>
  );
};
