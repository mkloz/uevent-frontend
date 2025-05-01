import { Building2 } from 'lucide-react';

import { Pagination } from '@/shared/components/common/pagination';
import { Skeleton } from '@/shared/components/ui/skeleton';

import type { Company } from '../interfaces/company.interface';
import { CompanyCard } from './company-card';
import { NoCompaniesFound } from './no-companies-found';

interface CompanyListProps {
  companies: Company[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  hasHeader?: boolean;
  hasFollow?: boolean;
  onReset?: () => void;
}

export const CompanyList = ({
  companies,
  isLoading,
  currentPage,
  totalPages,
  onPageChange,
  hasHeader = true,
  hasFollow = true,
  onReset
}: CompanyListProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="bg-card rounded-xl p-6 shadow-md">
            <div className="flex items-center mb-4">
              <Skeleton className="h-16 w-16 rounded-full" />
              <div className="ml-4 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4 mb-4" />
            <div className="flex justify-between">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-20" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (companies.length === 0) {
    return <NoCompaniesFound onReset={onReset} />;
  }

  return (
    <>
      {hasHeader && (
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <span className="bg-primary/10 text-primary p-1 rounded-md mr-2">
            <Building2 className="h-5 w-5" />
          </span>
          All Companies
        </h2>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {companies.map((company) => (
          <CompanyCard key={company.id} company={company} isFeatured={false} hasFollow={hasFollow} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
        </div>
      )}
    </>
  );
};
