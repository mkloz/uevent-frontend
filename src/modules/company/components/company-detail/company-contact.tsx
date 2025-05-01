import { ExternalLink, Mail, MapPin } from 'lucide-react';

import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';

import { useCompanyFollow } from '../../hooks/use-company-follow';
import type { Company } from '../../interfaces/company.interface';

interface CompanyContactProps {
  company: Company;
}

export const CompanyContact = ({ company }: CompanyContactProps) => {
  const { isFollowing, toggle } = useCompanyFollow(company.id);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">Contact Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {company.email && (
          <div className="flex justify-between items-center">
            <div className="flex items-center text-sm">
              <Mail className="h-4 w-4 mr-2 text-primary" />
              <span>{company.email}</span>
            </div>
            <Button variant="outline" size="sm" onClick={() => window.open(`mailto:${company.email}`, '_blank')}>
              Email
            </Button>
          </div>
        )}

        {company.website && (
          <div className="flex justify-between items-center">
            <div className="flex items-center text-sm">
              <ExternalLink className="h-4 w-4 mr-2 text-primary" />
              <span className="truncate max-w-[180px]">{company.website.replace(/^https?:\/\//, '')}</span>
            </div>
            <Button variant="outline" size="sm" onClick={() => window.open(company.website, '_blank')}>
              Visit
            </Button>
          </div>
        )}

        {company.location && (
          <div className="flex justify-between items-center">
            <div className="flex items-center text-sm">
              <MapPin className="h-4 w-4 mr-2 text-primary" />
              <span>{company.location.address}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                window.open(
                  `https://maps.google.com/?q=${encodeURIComponent(company.location.address || '')}`,
                  '_blank'
                )
              }>
              Map
            </Button>
          </div>
        )}

        <div className="pt-4 border-t border-border">
          <Button className="w-full" onClick={toggle} variant={isFollowing ? 'outline' : 'default'}>
            {isFollowing ? 'Following' : 'Follow Company'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
