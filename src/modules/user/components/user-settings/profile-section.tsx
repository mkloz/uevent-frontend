import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';

import type { User } from '../../interfaces/user.interface';
import { AvatarUpload } from './avatar-upload';
import { ProfileForm } from './profile-form';

interface ProfileSectionProps {
  currentUser: User;
}

export const ProfileSection = ({ currentUser }: ProfileSectionProps) => {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Avatar</CardTitle>
          <CardDescription>Update your profile picture</CardDescription>
        </CardHeader>
        <CardContent>
          <AvatarUpload currentUser={currentUser} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your personal information</CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm currentUser={currentUser} />
        </CardContent>
      </Card>
    </>
  );
};
