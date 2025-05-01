import type { FC, PropsWithChildren } from 'react';
import { Navigate } from 'react-router-dom';

import { useAuth } from '../../modules/auth/queries/use-auth.query';

export const AuthGuard: FC<PropsWithChildren> = ({ children }) => {
  const { isLoading, isLoggedIn } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!isLoggedIn) {
    return <Navigate to="/auth/login" replace />;
  }

  return children;
};
