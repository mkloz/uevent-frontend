import { Building2 } from 'lucide-react';
import { FC } from 'react';

import { Button, buttonVariants } from '@/shared/components/ui/button';

import { Link } from '../../../shared/components/common/link';
interface NoCompaniesFoundProps {
  onReset?: () => void;
}
export const NoCompaniesFound: FC<NoCompaniesFoundProps> = ({ onReset }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="bg-muted rounded-full p-6 mb-4">
        <Building2 className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-bold mb-2">No Companies Found</h3>
      <p className="text-muted-foreground max-w-md mb-6">
        We couldn&apos;t find any companies matching your search criteria. Try adjusting your filters or search terms.
      </p>
      <div className="flex gap-4">
        <Button variant="outline" onClick={onReset}>
          Reset Filters
        </Button>
        <Link to={'/companies'} unstyled className={buttonVariants()}>
          Browse All Companies
        </Link>
      </div>
    </div>
  );
};
