import { useQuery } from '@tanstack/react-query';

import { QueryKeys } from '../../../shared/constants/query-keys';
import { CompanyService } from '../services/company.service';

export const useUserCompanyFollowing = () => {
  const following = useQuery({
    queryKey: [QueryKeys.COMPANY_SUBSCRIBERS, 'my'],
    queryFn: () => CompanyService.getMyFollowed()
  });

  return {
    ...following,
    isFollowing: (followingId: string) => {
      if (!following.data) return false;
      return following.data.some((company) => company.companyId === followingId);
    }
  };
};
