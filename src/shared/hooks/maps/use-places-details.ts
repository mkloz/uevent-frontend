import { useMutation } from '@tanstack/react-query';

import { LocationDto } from '@/shared/types/maps';

interface PlaceDetailsInput {
  placeId: string;
  placesService: google.maps.places.PlacesService | null;
}

export const usePlaceDetails = (onSuccess?: (address: LocationDto) => void) => {
  const mutation = useMutation<LocationDto, Error, PlaceDetailsInput>({
    mutationFn: ({ placeId, placesService }) =>
      new Promise((resolve, reject) => {
        if (!placesService) return reject(new Error('PlacesService not available'));

        placesService.getDetails(
          {
            placeId,
            fields: ['formatted_address', 'geometry']
          },
          (place, status) => {
            if (status !== google.maps.places.PlacesServiceStatus.OK || !place) {
              return reject(new Error('Place details fetch failed'));
            }

            resolve({
              address: place.formatted_address || '',
              lat: place.geometry?.location?.lat() || 0,
              lng: place.geometry?.location?.lng() || 0
            });
          }
        );
      }),
    onSuccess
  });

  return mutation;
};
