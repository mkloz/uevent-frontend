import { useQuery } from '@tanstack/react-query';

import { AddressSuggestion } from '@/shared/types/maps';

export const useAddressSuggestions = (
  inputValue: string,
  enabled: boolean,
  autocompleteService: google.maps.places.AutocompleteService | null
) => {
  return useQuery<AddressSuggestion[]>({
    queryKey: ['address-suggestions', inputValue],
    queryFn: () =>
      new Promise((resolve) => {
        if (!autocompleteService) return resolve([]);

        autocompleteService.getPlacePredictions(
          {
            input: inputValue,
            types: ['address']
          },
          (predictions, status) => {
            if (status !== google.maps.places.PlacesServiceStatus.OK || !predictions) {
              return resolve([]);
            }

            const suggestions = predictions.map((prediction) => ({
              description: prediction.description,
              placeId: prediction.place_id
            }));

            resolve(suggestions);
          }
        );
      }),
    enabled,
    staleTime: 5 * 60 * 1000
  });
};
