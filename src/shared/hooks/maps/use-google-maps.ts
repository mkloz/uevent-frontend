import { Library } from '@googlemaps/js-api-loader/dist/index.d';
import { useJsApiLoader } from '@react-google-maps/api';

import { config } from '@/config/config';

// Define the libraries we'll need
const libraries: Library[] = ['places', 'geometry', 'places'];

/**
 * Custom hook to load the Google Maps JavaScript API
 */
export const useGoogleMaps = () => {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: config.googleMapsApiKey,
    libraries
  });

  return {
    maps: isLoaded ? window.google.maps : null,
    isLoaded,
    loadError,
    isError: !!loadError,
    errorMessage: loadError ? loadError.message : null
  };
};
