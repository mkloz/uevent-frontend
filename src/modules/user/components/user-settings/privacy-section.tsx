import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';

import type { User } from '../../interfaces/user.interface';
import { PrivacySettingsForm } from './privacy-settings-form';

interface PrivacySectionProps {
  currentUser: User;
}

export const PrivacySection = ({ currentUser }: PrivacySectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Privacy Settings</CardTitle>
        <CardDescription>Manage what information is visible to others</CardDescription>
      </CardHeader>
      <CardContent>
        <PrivacySettingsForm currentUser={currentUser} />
      </CardContent>
    </Card>
  );
};
