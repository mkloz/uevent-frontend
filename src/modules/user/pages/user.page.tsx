import { useMutation, useQueryClient } from '@tanstack/react-query';
import type React from 'react';
import { useNavigate } from 'react-router-dom';

import { UserAvatar } from '../../../shared/components/common/user-avatar';
import { Button } from '../../../shared/components/ui/button';
import { userGroupOptions } from '../../auth/queries/use-auth.query';
import { AuthService } from '../../auth/services/auth.service';
import { useTokens } from '../../auth/stores/tokens.store';

export const UserPage: React.FC = () => {
  const tokens = useTokens();
  const queryClient = useQueryClient();
  const nav = useNavigate();
  const logout = useMutation({
    mutationFn: () => {
      return AuthService.logout(tokens.tokens?.refreshToken || '');
    },
    onSuccess: () => {
      tokens.deleteTokens();
      queryClient.resetQueries(userGroupOptions());
      nav('/');
    }
  });

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-4">
      <h1 className="text-3xl font-bold">User Profile</h1>
      <p className="mt-2 text-lg">Welcome to your profile page!</p>
      <div className="mt-4">
        <UserAvatar user={null} />
      </div>
      <div className="mt-4">
        <Button variant="default" size="lg" onClick={() => logout.mutate()}>
          Logout
        </Button>
      </div>
    </div>
  );
};
