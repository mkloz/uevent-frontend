'use client';

import { useFormContext } from 'react-hook-form';

import { EventThemeType } from '@/modules/event/interfaces/event.interface';
import type { CreateEventDto } from '@/modules/event/services/event.service';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import MultiSelector from '@/shared/components/ui/multi-selector';
import type { Optional } from '@/shared/types/interfaces';

interface ThemesFieldProps {
  label?: string;
  required?: boolean;
}

const THEME_OPTIONS = Object.values(EventThemeType).map((theme) => ({
  value: theme,
  label: theme
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (l) => l.toUpperCase())
}));

export const ThemesField = ({ label = 'Event Themes', required = true }: ThemesFieldProps) => {
  const form = useFormContext<Optional<CreateEventDto>>();

  return (
    <FormField
      control={form.control}
      name={'themes'}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-base h-fit">
            {label} {required && <span className="text-red-500">*</span>}
          </FormLabel>
          <FormControl>
            <MultiSelector
              options={THEME_OPTIONS}
              value={(field.value || []).map((theme) => ({
                value: theme,
                label: theme
                  .replace(/_/g, ' ')
                  .toLowerCase()
                  .replace(/\b\w/g, (l) => l.toUpperCase())
              }))}
              defaultOptions={(field.value || []).map((theme) => ({
                value: theme,
                label: theme
                  .replace(/_/g, ' ')
                  .toLowerCase()
                  .replace(/\b\w/g, (l) => l.toUpperCase())
              }))}
              onChange={(values) => field.onChange(values.map((v) => v.value as EventThemeType))}
              placeholder="Select themes"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
