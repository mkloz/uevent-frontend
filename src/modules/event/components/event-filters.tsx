import { zodResolver } from '@hookform/resolvers/zod';
// import { AddressAutocomplete } from '../../../shared/components/maps/address-autocomplete';
import { useCallback } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { FiDollarSign, FiMapPin, FiTag } from 'react-icons/fi';

import { Button } from '@/shared/components/ui/button';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Label } from '@/shared/components/ui/label';
import { Separator } from '@/shared/components/ui/separator';
import { Slider } from '@/shared/components/ui/slider';

import { AddressAutocomplete } from '../../../shared/components/maps/address-autocomplete';
import { Form } from '../../../shared/components/ui/form';
import { Toggle } from '../../../shared/components/ui/toggle';
import { EventFormatType, EventThemeType } from '../interfaces/event.interface';
import { type EventGetManyDto, EventGetManySchema } from '../services/event.service';
import { DateRangeFilter } from './date-range-filter';

interface EventFiltersProps {
  onFilterChange: (filter: EventGetManyDto) => void;
  filters: EventGetManyDto;
  onReset: () => void;
}

const MAX_PRICE = 300;

export const EventFilters = ({ onFilterChange, filters, onReset }: EventFiltersProps) => {
  const defaultValues = {
    format: [],
    search: '',
    themes: [],
    fromDate: null,
    toDate: null,
    priceTo: MAX_PRICE,
    priceFrom: 0,
    page: 1,
    lat: null,
    companyId: null,
    lng: null,
    address: null,
    isOnline: false,
    freeOnly: false
  };

  // Initialize the form with React Hook Form and Zod validation
  const { handleSubmit, control, watch, setValue, reset, ...other } = useForm<EventGetManyDto>({
    resolver: zodResolver(EventGetManySchema),
    reValidateMode: 'onChange',
    mode: 'onChange',

    defaultValues: {
      ...defaultValues,
      ...filters
    }
  });

  const onSubmit = useCallback(
    (data: EventGetManyDto) => {
      const dto = structuredClone(data);

      if (dto.priceTo === MAX_PRICE) {
        dto.priceTo = null;
      }

      if (dto.priceFrom === 0) {
        dto.priceFrom = null;
      }

      onFilterChange(dto);
    },
    [onFilterChange]
  );

  const handleReset = useCallback(() => {
    reset(defaultValues);
    onReset();
  }, [onReset, reset]);
  const onlineEvent = watch('isOnline') ?? false;
  const freeOnly = watch('freeOnly') ?? false;
  const lat = watch('lat');
  const lng = watch('lng');
  const address = watch('address');

  const form = {
    reset,
    handleSubmit,
    control,
    watch,
    setValue,
    onSubmit,
    ...other
  };
  const setLocation = useCallback(
    (lat: number | null | undefined, lng: number | null | undefined, address: string | null | undefined) => {
      setValue('lat', lat, { shouldDirty: true });
      setValue('lng', lng, { shouldDirty: true });
      setValue('address', address, { shouldDirty: true });
    },
    [setValue]
  );
  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Categories, Format, and Date Range */}
        <div className="grid gap-6">
          {/* Categories Section */}
          <div>
            <div className="flex items-center mb-3">
              <FiTag className="mr-2 text-primary" />
              <h3 className="font-semibold">Categories</h3>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {Object.values(EventThemeType).map((category) => (
                <div key={category} className="flex items-center">
                  <Controller
                    name="themes"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        id={`category-${category}`}
                        checked={field.value?.includes(category) || false}
                        onCheckedChange={(checked) => {
                          const currentThemes = field.value || [];
                          if (checked) {
                            setValue('themes', [...currentThemes, category]);
                          } else {
                            const filtered = currentThemes.filter((theme) => theme !== category);
                            setValue('themes', filtered.length > 0 ? filtered : []);
                          }
                        }}></Checkbox>
                    )}
                  />
                  <Label
                    htmlFor={`category-${category}`}
                    className="ml-2 text-sm font-normal cursor-pointer capitalize truncate">
                    {category.replace(/_/g, ' ').toLowerCase()}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Event Format Section */}
          <div>
            <h3 className="font-semibold mb-3">Event Format</h3>
            <div className="grid grid-cols-3 gap-2">
              {Object.values(EventFormatType).map((format) => (
                <div key={format} className="flex items-center">
                  <Controller
                    name="format"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        id={`format-${format}`}
                        checked={field.value?.includes(format) || false}
                        onCheckedChange={(checked) => {
                          const currentFormats = field.value || [];
                          if (checked) {
                            setValue('format', [...currentFormats, format]);
                          } else {
                            const filtered = currentFormats.filter((f) => f !== format);
                            setValue('format', filtered.length > 0 ? filtered : []);
                          }
                        }}
                      />
                    )}
                  />
                  <Label
                    htmlFor={`format-${format}`}
                    className="ml-2 text-sm font-normal cursor-pointer capitalize truncate">
                    {format.replace(/_/g, ' ').toLowerCase()}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          <Separator className="my-2 md:hidden" />
        </div>
        {/* Right Column: Price and Location */}
        <div className="grid gap-2 md:pl-6 md:border-l-2">
          {/* Date Range Section */}

          <DateRangeFilter
            dateRange={{ from: watch('fromDate') || null, to: watch('toDate') || null }}
            onDateRangeChange={(range) => {
              setValue('fromDate', range.from);
              setValue('toDate', range.to);
            }}
          />

          <Separator />

          <div>
            <div className="flex items-center mb-3">
              <FiDollarSign className="mr-2 text-primary" />
              <h3 className="font-semibold">Price</h3>
            </div>
            <div className="flex items-center gap-2">
              <div className="px-2 grid gap-2 grow mt-2">
                <Slider
                  value={[watch('priceFrom') || 0, watch('priceTo') || MAX_PRICE]}
                  min={0}
                  max={300}
                  step={5}
                  onValueChange={(value) => {
                    setValue('priceFrom', value[0]);
                    setValue('priceTo', value[1]);
                  }}
                />
                <div className="flex justify-between">
                  <span className="text-sm">${watch('priceFrom')}</span>
                  <span className="text-sm">
                    ${watch('priceTo') === MAX_PRICE ? `${MAX_PRICE}+` : watch('priceTo')}
                  </span>
                </div>
              </div>
              <Toggle
                pressed={freeOnly}
                onPressedChange={() => {
                  setValue('freeOnly', !freeOnly);
                  setValue('priceFrom', 0);
                  setValue('priceTo', freeOnly ? MAX_PRICE : 0);
                }}
                className="min-w-20 rounded-full">
                {freeOnly ? 'FREE' : 'ALL'}
              </Toggle>
            </div>
          </div>

          <Separator />

          <div>
            <div className="flex items-center mb-3">
              <FiMapPin className="mr-2 text-primary" />
              <h3 className="font-semibold">Location</h3>
            </div>
            <div className="flex items-center gap-2">
              <AddressAutocomplete
                placeholder="Search for a location"
                label={null}
                className="grow"
                disabled={onlineEvent}
                value={
                  lat && lng && address
                    ? {
                        lat,
                        lng,
                        address
                      }
                    : null
                }
                onAddressSelect={(loc) => {
                  if (!loc) {
                    setLocation(null, null, null);
                    return;
                  }
                  setLocation(loc.lat, loc.lng, loc.address);
                }}
              />
              <Toggle
                pressed={onlineEvent}
                onPressedChange={() => {
                  setValue('isOnline', !onlineEvent);
                  setLocation(null, null, null);
                }}
                className="min-w-20 rounded-full">
                {onlineEvent ? 'ONLINE' : 'ALL'}
              </Toggle>
            </div>
          </div>

          <Separator />
          <div className="flex items-center justify-between gap-2 mt-auto flex-wrap">
            <Button variant="outline" onClick={handleReset} type="reset">
              Reset Filters
            </Button>

            <Button
              type="submit"
              className="grow"
              disabled={!form.formState.isValid || form.formState.isSubmitting}
              isLoading={form.formState.isSubmitting}>
              Apply
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};
