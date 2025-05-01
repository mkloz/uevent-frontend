import { useQuery } from '@tanstack/react-query';
import ky from 'ky';
import { useEffect, useState } from 'react';

import { QueryKeys } from '../../constants/query-keys';
import { LocationDto } from '../../types/maps';
import { useReverseGeocoding } from './use-reverse-geocoding';

type UseUserGeolocationReturn = {
  location: LocationDto | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
};

const getBrowserGeolocation = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    });
  });
};

const getIpBasedGeolocation = async (): Promise<{ lat: number; lng: number }> => {
  try {
    const data = await ky.get('https://ipapi.co/json/').json<{
      latitude: number;
      longitude: number;
    }>();

    if (data.latitude && data.longitude) {
      return {
        lat: data.latitude,
        lng: data.longitude
      };
    }

    throw new Error('Could not get location from IP');
  } catch (error) {
    // Try another service as a second fallback
    const data = await ky.get('https://geolocation-db.com/json/').json<{
      latitude: string;
      longitude: string;
    }>();

    if (data.latitude && data.longitude) {
      return {
        lat: Number.parseFloat(data.latitude),
        lng: Number.parseFloat(data.longitude)
      };
    }

    throw new Error('All geolocation methods failed');
  }
};

export function useUserGeolocation(): UseUserGeolocationReturn {
  const [location, setLocation] = useState<LocationDto | null>(null);
  const { mutate: reverseGeocode, isPending: isGeocoding } = useReverseGeocoding(setLocation);

  const {
    data,
    isLoading: isLoadingCoordinates,
    error,
    refetch
  } = useQuery({
    queryKey: [QueryKeys.USER_GEOLOCATION],
    queryFn: async () => {
      try {
        const position = await getBrowserGeolocation();
        return {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
      } catch (error) {
        console.error('Error getting browser geolocation:', error);
        return await getIpBasedGeolocation();
      }
    },
    retry: false,
    staleTime: Number.POSITIVE_INFINITY
  });

  useEffect(() => {
    if (data && !isLoadingCoordinates && !error) {
      reverseGeocode({ lat: data.lat, lng: data.lng });
    }
  }, [data, isLoadingCoordinates, error, reverseGeocode]);

  return {
    location,
    isLoading: isLoadingCoordinates || isGeocoding,
    error,
    refetch
  };
}
