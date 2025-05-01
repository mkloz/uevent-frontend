import { Suspense } from 'react';

import { Skeleton } from '../../../shared/components/ui/skeleton';
import { CategoriesSection } from '../components/categories.section';
import FeaturedCompanies from '../components/featured-ogranizers.section';
import { HeroSection } from '../components/hero.section';
import UpcomingEventsSection from '../components/upcoming-events.section';

// Loading fallbacks
const UpcomingEventsSkeleton = () => (
  <div className="space-y-4">
    <div className="flex justify-between">
      <Skeleton className="h-10 w-64" />
      <Skeleton className="h-10 w-32" />
    </div>
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((i) => (
        <Skeleton key={i} className="h-10 w-24 rounded-full" />
      ))}
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-96 rounded-xl" />
      ))}
    </div>
  </div>
);

const FeaturedCompaniesSkeleton = () => (
  <div className="space-y-4">
    <div className="flex justify-between">
      <Skeleton className="h-10 w-64" />
      <Skeleton className="h-10 w-32" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} className="h-64 rounded-xl" />
      ))}
    </div>
  </div>
);

export const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <HeroSection />
      <div className="container mx-auto grid items-center justify-center gap-6 px-6">
        <CategoriesSection />

        <Suspense fallback={<UpcomingEventsSkeleton />}>
          <UpcomingEventsSection />
        </Suspense>

        <Suspense fallback={<FeaturedCompaniesSkeleton />}>
          <FeaturedCompanies />
        </Suspense>
      </div>
    </div>
  );
};
