'use client';

import { useParams } from 'react-router-dom';

import { NotFoundPage } from '../../../shared/pages/not-found-page';
import { UserFollowingCompanies } from '../components/user-profile/user-following-companies';

export const UserFollowingCompaniesPage = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return <NotFoundPage />;
  }

  return <UserFollowingCompanies userId={id} />;
};
