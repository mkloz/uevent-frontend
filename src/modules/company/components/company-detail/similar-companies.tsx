import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';

import type { Company } from '../../interfaces/company.interface';
import { ShortCompanyCard } from '../short-company-card';

interface SimilarCompaniesProps {
  companies: Company[];
}

export const SimilarCompanies = ({ companies }: SimilarCompaniesProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Similar Companies</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {companies.map((company) => (
          <ShortCompanyCard key={company.id} company={company} className="border-transparent" />
        ))}
      </CardContent>
    </Card>
  );
};
