'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import type { FC } from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { type CompanyNews, type CompanyNewsDto, CompanyNewsSchema } from '@/modules/company/interfaces/news.interface';
import { CompanyService } from '@/modules/company/services/company.service';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Separator } from '@/shared/components/ui/separator';
import { Textarea } from '@/shared/components/ui/textarea';
import { QueryKeys } from '@/shared/constants/query-keys';

interface Props {
  news: CompanyNews;
  onSuccess?: () => void;
}

export const EditNewsForm: FC<Props> = ({ news, onSuccess }) => {
  const queryClient = useQueryClient();
  const [cover, setCover] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty }
  } = useForm<CompanyNewsDto>({
    resolver: zodResolver(CompanyNewsSchema),
    defaultValues: {
      companyId: news.company.id,
      title: news.title,
      content: news.content
    }
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (dto: CompanyNewsDto) => CompanyService.updateNewsItem(news.id, dto),
    onSuccess: () => {
      if (cover) {
        setIsUploading(true);
        updateCover();
        return;
      }

      handleSuccess();
    },
    onError: (error) => {
      toast.error('Failed to update news', {
        description: error instanceof Error ? error.message : 'Please try again later'
      });
    }
  });

  const { mutate: updateCover } = useMutation({
    mutationFn: () => CompanyService.updateNewsItemCover(news.id, cover!),
    onSuccess: () => {
      handleSuccess();
    },
    onError: (error) => {
      toast.error('News updated but failed to upload cover image', {
        description: error instanceof Error ? error.message : 'Please try again later'
      });
      handleSuccess();
    },
    onSettled: () => {
      setIsUploading(false);
    }
  });

  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: [QueryKeys.COMPANY_NEWS, news.id] });
    toast.success('News updated successfully');
    setCover(null);
    onSuccess?.();
  };

  const onSubmit = (data: CompanyNewsDto) => {
    mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="title" className="text-base">
            Title <span className="text-destructive">*</span>
          </Label>
          <Input
            {...register('title')}
            id="title"
            placeholder="Enter a descriptive title for your news"
            errorMessage={errors.title?.message}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="content" className="text-base">
            Content <span className="text-destructive">*</span>
          </Label>
          <Textarea
            {...register('content')}
            id="content"
            placeholder="Write your news content here..."
            className="min-h-[150px] resize-none"
            errorMessage={errors.content?.message}
          />
        </div>
      </div>

      <Separator />

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onSuccess} disabled={isPending || isUploading}>
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={((!isValid || !isDirty) && !cover) || isPending || isUploading}
          className="gap-2">
          {(isPending || isUploading) && <Loader2 className="h-4 w-4 animate-spin" />}
          {isPending ? 'Updating...' : isUploading ? 'Uploading...' : 'Update News'}
        </Button>
      </div>
    </form>
  );
};
