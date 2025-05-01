import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AlertTriangle, Building, Code, Settings, Trash } from 'lucide-react';
import { type FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { ConfirmModal } from '@/shared/components/common/confirm-modal';
import { Alert, AlertDescription, AlertTitle } from '@/shared/components/ui/alert';
import { Button } from '@/shared/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';
import { Separator } from '@/shared/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { QueryKeys } from '@/shared/constants/query-keys';

import type { Company } from '../../interfaces/company.interface';
import { CompanyService } from '../../services/company.service';
import { CompanyPromoCode } from '../company-promo-code';
import { EditCompanyForm } from '../forms/edit-company-form';

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  company: Company;
}

export const CompanySettingsModal: FC<Props> = ({ open, setOpen, company }) => {
  const [openConfirm, setOpenConfirm] = useState(false);
  const navigation = useNavigate();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: () => CompanyService.delete(company.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.COMPANIES] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.MY_COMPANIES] });
      toast.success('Company deleted successfully');
      navigation('/companies');
      setOpen(false);
      setOpenConfirm(false);
    }
  });

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-center gap-2 text-xl font-bold">
              <Building className="h-5 w-5" />
              {company.name} Settings
            </DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="edit" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="edit" className="flex items-center gap-1">
                <Settings className="h-4 w-4" />
                <span>Edit Details</span>
              </TabsTrigger>
              <TabsTrigger value="promo" className="flex items-center gap-1">
                <Code className="h-4 w-4" />
                <span>Promo Codes</span>
              </TabsTrigger>
              <TabsTrigger value="danger" className="flex items-center gap-1 text-destructive">
                <AlertTriangle className="h-4 w-4" />
                <span>Danger Zone</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="edit" className="py-2">
              <EditCompanyForm
                company={company}
                onSuccess={() => {
                  toast.success('Company updated successfully');
                  setOpen(false);
                }}
              />
            </TabsContent>

            <TabsContent value="promo" className="py-2">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">Promo Codes</h3>
                  <p className="text-sm text-muted-foreground">
                    Create and manage promotional codes for your company&apos;s events.
                  </p>
                </div>
                <Separator />
                <CompanyPromoCode companyId={company.id} />
              </div>
            </TabsContent>

            <TabsContent value="danger" className="py-2">
              <Alert variant="destructive" className="mb-6">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Warning</AlertTitle>
                <AlertDescription>
                  Deleting your company will permanently remove all associated data, including events, tickets, and
                  promotional codes. This action cannot be undone.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">Delete Company</h3>
                  <p className="text-sm text-muted-foreground">
                    Once you delete a company, there is no going back. Please be certain.
                  </p>
                </div>

                <Button variant="destructive" onClick={() => setOpenConfirm(true)} className="w-full">
                  <Trash className="mr-2 h-4 w-4" /> Delete Company
                </Button>
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
        title="Delete Company"
        description={`Are you sure you want to delete "${company.name}"? This action cannot be undone and will remove all associated data.`}
      />
    </>
  );
};
