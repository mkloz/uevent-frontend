'use client';

import { useFormContext } from 'react-hook-form';

import type { CreateEventDto } from '@/modules/event/services/event.service';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { Textarea } from '@/shared/components/ui/textarea';
import type { Optional } from '@/shared/types/interfaces';

interface DescriptionFieldProps {
  label?: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
}

export const DescriptionField = ({
  label = 'Description',
  required = true,
  placeholder = 'Describe your event in detail. What can attendees expect?',
  className = 'min-h-[150px] resize-y'
}: DescriptionFieldProps) => {
  const form = useFormContext<Optional<CreateEventDto>>();

  return (
    <FormField
      control={form.control}
      name={'description'}
      render={({ field }) => (
        <FormItem className="space-y-2">
          <FormLabel className="text-base">
            {label} {required && <span className="text-red-500">*</span>}
          </FormLabel>
          <FormControl>
            <Textarea placeholder={placeholder} className={className} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
