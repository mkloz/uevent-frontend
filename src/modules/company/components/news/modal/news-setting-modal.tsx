'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ImagePlus, Settings, Trash } from 'lucide-react';
import { type FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import type { CompanyNews } from '@/modules/company/interfaces/news.interface';
import { CompanyService } from '@/modules/company/services/company.service';
import { ConfirmModal } from '@/shared/components/common/confirm-modal';
import { Button } from '@/shared/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { QueryKeys } from '@/shared/constants/query-keys';

import { EditNewsForm } from '../forms/edit-news-form';

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  news: CompanyNews;
}

export const NewsSettingModal: FC<Props> = ({ open, setOpen, news }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [openConfirm, setOpenConfirm] = useState(false);
  const { mutate, isPending } = useMutation({
    mutationFn: () => CompanyService.deleteNewsItem(news.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.COMPANY_NEWS, news.id] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.COMPANY_NEWS, news.company.id] });
      toast.success('News deleted successfully');
      navigate(`/companies/${news.company.id}`);
    }
  });

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center justify-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              News Settings
            </DialogTitle>
            <DialogDescription className="items-center justify-center flex">
              Manage your news article &quot;{news.title}&quot;
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="edit" className="mt-2">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="edit" className="flex items-center gap-2">
                <ImagePlus className="h-4 w-4" />
                Edit Content
              </TabsTrigger>
              <TabsTrigger value="danger" className="text-destructive flex items-center gap-2">
                <Trash className="h-4 w-4" />
                Danger Zone
              </TabsTrigger>
            </TabsList>

            <TabsContent value="edit" className="pt-4">
              <EditNewsForm news={news} onSuccess={() => setOpen(false)} />
            </TabsContent>

            <TabsContent value="danger" className="pt-4">
              <div className="space-y-4">
                <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4">
                  <h3 className="text-lg font-semibold text-destructive mb-2">Delete News Article</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    This action cannot be undone. This will permanently delete the news article and remove all
                    associated data.
                  </p>
                  <Button variant="destructive" onClick={() => setOpenConfirm(true)} className="w-full gap-2">
                    <Trash className="h-4 w-4" />
                    Delete News Article
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      <ConfirmModal
        isOpen={openConfirm}
        onClose={() => setOpenConfirm(false)}
        onConfirm={() => mutate()}
        isLoading={isPending}
        title="Delete News Article"
        description={`Are you sure you want to delete "${news.title}"? This action cannot be undone.`}
      />
    </>
  );
};
