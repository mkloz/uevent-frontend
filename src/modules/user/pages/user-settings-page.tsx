import { parseAsString, useQueryState } from 'nuqs';

import { useAuth } from '@/modules/auth/queries/use-auth.query';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';

import { ColorSchemeSection } from '../components/user-profile/color-scheme-section';
import { NotificationSection } from '../components/user-settings/notification-section';
import { PrivacySection } from '../components/user-settings/privacy-section';
import { ProfileSection } from '../components/user-settings/profile-section';

export const UserSettingsPage = () => {
  const { data: currentUser } = useAuth();
  const [activeTab, setActiveTab] = useQueryState('tab', parseAsString.withDefault('profile'));

  if (!currentUser) {
    return <UserSettingsSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences.</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 md:w-auto">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <ProfileSection currentUser={currentUser} />
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <NotificationSection currentUser={currentUser} />
        </TabsContent>

        <TabsContent value="privacy" className="space-y-4">
          <PrivacySection currentUser={currentUser} />
        </TabsContent>
        <TabsContent value="appearance" className="space-y-4">
          <ColorSchemeSection />
        </TabsContent>
      </Tabs>
    </div>
  );
};

const UserSettingsSkeleton = () => (
  <div className="space-y-6">
    <div>
      <Skeleton className="h-8 w-48 mb-2" />
      <Skeleton className="h-4 w-64" />
    </div>

    <Skeleton className="h-10 w-full max-w-md mb-6" />

    <div className="space-y-4">
      <Skeleton className="h-[200px] w-full rounded-lg" />
      <Skeleton className="h-[400px] w-full rounded-lg" />
    </div>
  </div>
);
