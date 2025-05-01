import { useMutation } from '@tanstack/react-query';
import { fromLatLng } from 'react-geocode';

import { Coordinates, LocationDto } from '@/shared/types/maps';

export const useReverseGeocoding = (onSuccess?: (address: LocationDto) => void) => {
  const mutation = useMutation<LocationDto, Error, Coordinates>({
    mutationFn: ({ lat, lng }) =>
      fromLatLng(lat, lng).then(({ results, status }) => {
        if (status !== 'OK') {
          throw new Error('Failed to fetch address');
        }
        const formattedAddress = results[0].formatted_address;

        return {
          address: formattedAddress,
          lat: lat,
          lng: lng
        };
      }),
    onSuccess
  });

  return mutation;
};
