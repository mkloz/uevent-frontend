'use client';

import { MapPin } from 'lucide-react';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';

import type { CreateEventDto } from '@/modules/event/services/event.service';
import { AddressAutocomplete } from '@/shared/components/maps/address-autocomplete';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { Toggle } from '@/shared/components/ui/toggle';
import type { Optional } from '@/shared/types/interfaces';

interface LocationFieldProps {
  label?: string;
  required?: boolean;
  toggleLabel?: {
    online: string;
    inPerson: string;
  };
}

export const LocationField = ({
  label = 'Event Location',
  required = true,
  toggleLabel = { online: 'Online Event', inPerson: 'In-Person Event' }
}: LocationFieldProps) => {
  const form = useFormContext<Optional<CreateEventDto>>();
  const location = form.watch('location');
  const [onlineEvent, setOnlineEvent] = useState(false);

  return (
    <FormField
      control={form.control}
      name={'location'}
      render={({ field }) => (
        <FormItem className="space-y-2">
          <FormLabel className="text-xl font-semibold">
            {label} {required && <span className="text-red-500">*</span>}
          </FormLabel>
          <FormControl>
            <div className="grid gap-2 w-full">
              <Toggle
                pressed={onlineEvent}
                onPressedChange={() => {
                  setOnlineEvent((prev) => !prev);
                  form.setValue(field.name, !onlineEvent ? null : undefined, {
                    shouldDirty: true
                  });
                  form.trigger(field.name);
                }}
                className="min-w-30 rounded-full">
                {onlineEvent ? toggleLabel.online : toggleLabel.inPerson}
              </Toggle>
              <AddressAutocomplete
                value={field.value}
                onAddressSelect={(address) => field.onChange(address)}
                label={null}
                disabled={onlineEvent}
                placeholder="Search for a location"
                className="h-12"
              />
            </div>
          </FormControl>
          {location && (
            <div className="p-4 mt-2 border rounded-md bg-muted/30">
              <div className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">{location.address}</p>
                  <p className="text-xs text-muted-foreground">
                    Lat: {location.lat.toFixed(6)}, Lng: {location.lng.toFixed(6)}
                  </p>
                </div>
              </div>
            </div>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
