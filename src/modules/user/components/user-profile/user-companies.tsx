import { useQuery } from '@tanstack/react-query';
import { parseAsBoolean, useQueryState } from 'nuqs';
import { useState } from 'react';

import { CreateCompanyModal } from '@/modules/company/components/modal/create-company-modal';
import { CompanyService } from '@/modules/company/services/company.service';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { QueryKeys } from '@/shared/constants/query-keys';

import { Pagination } from '../../../../shared/components/common/pagination';
import { Button } from '../../../../shared/components/ui/button';
import { useAuth } from '../../../auth/queries/use-auth.query';
import { ShortCompanyCard } from '../../../company/components/short-company-card';

interface UserCompaniesProps {
  userId: string;
}

const ITEMS_PER_PAGE = 4;

export const UserCompanies = ({ userId }: UserCompaniesProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const me = useAuth();
  const isMyCompanies = me.data?.id === userId;
  const [open, setOpen] = useQueryState('create-company-modal', parseAsBoolean.withDefault(false));
  const { data: userCompanies, isLoading } = useQuery({
    queryKey: [QueryKeys.USER_COMPANIES, userId, currentPage, isMyCompanies],
    queryFn: () =>
      isMyCompanies
        ? CompanyService.getMyCompanies(currentPage, ITEMS_PER_PAGE)
        : CompanyService.getMany({ ownerId: userId, page: currentPage, limit: ITEMS_PER_PAGE }),
    enabled: !!userId
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Companies</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="h-16 w-16 rounded-full flex-shrink-0" />
              <div className="flex-1">
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex justify-between items-center">
          <CardTitle className="text-2xl">Companies</CardTitle>
          {isMyCompanies && (
            <Button variant="outline" onClick={() => setOpen(true)}>
              Create Company
            </Button>
          )}
        </CardHeader>
        {(!userCompanies || userCompanies?.items.length === 0) && (
          <CardContent className="flex items-center justify-center min-h-20">
            <p className="text-muted-foreground">No companies found.</p>
          </CardContent>
        )}
        <CardContent className="space-y-4">
          {userCompanies?.items.map((company) => (
            <ShortCompanyCard key={company.id} company={company} className="border-transparent" />
          ))}
          {userCompanies && userCompanies?.meta.totalPages > 1 && (
            <div className="flex justify-center mt-4">
              <Pagination
                compact
                currentPage={userCompanies?.meta.currentPage}
                totalPages={userCompanies?.meta.totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </CardContent>
      </Card>
      {open && <CreateCompanyModal userId={userId} open={open} setOpen={setOpen} />}
    </>
  );
};
