'use client';

import { useFormContext } from 'react-hook-form';

import { EventFormatType } from '@/modules/event/interfaces/event.interface';
import type { CreateEventDto } from '@/modules/event/services/event.service';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import type { Optional } from '@/shared/types/interfaces';

interface FormatFieldProps {
  label?: string;
  required?: boolean;
  className?: string;
}

const FORMAT_OPTIONS = Object.values(EventFormatType).map((format) => ({
  value: format,
  label: format
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (l) => l.toUpperCase())
}));

export const FormatField = ({
  label = 'Event Format',
  required = true,
  className = 'min-h-10 min-w-45 w-full'
}: FormatFieldProps) => {
  const form = useFormContext<Optional<CreateEventDto>>();

  return (
    <FormField
      control={form.control}
      name={'format'}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-base h-fit">
            {label} {required && <span className="text-red-500">*</span>}
          </FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger className={className}>
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="max-h-60">
              {FORMAT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
