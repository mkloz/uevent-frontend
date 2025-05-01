'use client';

import { Upload, X } from 'lucide-react';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useFormContext } from 'react-hook-form';

import type { CreateEventDto } from '@/modules/event/services/event.service';
import { Image } from '@/shared/components/common/image';
import { Button } from '@/shared/components/ui/button';
import { FormItem, FormLabel } from '@/shared/components/ui/form';
import type { Optional } from '@/shared/types/interfaces';

interface PosterFieldProps {
  setPosterFile: (file: File | null) => void;
  posterPreview: string | null;
  setPosterPreview: (preview: string | null) => void;
  label?: string;
  description?: string;
}

export const PosterField = ({
  setPosterFile,
  posterPreview,
  setPosterPreview,
  label = 'Event Poster',
  description = 'A high-quality poster will help your event stand out. Recommended size: 1200x630 pixels.'
}: PosterFieldProps) => {
  const form = useFormContext<Optional<CreateEventDto>>();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setPosterFile(file);

        // Create preview
        const objectUrl = URL.createObjectURL(file);
        setPosterPreview(objectUrl);

        // Clear the posterUrl field since we're using file upload
        form.setValue('posterUrl', undefined);
      }
    },
    [form, setPosterFile, setPosterPreview]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024 // 5MB
  });

  const removePoster = () => {
    setPosterFile(null);
    setPosterPreview(null);
  };

  return (
    <FormItem className="space-y-2">
      <FormLabel className="text-base">{label}</FormLabel>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-md p-4 transition-colors ${
          isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
        } cursor-pointer hover:border-primary/50`}>
        <input {...getInputProps()} />
        {posterPreview ? (
          <div className="relative">
            <Image
              src={posterPreview || '/placeholder.svg'}
              alt="Event poster preview"
              className="w-full max-h-60 object-cover rounded-md"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8 rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                removePoster();
              }}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Upload className="h-12 w-12 text-muted-foreground mb-3" />
            <p className="text-base font-medium">Drag & drop your event poster here</p>
            <p className="text-sm text-muted-foreground mt-2">or click to browse (JPG, PNG, GIF up to 5MB)</p>
          </div>
        )}
      </div>
      <p className="text-sm text-muted-foreground mt-2">{description}</p>
    </FormItem>
  );
};
