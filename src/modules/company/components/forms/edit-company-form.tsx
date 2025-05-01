import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Upload, X } from 'lucide-react';
import type React from 'react';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Dropzone from 'shadcn-dropzone';
import { toast } from 'sonner';

import { AddressAutocomplete } from '@/shared/components/maps/address-autocomplete';
import { Button, buttonVariants } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Separator } from '@/shared/components/ui/separator';
import { Textarea } from '@/shared/components/ui/textarea';
import { QueryKeys } from '@/shared/constants/query-keys';
import { cn } from '@/shared/lib/utils';
import type { LocationDto } from '@/shared/types/maps';

import { Image } from '../../../../shared/components/common/image';
import { type Company, type CompanyDto, CompanySchema } from '../../interfaces/company.interface';
import { CompanyService } from '../../services/company.service';
import { CompanyLogo } from '../company-logo';

interface Props {
  company: Company;
  onSuccess?: () => void;
}

export const EditCompanyForm: FC<Props> = ({ company, onSuccess }) => {
  const queryClient = useQueryClient();
  const [avatar, setAvatar] = useState<File | null>(null);
  const [cover, setCover] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string>(company.coverImage || '');
  const [isMediaChanged, setIsMediaChanged] = useState(false);

  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors, isValid, isDirty }
  } = useForm<CompanyDto>({
    resolver: zodResolver(CompanySchema),
    defaultValues: {
      name: company.name,
      description: company.description || '',
      email: company.email,
      website: company.website || '',
      location: company.location
    },
    mode: 'onChange'
  });

  useEffect(() => {
    // Reset previews if company changes
    setCoverPreview(company.coverImage || '');
  }, [company]);

  const { mutate: updateCompany, isPending } = useMutation({
    mutationFn: (data: CompanyDto) => CompanyService.update(company.id, data),
    onSuccess: () => {
      if (isMediaChanged) {
        updateMedia();
        return;
      }

      queryClient.invalidateQueries({ queryKey: [QueryKeys.MY_COMPANIES] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.COMPANIES, company.id] });
      onSuccess?.();
    }
  });

  const { mutate: updateMedia, isPending: isPendingMedia } = useMutation({
    mutationFn: () => {
      const promises = [];

      if (avatar) {
        promises.push(CompanyService.updateLogo(company.id, avatar));
      }

      if (cover) {
        promises.push(CompanyService.updateCover(company.id, cover));
      }

      return Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.MY_COMPANIES] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.COMPANIES, company.id] });
      onSuccess?.();
    },
    onError: (error) => {
      toast.error('Failed to update company media', {
        description: error instanceof Error ? error.message : 'Please try again later'
      });
    }
  });

  const handleAddressChange = (address: LocationDto) => {
    setValue('location.address', address.address, { shouldValidate: true, shouldDirty: true });
    setValue('location.lat', address.lat, { shouldValidate: true, shouldDirty: true });
    setValue('location.lng', address.lng, { shouldValidate: true, shouldDirty: true });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setAvatar(file);
      setIsMediaChanged(true);
    }
  };

  const handleCoverDrop = (files: File[]) => {
    const file = files[0];
    if (file) {
      setCover(file);
      setCoverPreview(URL.createObjectURL(file));
      setIsMediaChanged(true);
    }
  };

  const onSubmit = (data: CompanyDto) => {
    updateCompany(data);
  };

  const isLoading = isPending || isPendingMedia;
  const hasChanges = isDirty || isMediaChanged;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="name">
            Name <span className="text-red-500">*</span>
          </Label>
          <Input {...register('name')} id="name" placeholder="Enter company name" errorMessage={errors.name?.message} />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="description">
            Description <span className="text-red-500">*</span>
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
            placeholder="Enter company email"
            errorMessage={errors.email?.message}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="website">
            Website <span className="text-red-500">*</span>
          </Label>
          <Input
            {...register('website')}
            id="website"
            placeholder="Enter company website"
            errorMessage={errors.website?.message}
          />
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="flex flex-col gap-6 sm:flex-row">
          <div className="space-y-2">
            <Label>Logo</Label>
            <div className="grid gap-2 w-fit">
              <div className="relative">
                <CompanyLogo company={company} className="h-20 w-20" />

                <div className="absolute -bottom-1 right-0">
                  <Label
                    htmlFor="logo-edit"
                    className={cn(buttonVariants({ size: 'sm' }), 'relative gap-0 rounded-full h-6 w-6')}>
                    <Upload className="h-2 w-2" />
                    <Input
                      type="file"
                      id="logo-edit"
                      className="hidden h-0 w-0 absolute"
                      accept="image/*"
                      onChange={handleAvatarChange}
                    />
                  </Label>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2 flex-1">
            <Label>Cover Image</Label>
            <div className="relative overflow-hidden rounded-md border-2 border-dashed border-muted-foreground/25 bg-muted/50">
              {coverPreview ? (
                <div className="relative w-full h-20">
                  <Image src={coverPreview} alt="Cover preview" className="h-full w-full object-cover" />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute right-2 top-2 h-8 w-8 rounded-full shadow-lg"
                    onClick={() => {
                      setCover(null);
                      setCoverPreview('');
                      setIsMediaChanged(false);
                    }}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Dropzone
                  accept={{ 'image/*': [] }}
                  multiple={false}
                  showFilesList={false}
                  onDropAccepted={handleCoverDrop}
                  containerClassName="flex h-20 w-full cursor-pointer flex-col items-center justify-center p-4">
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
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <AddressAutocomplete onAddressSelect={handleAddressChange} defaultValue={company.location} className="w-full" />
        {errors.location?.address && <p className="text-sm text-destructive">{errors.location.address.message}</p>}
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={!isValid || isLoading || !hasChanges} isLoading={isLoading}>
          Save Changes
        </Button>
      </div>
    </form>
  );
};
