'use client';

import { useFormContext } from 'react-hook-form';

import type { CreateEventDto } from '@/modules/event/services/event.service';
import { DateTimeInput } from '@/shared/components/form/input/datetime-input';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import type { Optional } from '@/shared/types/interfaces';

interface PublishDateFieldProps {
  label?: string;
  description?: string;
}

export const PublishDateField = ({
  label = 'Publish Date (Optional)',
  description = 'If set, the event will only be visible after this date'
}: PublishDateFieldProps) => {
  const form = useFormContext<Optional<CreateEventDto>>();
  const startDate = form.watch('startDate');

  return (
    <FormField
      control={form.control}
      name="publishAt"
      render={({ field }) => (
        <FormItem className="space-y-2 flex flex-col">
          <FormLabel className="text-base h-fit">{label}</FormLabel>
          <FormControl>
            <DateTimeInput {...field} min={new Date()} max={startDate} />
          </FormControl>
          <FormDescription>{description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
