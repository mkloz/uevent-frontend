'use client';

import { Users } from 'lucide-react';
import { useFormContext } from 'react-hook-form';

import type { CreateEventDto } from '@/modules/event/services/event.service';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import type { Optional } from '@/shared/types/interfaces';

interface MaxAttendeesFieldProps {
  label?: string;
  description?: string;
  placeholder?: string;
  className?: string;
  min?: number;
}

export const MaxAttendeesField = ({
  label = 'Max Attendees (Optional)',
  description = 'Leave empty for unlimited attendees',
  placeholder = 'Unlimited',
  className = 'pl-10 h-12',
  min = 1
}: MaxAttendeesFieldProps) => {
  const form = useFormContext<Optional<CreateEventDto>>();

  return (
    <FormField
      control={form.control}
      name={'maxAttendees'}
      render={({ field }) => (
        <FormItem className="space-y-2">
          <FormLabel className="text-base">{label}</FormLabel>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
            <FormControl>
              <Input
                type="number"
                min={min}
                className={className}
                placeholder={placeholder}
                {...field}
                value={field.value || ''}
                onChange={(e) => {
                  const value = e.target.value;
                  const parsedValue = value ? Number.parseInt(value) : null;

                  if (parsedValue && min && parsedValue < min) {
                    field.onChange(min);
                    return;
                  }
                  field.onChange(parsedValue);
                }}
              />
            </FormControl>
          </div>
          <FormDescription>{description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
