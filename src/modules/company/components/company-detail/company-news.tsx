import { useQuery } from '@tanstack/react-query';
import { Calendar } from 'lucide-react';
import { useState } from 'react';

import { useAuth } from '@/modules/auth/queries/use-auth.query';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { useShare } from '@/shared/hooks/use-share';

import { Pagination } from '../../../../shared/components/common/pagination';
import { QueryKeys } from '../../../../shared/constants/query-keys';
import type { Company } from '../../interfaces/company.interface';
import type { CompanyNews as News } from '../../interfaces/news.interface';
import { CompanyService } from '../../services/company.service';
import { CreateNewsModal } from '../news/modal/create-news-modal';
import { NewsCard } from '../news/news-card';

interface CompanyNewsProps {
  company: Company;
}

export const CompanyNews = ({ company }: CompanyNewsProps) => {
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const share = useShare();

  const { data: user } = useAuth();

  const { data: newsData, isLoading } = useQuery({
    queryKey: [QueryKeys.COMPANY_NEWS, company.id, page],
    queryFn: () => CompanyService.getCompanyNews(company.id, { page, limit: 5 }),
    enabled: !!company.id
  });

  const handleShare = (item: News) => {
    share({
      title: item.title,
      text: item.content,
      url: window.location.href
    });
  };

  const isOwner = user?.id === company.ownerId;
  const newsItems = newsData?.items || [];

  return (
    <>
      <Card>
        <CardHeader className="flex items-center">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Company News
          </CardTitle>

          {isOwner && (
            <Button variant="outline" size="sm" className="ml-auto" onClick={() => setOpen(true)}>
              Add News
            </Button>
          )}
        </CardHeader>
        {isLoading && (
          <CardContent>
            <Skeleton className="h-8 w-full mb-6" />
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="h-24 w-24 rounded-md flex-shrink-0" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-16 w-full" />
                    <div className="flex gap-2">
                      <Skeleton className="h-8 w-16" />
                      <Skeleton className="h-8 w-16" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        )}

        {!isLoading && newsItems.length === 0 && (
          <CardContent className="text-center py-8">
            <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No News Available</h3>
            <p className="text-muted-foreground">This organizer hasn&apos;t posted any news yet.</p>
          </CardContent>
        )}

        {!isLoading && newsItems.length > 0 && (
          <CardContent>
            <div className="space-y-6">
              {newsItems.map((item) => (
                <NewsCard key={item.id} item={item} className="border-transparent" onShare={() => handleShare(item)} />
              ))}

              {newsData && newsData.meta.totalPages > 1 && (
                <Pagination currentPage={page} totalPages={newsData.meta.totalPages} onPageChange={setPage} />
              )}
            </div>
          </CardContent>
        )}
      </Card>

      <CreateNewsModal open={open} setOpen={setOpen} companyId={company.id} onSuccess={() => setOpen(false)} />
    </>
  );
};
