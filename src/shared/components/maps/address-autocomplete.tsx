import { Check, Loader2 } from 'lucide-react';
import { type CSSProperties, type FC, useCallback, useEffect, useRef, useState } from 'react';

import { useAddressSuggestions } from '@/shared/hooks/maps/use-address-suggestions';
import { useGoogleMaps } from '@/shared/hooks/maps/use-google-maps';
import { usePlaceDetails } from '@/shared/hooks/maps/use-places-details';
import { useReverseGeocoding } from '@/shared/hooks/maps/use-reverse-geocoding';
import { cn } from '@/shared/lib/utils';
import type { LocationDto } from '@/shared/types/maps';

import { Command, CommandGroup, CommandItem, CommandList } from '../ui/command';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useDebounce } from '../ui/multi-selector';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { LocationPicker } from './location-picker';

interface AddressAutocompleteProps {
  value?: LocationDto | null;
  onAddressSelect?: (address: LocationDto | null) => void;
  defaultValue?: LocationDto;
  placeholder?: string;
  className?: string;
  label?: string | null;
  disabled?: boolean;
  mapContainerStyle?: CSSProperties;
}

export const AddressAutocomplete: FC<AddressAutocompleteProps> = ({
  value,
  onAddressSelect,
  defaultValue,
  label,
  placeholder = 'Search for an address...',
  className,
  disabled = false,
  mapContainerStyle = {
    width: '100%',
    height: '280px'
  }
}) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState<string>(defaultValue?.address || '');
  const [selectedAddress, setSelectedAddress] = useState<LocationDto | null>(null);

  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesService = useRef<google.maps.places.PlacesService | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isLoaded } = useGoogleMaps();
  const [debouncedValue, isTyping] = useDebounce(inputValue, 500);

  useEffect(() => {
    if (isLoaded) {
      autocompleteService.current = new google.maps.places.AutocompleteService();

      const dummyElement = document.createElement('div');
      placesService.current = new google.maps.places.PlacesService(dummyElement);

      if (defaultValue?.lat && defaultValue.lng) {
        reverseGeocode(defaultValue);
      }
    }
  }, [isLoaded]);

  useEffect(() => {
    if (value === undefined) return;

    setSelectedAddress(value || null);
    setInputValue(value?.address || '');
  }, [value, selectedAddress]);

  const { mutate: getPlaceDetails, isPending: isFetchingDetails } = usePlaceDetails((newAddress) => {
    setSelectedAddress(newAddress);
    setInputValue(newAddress.address);
    onAddressSelect?.(newAddress);
  });

  const { mutate: reverseGeocode, isPending: isReverseGeocoding } = useReverseGeocoding((newAddress) => {
    setSelectedAddress(newAddress);
    setInputValue(newAddress.address);
    onAddressSelect?.(newAddress);
  });

  const { data: suggestions, isLoading: isFetching } = useAddressSuggestions(
    debouncedValue,
    debouncedValue.length >= 3,
    autocompleteService.current
  );

  // Auto-select the suggestion when there's exactly one
  useEffect(() => {
    if (suggestions?.length === 1 && !isFetching && !isTyping && placesService.current) {
      // Auto-select the single suggestion
      getPlaceDetails({
        placeId: suggestions[0].placeId,
        placesService: placesService.current
      });
    }
  }, [suggestions, isFetching, isTyping, getPlaceDetails]);

  useEffect(() => {
    setIsLoading(isFetching || isReverseGeocoding || isFetchingDetails || isTyping);
  }, [isFetching, isReverseGeocoding, isFetchingDetails, isTyping]);

  const handleSuggestionOpen = useCallback(() => {
    setOpen(true);
    inputRef.current?.focus();
  }, [setOpen, inputRef]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!open) {
        handleSuggestionOpen();
      }
      console.log('e.target.value: ', e.target.value);
      setInputValue(e.target.value);
    },
    [open]
  );

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        <span className="ml-2">Loading Google Maps...</span>
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div className="space-y-2">
        {label !== null && <Label htmlFor="address">{label || 'Address'}</Label>}
        <Popover open={open}>
          <Command className="border-none bg-transparent">
            <PopoverTrigger>
              <Input
                type="search"
                placeholder={placeholder}
                value={inputValue}
                onChange={handleInputChange}
                onClick={handleSuggestionOpen}
                disabled={disabled}
                ref={inputRef}
              />
            </PopoverTrigger>
            <PopoverContent
              className="min-w-100 p-0 border-none"
              side="bottom"
              sideOffset={4}
              onOpenAutoFocus={(e) => {
                e.preventDefault();
              }}
              onInteractOutside={() => {
                setOpen(false);
                if (!inputValue) {
                  onAddressSelect?.(null);
                }
              }}
              showArrow={false}>
              <CommandList className="w-full min-w-full">
                <div
                  className={cn(
                    'rounded-md border overflow-hidden hidden',
                    !isLoading && (!inputValue || (suggestions?.length || 0) === 1) && 'block'
                  )}>
                  <LocationPicker
                    initialLocation={selectedAddress || undefined}
                    onLocationChange={(newAddress) => {
                      setSelectedAddress(newAddress);
                      setInputValue(newAddress.address);
                      onAddressSelect?.(newAddress);
                    }}
                    height={mapContainerStyle.height}
                    width={mapContainerStyle.width}
                  />
                </div>
                {suggestions?.length === 0 && !isLoading && inputValue && (
                  <p className="px-4 py-2 text-sm text-muted-foreground text-center"> No address found.</p>
                )}
                {isLoading && (
                  <p className="px-4 py-2 text-sm text-muted-foreground text-center"> Searching for address...</p>
                )}
                {!isLoading && inputValue && (suggestions?.length || 0) > 1 && (
                  <CommandGroup>
                    {suggestions?.map((suggestion) => (
                      <CommandItem
                        key={suggestion.placeId}
                        value={suggestion.description}
                        onSelect={() => {
                          getPlaceDetails({
                            placeId: suggestion.placeId,
                            placesService: placesService.current
                          });
                          // setOpen(false);
                        }}>
                        <Check
                          className={cn(
                            'h-4 w-4',
                            selectedAddress?.address === suggestion.description ? 'opacity-100' : 'opacity-0'
                          )}
                        />
                        {suggestion.description}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
              </CommandList>
            </PopoverContent>
          </Command>
        </Popover>
      </div>
    </div>
  );
};
