import { Skeleton } from '@/shared/components/ui/skeleton';

export const NewsDetailSkeleton = () => (
  <div className="bg-background min-h-screen-no-header">
    <div className="relative w-full h-[40vh] overflow-hidden">
      <Skeleton className="w-full h-full" />
    </div>

    <div className="container mx-auto px-4 py-8 relative -mt-20 z-20">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-card rounded-xl p-6 border shadow-md">
            <div className="flex justify-between mb-4">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-40" />
            </div>

            <Skeleton className="h-10 w-3/4 mb-6" />

            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>

            <div className="mt-8 pt-4 border-t">
              <div className="flex gap-4">
                <Skeleton className="h-9 w-24" />
                <Skeleton className="h-9 w-24" />
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl p-6 border shadow-md">
            <Skeleton className="h-8 w-40 mb-6" />
            <div className="space-y-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-card rounded-xl p-6 border shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <Skeleton className="h-16 w-16 rounded-full" />
              <div>
                <Skeleton className="h-5 w-32 mb-2" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>

            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4 mb-4" />

            <Skeleton className="h-10 w-full" />
          </div>

          <div className="bg-card rounded-xl p-6 border shadow-sm">
            <Skeleton className="h-6 w-32 mb-4" />

            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-3">
                  <Skeleton className="h-14 w-14 rounded-md" />
                  <div>
                    <Skeleton className="h-4 w-40 mb-2" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
