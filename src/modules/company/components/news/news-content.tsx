'use client';

import { Calendar, Settings, Share2 } from 'lucide-react';
import { useState } from 'react';

import { Link } from '@/shared/components/common/link';
import { Button } from '@/shared/components/ui/button';
import { useShare } from '@/shared/hooks/use-share';
import dayjs from '@/shared/lib/dayjs';

import { Reactions } from '../../../comments/components/reactions';
import type { Company } from '../../interfaces/company.interface';
import type { CompanyNews } from '../../interfaces/news.interface';
import { CompanyLogo } from '../company-logo';
import { NewsSettingModal } from './modal/news-setting-modal';

interface NewsContentProps {
  newsItem: CompanyNews;
  company: Company;
  isOwner: boolean;
}

export const NewsContent = ({ newsItem, company, isOwner }: NewsContentProps) => {
  const [open, setOpen] = useState(false);
  const share = useShare();

  const handleShare = () => {
    share({
      title: newsItem.title,
      text: newsItem.content.substring(0, 100) + '...',
      url: window.location.href
    });
  };

  return (
    <>
      <div className="bg-card rounded-xl p-6 border shadow-md">
        <div className="flex items-center gap-2 text-muted-foreground mb-4">
          <Calendar className="h-4 w-4" />
          <span>{dayjs(newsItem.createdAt).format('MMMM D, YYYY')}</span>

          <Link to={`/companies/${company.id}`} className="ml-auto flex items-center gap-2">
            <CompanyLogo company={company} className="h-6 w-6" />
            <span>{company.name}</span>
          </Link>
        </div>

        <h1 className="text-3xl font-bold mb-6">{newsItem.title}</h1>

        <div className="prose max-w-none">
          {newsItem.content.split('\n\n').map((paragraph, index) => (
            <p key={index} className="mb-4">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="flex items-center gap-4 mt-8 pt-4 border-t">
          <Reactions newsId={newsItem.id} small={false} />

          <Button variant="outline" size="icon" onClick={handleShare} className="ml-auto">
            <Share2 />
          </Button>

          {isOwner && (
            <Button variant="outline" size="icon" onClick={() => setOpen(true)}>
              <Settings />
            </Button>
          )}
        </div>
      </div>

      <NewsSettingModal open={open} setOpen={setOpen} news={newsItem} />
    </>
  );
};
