'use client';

import { useFormContext } from 'react-hook-form';

import type { CreateEventDto } from '@/modules/event/services/event.service';
import { DateTimeInput } from '@/shared/components/form/input/datetime-input';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import type { Optional } from '@/shared/types/interfaces';

interface StartDateFieldProps {
  label?: string;
  required?: boolean;
  minDate?: Date;
}

export const StartDateField = ({
  label = 'Start Date',
  required = true,
  minDate = new Date()
}: StartDateFieldProps) => {
  const form = useFormContext<Optional<CreateEventDto>>();

  return (
    <FormField
      control={form.control}
      name={'startDate'}
      render={({ field }) => (
        <FormItem className="space-y-2">
          <FormLabel className="text-base">
            {label} {required && <span className="text-red-500">*</span>}
          </FormLabel>
          <FormControl>
            <DateTimeInput {...field} min={minDate} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
