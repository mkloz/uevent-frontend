import { useQuery } from '@tanstack/react-query';
import { parseAsInteger, parseAsString, useQueryState } from 'nuqs';
import { useEffect, useMemo, useState } from 'react';

import { QueryKeys } from '../../../shared/constants/query-keys';
import { useUserGeolocation } from '../../../shared/hooks/maps/use-user-geolocation';
import { CompanyList } from '../components/company-list';
import { CompanySearch } from '../components/company-search';
import { CompaniesStatistics } from '../components/company-statistics';
import { FeaturedCompanies } from '../components/featured-companies';
import { useFeaturedCompanies } from '../hooks/use-featured-companies';
import { CompanyGetManyDto, CompanyService, CompanySortBy } from '../services/company.service';

const MAX_COMPANIES = 12;
export const CompaniesPage = () => {
  const [searchQuery, setSearchQuery] = useQueryState('search', parseAsString.withDefault(''));
  const [currentPage, setCurrentPage] = useQueryState('page', parseAsInteger.withDefault(1));
  const [sortBy, setSortBy] = useState<CompanySortBy>(CompanySortBy.NEWEST);
  const useerLocation = useUserGeolocation();

  const companyQuery: CompanyGetManyDto = useMemo(
    () => ({
      search: searchQuery,
      sortBy,
      page: currentPage,
      isVerified: true,
      limit: MAX_COMPANIES
    }),
    [searchQuery, sortBy, currentPage, useerLocation.location]
  );
  const { data: companiesData, isLoading } = useQuery({
    queryKey: [QueryKeys.COMPANIES, companyQuery],
    queryFn: () => CompanyService.getMany(companyQuery)
  });

  const { data: featuredCompaniesData, isLoading: isFeaturedLoading } = useFeaturedCompanies({
    sortBy: CompanySortBy.EVENTS,
    currentPage: 1
  });
  // Reset to page 1 when search or sort changes
  useEffect(() => {
    if (currentPage === 1) return;
    setCurrentPage(1);
  }, [searchQuery, sortBy]);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 grid items-center justify-center">
        <h1 className="text-3xl font-bold mb-2 text-center">Event Organizers</h1>
        <p className="text-muted-foreground">
          Discover and follow event organizers to stay updated with their latest events
        </p>
      </div>
      {<CompaniesStatistics />}

      {!isFeaturedLoading && !!featuredCompaniesData?.items.length && (
        <FeaturedCompanies companies={featuredCompaniesData.items} />
      )}

      <CompanySearch
        searchQuery={searchQuery}
        setSearchQuery={handleSearchChange}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      <div className="mb-8">
        <CompanyList
          companies={companiesData?.items || []}
          isLoading={isLoading}
          currentPage={currentPage}
          totalPages={companiesData?.meta.totalPages || 1}
          onPageChange={handlePageChange}
          onReset={() => setSearchQuery('')}
        />
      </div>
    </div>
  );
};
