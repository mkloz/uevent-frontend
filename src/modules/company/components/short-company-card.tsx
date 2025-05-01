import { Building2, MapPin } from 'lucide-react';
import type { ComponentProps, FC } from 'react';

import { Link } from '../../../shared/components/common/link';
import { Badge } from '../../../shared/components/ui/badge';
import { cn } from '../../../shared/lib/utils';
import type { Company } from '../interfaces/company.interface';
import { CompanyLogo } from './company-logo';

interface ShortCompanyCardProps extends Partial<ComponentProps<typeof Link>> {
  company: Company;
}

export const ShortCompanyCard: FC<ShortCompanyCardProps> = ({ company, className, ...props }) => {
  return (
    <Link
      to={`/companies/${company.id}`}
      unstyled
      {...props}
      className={cn(
        'flex gap-3 group hover:bg-muted p-2 rounded-md transition-colors border hover:border-primary',
        className
      )}>
      <div className="h-16 w-16 rounded-full overflow-hidden flex-shrink-0 relative border border-border">
        <CompanyLogo company={company} className="size-full group-hover:scale-105 transition-transform duration-500" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-sm  group-hover:text-primary transition-colors flex items-center gap-2">
          <span className="line-clamp-1">{company.name} </span>
          {!company.isVerified && <Badge className="bg-red-500 text-white ml-auto">Unverified</Badge>}
        </h3>
        <div className="flex items-center text-xs text-muted-foreground mt-1">
          <MapPin className="mr-1 h-3 w-3" />
          <span className="line-clamp-1">{company.location.address || 'No location'}</span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <Badge variant="outline" className="text-xs px-1 py-0 h-4">
            <Building2 className="h-3 w-3 mr-1" />
            {company._count?.events || 0} events
          </Badge>
          <Badge variant="secondary" className="text-xs px-1 py-0 h-4">
            {company._count?.subscribers || 0} followers
          </Badge>
        </div>
      </div>
    </Link>
  );
};
