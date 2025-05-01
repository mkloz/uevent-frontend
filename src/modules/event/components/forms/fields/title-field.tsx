'use client';

import { useFormContext } from 'react-hook-form';

import type { CreateEventDto } from '@/modules/event/services/event.service';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import type { Optional } from '@/shared/types/interfaces';

interface TitleFieldProps {
  label?: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
}

export const TitleField = ({
  label = 'Event Title',
  required = true,
  placeholder = 'Enter a catchy title for your event',
  className = 'h-12'
}: TitleFieldProps) => {
  const form = useFormContext<Optional<CreateEventDto>>();

  return (
    <FormField
      control={form.control}
      name={'title'}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-base">
            {label} {required && <span className="text-red-500">*</span>}
          </FormLabel>
          <FormControl>
            <Input placeholder={placeholder} className={className} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
