import { TrendingUp } from 'lucide-react';

import type { Company } from '../interfaces/company.interface';
import { CompanyCard } from './company-card';

interface FeaturedCompaniesProps {
  companies: Company[];
}

export const FeaturedCompanies = ({ companies }: FeaturedCompaniesProps) => {
  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <span className="bg-primary/10 text-primary p-1 rounded-md mr-2">
          <TrendingUp className="h-5 w-5" />
        </span>
        Featured Companies
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {companies.map((company) => (
          <CompanyCard key={company.id} company={company} isFeatured={true} />
        ))}
      </div>
    </div>
  );
};
