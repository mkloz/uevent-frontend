import { useQuery } from '@tanstack/react-query';
import { Building2, CalendarClock, CalendarHeart, History, Settings, Ticket } from 'lucide-react';
import { NavLink, Outlet, useParams } from 'react-router-dom';

import { useAuth } from '@/modules/auth/queries/use-auth.query';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { QueryKeys } from '@/shared/constants/query-keys';
import { NotFoundPage } from '@/shared/pages/not-found-page';

import { cn } from '../../../shared/lib/utils';
import { UserCompanies } from '../components/user-profile/user-companies';
import { UserProfileHeader } from '../components/user-profile/user-profile-header';
import { UserService } from '../services/user.service';

const USER_PROFILE_LINKS = [
  { name: 'Upcoming', link: '/upcoming', icon: CalendarClock, isProtected: false },
  { name: 'Past Events', link: '/past', icon: History, isProtected: false },
  { name: 'Following', link: '/following/companies', icon: Building2, isProtected: false },
  { name: 'Following', link: '/following/events', icon: CalendarHeart, isProtected: false },
  { name: 'Tickets', link: '/tickets', icon: Ticket, isProtected: true },
  { name: 'Settings', link: '/settings', icon: Settings, isProtected: true }
];

export const UserProfileLayout = () => {
  const { id } = useParams<{ id: string }>();
  const { data: currentUser, isLoading } = useAuth();
  const isOwnProfile = currentUser?.id === id;
  // Fetch user data
  const {
    data: userData,
    isLoading: isUserLoading,
    error: userError
  } = useQuery({
    queryKey: [QueryKeys.USERS, id, isOwnProfile, currentUser],
    queryFn: () => (isOwnProfile ? currentUser : UserService.getById(id!)),
    enabled: !!id && !isLoading
  });
  console.log('Is Loading', isLoading);

  if (isUserLoading || isLoading) {
    return <UserProfileSkeleton />;
  }
  const user = isOwnProfile ? currentUser : userData;

  if (userError || !user) {
    return <NotFoundPage />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar */}
        <div className="space-y-6">
          <UserProfileHeader user={user} />
          <UserCompanies userId={user.id} />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 @container/main">
          <ul className="flex w-full mb-6 border-b overflow-x-auto">
            {USER_PROFILE_LINKS.map(
              (link) =>
                (!link.isProtected || (link.isProtected && isOwnProfile)) && (
                  <li key={`${link.name}-${link.link}`} className="flex-shrink-0 grow">
                    <NavLink
                      to={`/users/${id}${link.link}`}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center py-2 px-3 font-medium transition-colors hover:text-primary whitespace-nowrap justify-center',
                          isActive ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'
                        )
                      }>
                      <link.icon className="h-4 w-4 @3xl/main:mr-2" />
                      <span className="hidden @3xl/main:inline">{link.name}</span>
                    </NavLink>
                  </li>
                )
            )}
          </ul>
          <div>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

const UserProfileSkeleton = () => (
  <div className="container mx-auto px-4 py-8">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Sidebar Skeleton */}
      <div className="space-y-6">
        <div className="bg-card rounded-lg border p-6">
          <div className="flex flex-col items-center">
            <Skeleton className="h-32 w-32 rounded-full mb-4" />
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-32 mb-4" />
            <Skeleton className="h-4 w-64 mb-2" />
            <Skeleton className="h-4 w-56 mb-4" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>

        <div className="bg-card rounded-lg border p-6">
          <Skeleton className="h-6 w-32 mb-4" />
          <div className="space-y-3">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="lg:col-span-2">
        <Skeleton className="h-10 w-full mb-6" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-card rounded-lg border p-4">
              <div className="flex gap-4">
                <Skeleton className="h-24 w-24 rounded-md flex-shrink-0" />
                <div className="flex-1">
                  <Skeleton className="h-6 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);
