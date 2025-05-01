'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ImagePlus, Loader2, X } from 'lucide-react';
import { type FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import Dropzone from 'shadcn-dropzone';
import { toast } from 'sonner';

import { type CompanyNewsDto, CompanyNewsSchema } from '@/modules/company/interfaces/news.interface';
import { CompanyService } from '@/modules/company/services/company.service';
import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/shared/components/ui/dialog';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Separator } from '@/shared/components/ui/separator';
import { Textarea } from '@/shared/components/ui/textarea';
import { QueryKeys } from '@/shared/constants/query-keys';

import { Image } from '../../../../../shared/components/common/image';

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  companyId: string;
  onSuccess?: () => void;
}

export const CreateNewsModal: FC<Props> = ({ open, setOpen, companyId, onSuccess }) => {
  const queryClient = useQueryClient();
  const [cover, setCover] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isValid, isDirty }
  } = useForm<CompanyNewsDto>({
    resolver: zodResolver(CompanyNewsSchema),
    defaultValues: {
      companyId,
      title: '',
      content: ''
    }
  });

  const { mutate, isPending } = useMutation({
    mutationFn: CompanyService.createNewsItem,
    onSuccess: ({ id }) => {
      if (cover) {
        setIsUploading(true);
        updateCover(id);
        return;
      }

      handleSuccess();
    },
    onError: (error) => {
      toast.error('Failed to create news', {
        description: error instanceof Error ? error.message : 'Please try again later'
      });
    }
  });

  const { mutate: updateCover } = useMutation({
    mutationFn: (id: string) => CompanyService.updateNewsItemCover(id, cover!),
    onSuccess: () => {
      handleSuccess();
    },
    onError: (error) => {
      toast.error('News created but failed to upload cover image', {
        description: error instanceof Error ? error.message : 'Please try again later'
      });
      handleSuccess();
    },
    onSettled: () => {
      setIsUploading(false);
    }
  });

  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: [QueryKeys.COMPANY_NEWS, companyId] });
    toast.success('News created successfully');
    reset();
    setCover(null);
    onSuccess?.();
    setOpen(false);
  };

  const onSubmit = (data: CompanyNewsDto) => {
    mutate(data);
  };

  const handleClose = () => {
    if (!isPending && !isUploading) {
      reset();
      setCover(null);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2 justify-center">
            <ImagePlus className="h-5 w-5 text-primary" />
            Create Company News
          </DialogTitle>
          <DialogDescription className="flex m-auto">
            Share updates, announcements, and news with your followers
          </DialogDescription>
        </DialogHeader>

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
              <Label className="text-base">Cover Image</Label>
              <div className="relative overflow-hidden rounded-md border-2 border-dashed border-muted-foreground/25 bg-muted/50 transition-colors hover:border-muted-foreground/40">
                {cover ? (
                  <div className="relative w-full">
                    <Image src={URL.createObjectURL(cover)} alt="Cover preview" className="w-full object-cover h-30" />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute right-2 top-2 h-8 w-8 rounded-full shadow-lg"
                      onClick={() => setCover(null)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Dropzone
                    accept={{ 'image/*': [] }}
                    multiple={false}
                    showFilesList={false}
                    onDropAccepted={(files) => {
                      setCover(files?.[0] || null);
                    }}
                    containerClassName="flex w-full cursor-pointer flex-col items-center justify-center p-4 h-30">
                    {() => (
                      <div className="flex flex-col items-center gap-2 text-center">
                        <p className="font-medium">Drag & drop or click to upload cover image</p>
                        <p className="text-sm text-muted-foreground">PNG, JPG up to 5MB</p>
                      </div>
                    )}
                  </Dropzone>
                )}
              </div>
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

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={isPending || isUploading}>
              Cancel
            </Button>
            <Button type="submit" disabled={!isValid || !isDirty || isPending || isUploading} className="gap-2">
              {(isPending || isUploading) && <Loader2 className="h-4 w-4 animate-spin" />}
              {isPending ? 'Creating...' : isUploading ? 'Uploading...' : 'Create News'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
