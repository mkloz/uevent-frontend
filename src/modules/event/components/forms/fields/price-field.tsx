'use client';

import { DollarSign } from 'lucide-react';
import { useFormContext } from 'react-hook-form';

import type { CreateEventDto } from '@/modules/event/services/event.service';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import type { Optional } from '@/shared/types/interfaces';

interface PriceFieldProps {
  label?: string;
  required?: boolean;
  description?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export const PriceField = ({
  label = 'Price',
  required = true,
  description = 'Set to 0 for free events',
  placeholder = '0.00',
  disabled = false,
  className = 'pl-10 h-12'
}: PriceFieldProps) => {
  const form = useFormContext<Optional<CreateEventDto>>();

  return (
    <FormField
      control={form.control}
      name={'price'}
      render={({ field }) => (
        <FormItem className="space-y-2">
          <FormLabel className="text-base">
            {label} {required && <span className="text-red-500">*</span>}
          </FormLabel>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
            <FormControl>
              <Input
                type="number"
                min="0"
                step="0.1"
                className={className}
                placeholder={placeholder}
                disabled={disabled}
                {...field}
                value={field.value || ''}
                onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || 0)}
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
