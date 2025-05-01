import { useParams } from 'react-router-dom';

import { UserUpcomingEvents } from '../components/user-profile/user-upcoming-events';

export const UserUpcomingEventsPage = () => {
  const { id } = useParams<{ id: string }>();
  if (!id) {
    return null; // Handle the case where id is not available
  }
  return <UserUpcomingEvents userId={id} />;
};
