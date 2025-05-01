import { GoogleMap, InfoWindow, Marker } from '@react-google-maps/api';
import dayjs from 'dayjs';
import { Calendar, LucideMapPinOff } from 'lucide-react';
import { FC, useCallback, useEffect, useState } from 'react';

import { useGoogleMaps } from '../../hooks/maps/use-google-maps';
import { Image } from '../common/image';
import { Link } from '../common/link';
import { Button } from '../ui/button';
import { Card, CardContent, CardTitle } from '../ui/card';
import { Skeleton } from '../ui/skeleton';

// Define the event type for the map
export interface MapEvent {
  id: string;
  title: string;
  description?: string;
  position: {
    lat: number;
    lng: number;
  };
  startDate?: Date | string;
  imageUrl?: string;
  price?: number;
  url?: string;
}

interface EventsMapProps {
  events: MapEvent[];
  height?: string | number;
  width?: string | number;
  initialCenter?: { lat: number; lng: number };
  zoom?: number;
  className?: string;
  onMarkerClick?: (event: MapEvent) => void;
}

export const EventsMap: FC<EventsMapProps> = ({
  events,
  height = '600px',
  width = '100%',
  initialCenter,
  zoom = 12,
  className
}) => {
  const { isLoaded, isError, errorMessage } = useGoogleMaps();
  const [selectedEvent, setSelectedEvent] = useState<MapEvent | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [center, setCenter] = useState(initialCenter);

  // Calculate center if not provided
  useEffect(() => {
    if (!initialCenter && events.length > 0 && isLoaded) {
      // Calculate the center based on all event positions
      const bounds = new window.google.maps.LatLngBounds();
      events.forEach((event) => {
        bounds.extend(event.position);
      });

      // Get the center of the bounds
      const newCenter = {
        lat: (bounds.getNorthEast().lat() + bounds.getSouthWest().lat()) / 2,
        lng: (bounds.getNorthEast().lng() + bounds.getSouthWest().lng()) / 2
      };

      setCenter(newCenter);
    }
  }, [events, initialCenter, isLoaded]);

  // Handle map load
  const onMapLoad = useCallback(
    (map: google.maps.Map) => {
      setMap(map);
      // If we have events, fit the map to show all markers
      if (events.length > 0) {
        const bounds = new window.google.maps.LatLngBounds();
        events.forEach((event) => {
          bounds.extend(new window.google.maps.LatLng(event.position.lat, event.position.lng));
        });
        map.fitBounds(bounds);
      }
    },
    [events]
  );

  const handleMarkerClick = useCallback(
    (event: MapEvent) => {
      setSelectedEvent(event);
    },
    [setSelectedEvent]
  );

  // Close info window
  const handleInfoWindowClose = useCallback(() => {
    setSelectedEvent(null);
  }, [setSelectedEvent]);
  if (events.length === 0) {
    return (
      <div className="p-4 border bg-muted text-muted-foreground rounded-md flex items-center justify-center min-h-full text-2xl font-semibold relative gap-2">
        <LucideMapPinOff className="size-16" />
        No events available
        <br /> to display on the map.
      </div>
    );
  }
  if (isError) {
    return (
      <div className="p-4 border border-red-300 bg-red-50 text-red-700 rounded-md">
        Error loading Google Maps: {errorMessage}
      </div>
    );
  }

  if (!isLoaded) {
    return <Skeleton className="w-full h-full aspect-video rounded-md" />;
  }

  return (
    <div className={`${className} w-full h-full relative`}>
      <GoogleMap
        mapContainerStyle={{
          width: width,
          height: height
        }}
        center={center}
        zoom={zoom}
        onLoad={onMapLoad}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: true,
          zoomControl: false,
          minZoom: 1,
          maxZoom: 19,
          disableDoubleClickZoom: true,
          clickableIcons: false,
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
        {events.map((event) => (
          <Marker
            key={event.id}
            position={event.position}
            options={{ map }}
            onClick={() => handleMarkerClick(event)}
            icon={{
              url: '/map-pin-icon.png',
              scaledSize: new window.google.maps.Size(40, 40)
            }}
          />
        ))}

        {selectedEvent && (
          <InfoWindow
            position={selectedEvent.position}
            onCloseClick={handleInfoWindowClose}
            options={{ headerDisabled: true }}>
            <Card className="w-64 shadow-none border-0 p-0">
              <CardContent className="p-2 space-y-2">
                {selectedEvent.imageUrl && (
                  <div className="h-32 w-full overflow-hidden rounded-md">
                    <Image
                      src={selectedEvent.imageUrl}
                      alt={selectedEvent.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardTitle className="text-base">{selectedEvent.title}</CardTitle>

                {selectedEvent.startDate && (
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>{dayjs(selectedEvent.startDate).format('MMM D, YYYY')}</span>
                  </div>
                )}

                {selectedEvent.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2">{selectedEvent.description}</p>
                )}

                {selectedEvent.url && (
                  <Link to={selectedEvent.url} className="w-full p-0">
                    <Button variant="outline" size="sm" className="w-full">
                      View Details
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};
