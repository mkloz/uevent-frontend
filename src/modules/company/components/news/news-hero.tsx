import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { Button, buttonVariants } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { QueryKeys } from '@/shared/constants/query-keys';
import { cn } from '@/shared/lib/utils';

import { Image } from '../../../../shared/components/common/image';
import { CompanyNews } from '../../interfaces/news.interface';
import { CompanyService } from '../../services/company.service';

interface NewsHeroProps {
  newsItem: CompanyNews;
  isOwner: boolean;
}

export const NewsHero = ({ newsItem, isOwner }: NewsHeroProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: updateCover } = useMutation({
    mutationFn: (cover: File) => CompanyService.updateNewsItemCover(newsItem.id, cover),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.COMPANY_NEWS, newsItem.id] });
    }
  });

  const handleUpdateCover = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    updateCover(file);
  };

  return (
    <div className="relative w-full h-[40vh] overflow-hidden">
      <div className="absolute inset-0  z-10"></div>
      <Image src={newsItem.imageUrl} alt={newsItem.title} className="w-full h-full object-cover object-center" />

      <Button
        variant="link"
        size="icon"
        className="absolute top-4 left-8 z-20 justify-center flex items-center group hover:text-primary"
        onClick={() => navigate(-1)}
        aria-label="Go back">
        <ArrowLeft className="size-6 transform group-hover:-translate-x-1 transition-transform" />
        Go Back
      </Button>

      {isOwner && (
        <Label
          htmlFor="cover"
          className={cn(buttonVariants({ size: 'sm', variant: 'secondary' }), 'gap-0 absolute top-4 right-8 z-20')}>
          Change Cover
          <Input
            type="file"
            id="cover"
            className="hidden h-0 w-0 absolute"
            accept="image/*"
            onChange={handleUpdateCover}
          />
        </Label>
      )}
    </div>
  );
};
