import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { QueryKeys } from '../../../shared/constants/query-keys';
import { useUserGeolocation } from '../../../shared/hooks/maps/use-user-geolocation';
import { CompanyGetManyDto, CompanyService, CompanySortBy } from '../services/company.service';
interface UseFeaturedCompaniesProps {
  sortBy?: CompanySortBy;
  currentPage?: number;
}
export const useFeaturedCompanies = ({ sortBy, currentPage }: UseFeaturedCompaniesProps) => {
  const useerLocation = useUserGeolocation();
  const featuredCompaniesQuery: CompanyGetManyDto = useMemo(
    () => ({
      sortBy: sortBy || CompanySortBy.NEWEST,
      page: currentPage || 1,
      limit: 3,
      lat: useerLocation.location?.lat,
      lng: useerLocation.location?.lng,
      isVerified: true
    }),
    [sortBy, currentPage, useerLocation.location]
  );

  return useQuery({
    queryKey: [QueryKeys.COMPANIES, featuredCompaniesQuery],
    queryFn: () => CompanyService.getMany(featuredCompaniesQuery),
    enabled: !!useerLocation.location
  });
};
