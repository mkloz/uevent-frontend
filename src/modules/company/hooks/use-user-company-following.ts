import { useQuery } from '@tanstack/react-query';

import { QueryKeys } from '../../../shared/constants/query-keys';
import { useAuth } from '../../auth/queries/use-auth.query';
import { CompanyService } from '../services/company.service';

export const useUserCompanyFollowing = () => {
  const following = useQuery({
    queryKey: [QueryKeys.USERS_ME, 'my', 'followed', 'companies'],
    staleTime: 1000 * 60 * 5,
    retry: false,
    queryFn: () => {
      try {
        return CompanyService.getMyFollowed();
      } catch {
        return [];
      }
    },
    enabled: useAuth().isLoggedIn
  });

  return {
    ...following,
    isFollowing: (followingId: string) => {
      if (!following.data) return false;
      return following.data.some((company) => company.companyId === followingId);
    }
  };
};
