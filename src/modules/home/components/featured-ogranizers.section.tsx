import type React from 'react';

import { Link } from '../../../shared/components/common/link';
import { Skeleton } from '../../../shared/components/ui/skeleton';
import { CompanyCard } from '../../company/components/company-card';
import { useFeaturedCompanies } from '../../company/hooks/use-featured-companies';

const FeaturedCompanies: React.FC = () => {
  const { data: featuredCompanies, isLoading } = useFeaturedCompanies({});

  return (
    <section className="py-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold mb-2">Featured Companies</h2>
          <p className="text-muted-foreground">Discover top event creators and follow their upcoming events</p>
        </div>

        <Link to="/companies" className="text-lg font-semibold" withArrowRight>
          View All Companies
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="bg-card rounded-xl p-6 shadow-lg">
              <div className="flex items-center mb-4">
                <Skeleton className="w-12 h-12 rounded-full mr-4" />
                <Skeleton className="h-5 rounded w-24" />
              </div>
              <Skeleton className="h-4 rounded mb-2 w-full" />
              <Skeleton className="h-4 rounded w-3/4" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {featuredCompanies?.items.map((company) => (
            <CompanyCard key={company.id} company={company} isFeatured={true} />
          ))}
        </div>
      )}
    </section>
  );
};

export default FeaturedCompanies;
