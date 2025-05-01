import { useMutation, useQueryClient } from '@tanstack/react-query';

import { QueryKeys } from '../../../shared/constants/query-keys';
import { CompanyService } from '../services/company.service';

export const useCompanyUnfollowMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (companyId: string) => CompanyService.unfollow(companyId),
    onSuccess: (_, companyId) => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.COMPANY_SUBSCRIBERS, companyId]
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.COMPANY_SUBSCRIBERS, 'my']
      });
    }
  });
};
