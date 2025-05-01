import { ExternalLink, MapPin, Users } from 'lucide-react';
import type React from 'react';

import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';

import { Image } from '../../../shared/components/common/image';
import { Link } from '../../../shared/components/common/link';
import { Badge } from '../../../shared/components/ui/badge';
import { Separator } from '../../../shared/components/ui/separator';
import { getStaticMapImageUrl } from '../../../shared/utils/maps.utils';
import { useCompanyFollow } from '../hooks/use-company-follow';
import type { Company } from '../interfaces/company.interface';
import { CompanyLogo } from './company-logo';

interface CompanyCardProps {
  company: Company;
  isFeatured?: boolean;
  hasFollow?: boolean;
}

export const CompanyCard: React.FC<CompanyCardProps> = ({ company, isFeatured = false, hasFollow = true }) => {
  const { isFollowing, toggle } = useCompanyFollow(company.id);

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer group border-2 hover:border-primary py-0 gap-0">
      <Link to={`/companies/${company.id}`} unstyled>
        <div className="h-40 relative overflow-hidden">
          <Image
            src={
              company.coverImage ||
              (company.location &&
                getStaticMapImageUrl({
                  center: company.location,
                  zoom: 7,
                  size: {
                    width: 600,
                    height: 600
                  },
                  markers: [{ position: company.location }]
                }))
            }
            alt={`${company.name} featured`}
            wrapperClassName="group-hover:scale-105 transition-transform duration-500"
            className="w-full h-full object-cover object-center  "
          />
          <div className="absolute inset-0 bg-black/30"></div>

          <div className="absolute bottom-0 left-0 w-full p-4 flex items-center">
            <div className="h-16 w-16 rounded-full border-2 border-primary overflow-hidden bg-accent mr-3 flex-shrink-0">
              <CompanyLogo company={company} className="size-full" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg truncate text-white">{company.name}</h3>
              <div className="flex items-center text-sm text-white/90">
                <MapPin className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
                <span className="truncate">{company.location.address}</span>
              </div>
            </div>
          </div>

          <div className="absolute top-2 right-2 flex gap-1">
            {isFeatured && <Badge className="bg-primary text-primary-foreground">Featured</Badge>}
            {!company.isVerified && <Badge className="bg-red-500 text-white ">Unverified</Badge>}
          </div>
        </div>

        <CardContent className="p-4 flex gap-4 flex-col">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-muted-foreground">
              <Users className="h-4 w-4 mr-1" />
              <span>{company._count?.subscribers || 0} followers</span>
            </div>
            <div className="text-sm text-muted-foreground">{company._count?.events || 0} events</div>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2 h-10">
            {company.description || 'No description available'}
          </p>

          {hasFollow && (
            <>
              <Separator className="rounded" />
              <div className="flex gap-2">
                <Button
                  variant={isFollowing ? 'outline' : 'default'}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggle();
                  }}
                  className="flex-1">
                  {isFollowing ? 'Following' : 'Follow'}
                </Button>

                {company.website && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      window.open(company.website, '_blank');
                    }}>
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Link>
    </Card>
  );
};
