import { useParams } from 'react-router-dom';

import { useAuth } from '@/modules/auth/queries/use-auth.query';

import { UserTickets } from '../components/user-profile/user-tickets';

export const UserTicketsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: currentUser } = useAuth();
  const isOwnProfile = currentUser?.id === id;

  // Only show tickets for the user's own profile
  if (!isOwnProfile) {
    return <div className="text-center py-8">You don&apos;t have permission to view this page.</div>;
  }

  return <UserTickets />;
};
