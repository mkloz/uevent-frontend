'use client';

import { useParams } from 'react-router-dom';

import { NotFoundPage } from '../../../shared/pages/not-found-page';
import { UserFollowingEvents } from '../components/user-profile/user-following-events';

export const UserFollowingEventsPage = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return <NotFoundPage />;
  }

  return <UserFollowingEvents userId={id} />;
};
