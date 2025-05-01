import { Users } from 'lucide-react';
import { type FC, useState } from 'react';

import { ShortUserCard } from '@/modules/user/components/short-user-card';
import type { User } from '@/modules/user/interfaces/user.interface';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Skeleton } from '@/shared/components/ui/skeleton';

interface CompanyTeamProps {
  user?: User;
}

export const CompanyOwner: FC<CompanyTeamProps> = ({ user }) => {
  const [isLoading] = useState(false);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Company Owner
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-3">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-3 w-32" />
              </div>
              <Skeleton className="h-8 w-20" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          Company Owner
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <ShortUserCard user={user} />
        </div>
      </CardContent>
    </Card>
  );
};
