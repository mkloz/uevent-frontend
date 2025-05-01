'use client';

import { useQuery } from '@tanstack/react-query';
import { Building2, Lock } from 'lucide-react';

import { Skeleton } from '@/shared/components/ui/skeleton';
import { QueryKeys } from '@/shared/constants/query-keys';

import { useAuth } from '../../../auth/queries/use-auth.query';
import { ShortCompanyCard } from '../../../company/components/short-company-card';
import { CompanyService } from '../../../company/services/company.service';
import { UserNoItems } from './user-no-items';

interface UserFollowingCompaniesProps {
  userId: string;
}

export const UserFollowingCompanies = ({ userId }: UserFollowingCompaniesProps) => {
  const me = useAuth();

  // Fetch companies the user is following
  const {
    data: followedCompaniesData,
    isLoading: isLoadingFollowedCompanies,
    error: companiesError
  } = useQuery({
    queryKey: [QueryKeys.USER_COMPANIES, userId, 'following', me.data?.id],
    queryFn: () => (me.data?.id === userId ? CompanyService.getMyFollowed() : CompanyService.getUserFollowed(userId)),
    enabled: !!userId && !me.isLoading
  });

  const isPrivate = companiesError?.message?.toLowerCase().includes('private');

  if (isLoadingFollowedCompanies) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 6 }, (_data, i) => (
          <div key={i} className="bg-card rounded-lg border p-4">
            <div className="flex gap-4">
              <Skeleton className="h-16 w-16 rounded-full flex-shrink-0" />
              <div className="flex-1">
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-8 w-24" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isPrivate) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <Lock className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">Private Content</h3>
        <p className="text-muted-foreground max-w-md">This user has chosen to keep their followed companies private.</p>
      </div>
    );
  }

  if (!followedCompaniesData?.length) {
    return (
      <UserNoItems
        icon={Building2}
        title="No Companies Followed"
        description="This user hasn't followed any companies yet."
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-rounded-full">
        {followedCompaniesData.map(({ company }) => (
          <ShortCompanyCard company={company} key={company.id} />
        ))}
      </div>
    </div>
  );
};
