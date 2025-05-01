import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Info, Upload, X } from 'lucide-react';
import type React from 'react';
import { type FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import Dropzone from 'shadcn-dropzone';
import { toast } from 'sonner';

import { AddressAutocomplete } from '@/shared/components/maps/address-autocomplete';
import { Button, buttonVariants } from '@/shared/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Separator } from '@/shared/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Textarea } from '@/shared/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shared/components/ui/tooltip';
import { QueryKeys } from '@/shared/constants/query-keys';
import { cn } from '@/shared/lib/utils';

import { Image } from '../../../../shared/components/common/image';
import { type CompanyDto, CompanySchema } from '../../interfaces/company.interface';
import { CompanyService } from '../../services/company.service';
import { CompanyLogo } from '../company-logo';

interface Props {
  open: boolean;
  userId: string;
  setOpen: (open: boolean) => void;
}

export const CreateCompanyModal: FC<Props> = ({ open, userId, setOpen }) => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('basic');

  const {
    handleSubmit,
    register,
    setValue,
    watch,
    formState: { errors }
  } = useForm<CompanyDto>({
    resolver: zodResolver(CompanySchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      description: '',
      email: '',
      website: '',
      location: {
        address: '',
        lat: 0,
        lng: 0
      }
    }
  });

  const [avatar, setAvatar] = useState<File | null>(null);
  const [cover, setCover] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [coverPreview, setCoverPreview] = useState<string>('');

  const { mutate, isPending } = useMutation({
    mutationFn: CompanyService.create,
    onSuccess: ({ id }) => {
      if (avatar || cover) {
        mutateMedia(id);
        return;
      }

      toast.success('Company created successfully');
      queryClient.invalidateQueries({ queryKey: [QueryKeys.MY_COMPANIES] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.USER_COMPANIES, userId] });
      setOpen(false);
    }
  });

  const { mutate: mutateMedia, isPending: isPendingMedia } = useMutation({
    mutationFn: (companyId: string) => {
      const promises = [];

      if (avatar) {
        promises.push(CompanyService.updateLogo(companyId, avatar));
      }

      if (cover) {
        promises.push(CompanyService.updateCover(companyId, cover));
      }

      return Promise.all(promises);
    },
    onSuccess: () => {
      toast.success('Company created successfully');
      queryClient.invalidateQueries({ queryKey: [QueryKeys.MY_COMPANIES] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.USER_COMPANIES, userId] });
      setOpen(false);
    }
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const removeCover = () => {
    setCover(null);
    setCoverPreview('');
  };

  const onSubmit = (data: CompanyDto) => {
    mutate(data);
  };

  const isLoading = isPending || isPendingMedia;
  const formData = watch();
  const isBasicInfoComplete = formData.name && formData.email && formData.description && formData.website;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl min-h-150 items-start">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full flex gap-4">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold">Create Company</DialogTitle>
          </DialogHeader>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="media" disabled={!isBasicInfoComplete}>
              Media
            </TabsTrigger>
            <TabsTrigger value="location" disabled={!isBasicInfoComplete}>
              Location
            </TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit(onSubmit)} className="grid h-full">
            <TabsContent value="basic" className="space-y-4 h-full grid">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">
                    Company Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    {...register('name')}
                    id="name"
                    placeholder="Enter company name"
                    errorMessage={errors.name?.message}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="description">
                    Description<span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    {...register('description')}
                    id="description"
                    placeholder="Enter company description"
                    className="min-h-[120px]"
                    errorMessage={errors.description?.message}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email">
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    {...register('email')}
                    id="email"
                    type="email"
                    placeholder="Enter company email"
                    errorMessage={errors.email?.message}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="website">
                    Website<span className="text-red-500">*</span>
                  </Label>
                  <Input
                    {...register('website')}
                    id="website"
                    placeholder="Enter company website"
                    errorMessage={errors.website?.message}
                  />
                </div>
              </div>

              <div className="flex justify-end mt-auto">
                <Button type="button" onClick={() => setActiveTab('media')} disabled={!isBasicInfoComplete}>
                  Next: Media
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="media" className="space-y-4 pt-4 h-full grid">
              <div className="grid gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label>Company Logo</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">Recommended size: 200x200px. PNG or JPG format.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className="grid gap-2 w-fit">
                    <div className="relative">
                      <CompanyLogo
                        className="bg-muted border-2 h-16 w-16"
                        company={{
                          logo: avatarPreview && avatar ? URL.createObjectURL(avatar) : undefined,
                          name: formData.name
                        }}
                      />

                      <div className="absolute -bottom-1 right-0">
                        <Label
                          htmlFor="logo"
                          className={cn(buttonVariants({ size: 'sm' }), 'relative gap-0 rounded-full h-6 w-6')}>
                          <Upload className="h-2 w-2" />
                          <Input
                            type="file"
                            id="logo"
                            className="hidden h-0 w-0 absolute"
                            accept="image/*"
                            onChange={handleAvatarChange}
                          />
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label>Cover Image</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">Recommended size: 1200x400px. PNG or JPG format.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className="relative overflow-hidden rounded-md border-2 border-dashed border-muted-foreground/25 bg-muted/50">
                    {coverPreview ? (
                      <div className="relative aspect-[3/1] w-full">
                        <Image src={coverPreview} alt="Cover preview" className="h-full w-full object-cover" />
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute right-2 top-2 h-8 w-8 rounded-full"
                          onClick={removeCover}
                          type="button">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <Dropzone
                        accept={{ 'image/*': [] }}
                        multiple={false}
                        showFilesList={false}
                        onDropAccepted={(files) => {
                          const file = files[0];
                          setCover(file);
                          setCoverPreview(URL.createObjectURL(file));
                        }}
                        containerClassName="flex aspect-[3/1] w-full cursor-pointer flex-col items-center justify-center p-4">
                        {() => (
                          <div className="flex flex-col items-center gap-2 text-center">
                            <Upload className="h-8 w-8 text-muted-foreground" />
                            <p className="font-medium">Drag & drop or click to upload cover image</p>
                            <p className="text-sm text-muted-foreground">PNG, JPG up to 5MB</p>
                          </div>
                        )}
                      </Dropzone>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-auto">
                <Button type="button" variant="outline" onClick={() => setActiveTab('basic')}>
                  Back
                </Button>
                <Button type="button" onClick={() => setActiveTab('location')} disabled={!isBasicInfoComplete}>
                  Next: Location
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="location" className="pt-4 grid gap-4 h-full">
              <div className="space-y-4">
                <div className="space-y-2">
                  <AddressAutocomplete
                    placeholder="Enter company address"
                    onAddressSelect={(address) => {
                      setValue('location', address, {
                        shouldValidate: true,
                        shouldDirty: true
                      });
                    }}
                    defaultValue={formData.location}
                    className="w-full"
                  />
                  {errors.location?.address && (
                    <p className="text-sm text-destructive">{errors.location.address.message}</p>
                  )}
                </div>

                {formData.location?.address && (
                  <div className="rounded-md bg-muted p-3">
                    <p className="text-sm font-medium">Selected Address:</p>
                    <p className="text-sm text-muted-foreground">{formData.location.address}</p>
                  </div>
                )}
              </div>

              <div className="flex justify-between mt-auto">
                <Button type="button" variant="outline" onClick={() => setActiveTab('media')}>
                  Back
                </Button>
                <Button type="submit" disabled={isLoading} isLoading={isLoading}>
                  Create Company
                </Button>
              </div>
            </TabsContent>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
