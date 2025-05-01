import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

import { useAuth } from '@/modules/auth/queries/use-auth.query';
import { Comments } from '@/modules/comments/components/comments';

import { QueryKeys } from '../../../shared/constants/query-keys';
import { CompanyCard } from '../components/company-card';
import { NewsContent } from '../components/news/news-content';
import { NewsHero } from '../components/news/news-hero';
import { NewsNotFound } from '../components/news/news-not-found';
import { NewsDetailSkeleton } from '../components/news/news-skeleton';
import { RelatedNews } from '../components/news/related-news';
import { CompanyService } from '../services/company.service';

export const CompanyNewsDetailPage = () => {
  const { newsId } = useParams<{ companyId: string; newsId: string }>();

  const { data: user } = useAuth();

  // Fetch news item
  const { data: newsItem, isLoading: isNewsLoading } = useQuery({
    queryKey: [QueryKeys.COMPANY_NEWS, newsId],
    queryFn: () => CompanyService.getNewsItem(newsId!),
    enabled: !!newsId && !!newsId
  });

  // Fetch related news
  const { data: relatedNews, isLoading: isRelatedLoading } = useQuery({
    queryKey: [QueryKeys.COMPANY_NEWS, newsItem?.company.id, 'related', newsId],
    queryFn: () => CompanyService.getCompanyNews(newsItem?.company.id ?? '', { limit: 5 }),
    enabled: !!newsItem?.company.id && !!newsId
  });

  const isLoading = isNewsLoading || isRelatedLoading;

  if (isLoading) {
    return <NewsDetailSkeleton />;
  }

  if (!newsItem) {
    return <NewsNotFound />;
  }

  const isOwner = newsItem.company.ownerId === user?.id;

  return (
    <div className="bg-background min-h-screen-no-header">
      {/* Hero Section */}
      <NewsHero newsItem={newsItem} isOwner={isOwner} />

      <div className="container mx-auto px-4 py-8 relative -mt-20 z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <NewsContent newsItem={newsItem} company={newsItem.company} isOwner={isOwner} />

            {/* Comments Section */}
            <Comments newsId={newsItem.id} />
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Company Info */}
            <CompanyCard company={newsItem.company} />

            {/* Related News */}
            {relatedNews && relatedNews.items.length > 0 && (
              <RelatedNews companyId={newsItem.company.id} relatedNews={relatedNews.items} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
