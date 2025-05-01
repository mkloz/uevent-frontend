import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';

import type { User } from '../../interfaces/user.interface';
import { NotificationPreferencesForm } from './notification-preferences-form';

interface NotificationSectionProps {
  currentUser: User;
}

export const NotificationSection = ({ currentUser }: NotificationSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>Choose how you want to be notified about different activities</CardDescription>
      </CardHeader>
      <CardContent>
        <NotificationPreferencesForm currentUser={currentUser} />
      </CardContent>
    </Card>
  );
};
