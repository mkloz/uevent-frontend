'use client';

import { useFormContext } from 'react-hook-form';

import type { CreateEventDto } from '@/modules/event/services/event.service';
import { FormField, FormItem, FormLabel } from '@/shared/components/ui/form';
import { Switch } from '@/shared/components/ui/switch';
import type { Optional } from '@/shared/types/interfaces';

interface ShowAttendeeListFieldProps {
  name?: string;
  label?: string;
  description?: string;
}

export const ShowAttendeeListField = ({
  label = 'Show Attendee List',
  description = 'Allow attendees to see who else is attending'
}: ShowAttendeeListFieldProps) => {
  const form = useFormContext<Optional<CreateEventDto>>();

  return (
    <FormField
      control={form.control}
      name={'showAttendeeList'}
      render={({ field }) => (
        <FormItem className="flex items-center justify-between p-4 border rounded-md bg-muted/20">
          <div className="space-y-0.5">
            <FormLabel className="text-base">{label}</FormLabel>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          <Switch checked={field.value} onCheckedChange={field.onChange} />
        </FormItem>
      )}
    />
  );
};
