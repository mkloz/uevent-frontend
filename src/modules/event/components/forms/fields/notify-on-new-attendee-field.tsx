'use client';

import { useFormContext } from 'react-hook-form';

import type { CreateEventDto } from '@/modules/event/services/event.service';
import { FormField, FormItem, FormLabel } from '@/shared/components/ui/form';
import { Switch } from '@/shared/components/ui/switch';
import type { Optional } from '@/shared/types/interfaces';

interface NotifyOnNewAttendeeFieldProps {
  label?: string;
  description?: string;
}

export const NotifyOnNewAttendeeField = ({
  label = 'Notify on New Attendee',
  description = 'Receive notifications when someone registers'
}: NotifyOnNewAttendeeFieldProps) => {
  const form = useFormContext<Optional<CreateEventDto>>();

  return (
    <FormField
      control={form.control}
      name={'notifyOnNewAttendee'}
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
