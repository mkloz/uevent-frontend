import { useParams } from 'react-router-dom';

import { UserPastEvents } from '../components/user-profile/user-past-events';

export const UserPastEventsPage = () => {
  const { id } = useParams<{ id: string }>();
  if (!id) {
    return null; // Handle the case where id is not available
  }
  return <UserPastEvents userId={id} />;
};
