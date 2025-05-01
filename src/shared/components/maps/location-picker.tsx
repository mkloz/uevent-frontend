import { GoogleMap, Marker } from '@react-google-maps/api';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

import type { Location } from '../../../modules/event/interfaces/event.interface';
import { useGoogleMaps } from '../../hooks/maps/use-google-maps';
import { useReverseGeocoding } from '../../hooks/maps/use-reverse-geocoding';
import { useUserGeolocation } from '../../hooks/maps/use-user-geolocation';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';

interface LocationPickerProps {
  initialLocation?: Location;
  onLocationChange?: (location: Location) => void;
  height?: string | number;
  width?: string | number;
  zoom?: number;
  className?: string;
}

const defaultCenter = {
  address: '',
  lat: 51.5072,
  lng: -0.128092 // London as default
};

export const LocationPicker = ({
  initialLocation,
  onLocationChange,
  height = '400px',
  width = '100%',
  zoom = 12,
  className
}: LocationPickerProps) => {
  const { isLoaded, isError, errorMessage } = useGoogleMaps();
  const userLocation = useUserGeolocation();
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [currentLocation, setCurrentLocation] = useState<Location | undefined>(
    initialLocation || (userLocation.location ?? undefined)
  );
  const { mutate: reverseGeocode } = useReverseGeocoding((newAddress) => {
    if (!currentLocation) return;
    const updatedLocation = { ...currentLocation, address: newAddress.address };
    setCurrentLocation(updatedLocation);
    onLocationChange?.(updatedLocation);
  });

  useEffect(() => {
    if (isLoaded) {
      if (initialLocation && !initialLocation.address) {
        setCurrentLocation(initialLocation);
        reverseGeocode(initialLocation);
      }
    }
  }, [isLoaded, initialLocation, reverseGeocode]);

  const onMapClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (!e.latLng) return;

      const newPos = {
        lat: e.latLng.lat(),
        lng: e.latLng.lng()
      };

      const updatedLocation = { address: '', ...currentLocation, ...newPos };
      setCurrentLocation(updatedLocation);
      reverseGeocode(newPos);
    },
    [currentLocation, reverseGeocode]
  );

  const handleUseCurrentLocation = () => {
    if (userLocation.isLoading) {
      toast.error('Loading your location...');
      return;
    }

    if (userLocation.error) {
      toast.error('Failed to get your location');
      return;
    }

    if (userLocation.location) {
      const updatedLocation = { ...currentLocation, ...userLocation.location };
      setCurrentLocation(updatedLocation);
      onLocationChange?.(updatedLocation);
    }
  };

  if (isError) {
    return (
      <div className="p-4 border border-red-300 bg-red-50 text-red-700 rounded-md">
        Error loading Google Maps: {errorMessage}
      </div>
    );
  }

  if (!isLoaded) {
    return <Skeleton className="w-full h-[300px] rounded-md" />;
  }

  return (
    <div className={className}>
      <div className="relative">
        <GoogleMap
          mapContainerStyle={{ width, height }}
          center={currentLocation || defaultCenter}
          zoom={zoom}
          onLoad={setMap}
          onClick={onMapClick}
          options={{
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
            zoomControl: false,
            minZoom: 1,
            disableDoubleClickZoom: true,
            keyboardShortcuts: false,
            restriction: {
              latLngBounds: {
                north: 85,
                south: -85,
                west: -180,
                east: 180
              },
              strictBounds: true
            }
          }}>
          <Marker
            options={{ map }}
            key={currentLocation?.address}
            position={{
              lat: currentLocation?.lat || defaultCenter.lat,
              lng: currentLocation?.lng || defaultCenter.lng
            }}
            onClick={(e) => {
              if (map) {
                map.setZoom(zoom);
                map.panTo({
                  lat: currentLocation?.lat || defaultCenter.lat,
                  lng: currentLocation?.lng || defaultCenter.lng
                });
                onMapClick(e);
              }
            }}
            icon={{
              url: '/map-pin-icon.png',
              scaledSize: new window.google.maps.Size(40, 40)
            }}
          />
        </GoogleMap>

        <div className="absolute top-4 right-4 z-10">
          <Button variant="secondary" size="sm" type="button" onClick={handleUseCurrentLocation} className="shadow-md">
            Use My Location
          </Button>
        </div>
      </div>
    </div>
  );
};
