'use client';

import dayjs from 'dayjs';
import { useFormContext } from 'react-hook-form';

import type { CreateEventDto } from '@/modules/event/services/event.service';
import { DateTimeInput } from '@/shared/components/form/input/datetime-input';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import type { Optional } from '@/shared/types/interfaces';

interface EndDateFieldProps {
  label?: string;
  required?: boolean;
  startDateFieldName?: string;
}

export const EndDateField = ({ label = 'End Date', required = true }: EndDateFieldProps) => {
  const form = useFormContext<Optional<CreateEventDto>>();
  const startDate = form.watch('startDate');

  return (
    <FormField
      control={form.control}
      name={'endDate'}
      render={({ field }) => (
        <FormItem className="space-y-2">
          <FormLabel className="text-base">
            {label} {required && <span className="text-red-500">*</span>}
          </FormLabel>
          <FormControl>
            <DateTimeInput {...field} min={startDate ? dayjs(startDate).add(5, 'minute').toDate() : new Date()} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
