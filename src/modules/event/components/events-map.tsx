import { useEffect, useState } from 'react';

import { EventsMap as EventsMapComponent, type MapEvent } from '../../../shared/components/maps/events-map';
import type { Event } from '../interfaces/event.interface';

interface EventsMapComponentProps {
  events: Event[];
}

export const EventsMap = ({ events }: EventsMapComponentProps) => {
  const [mapEvents, setMapEvents] = useState<MapEvent[]>([]);

  // Convert events to map events format
  useEffect(() => {
    const convertedEvents = events
      .filter((event) => event.location?.lat && event.location?.lng) // Only include events with valid coordinates
      .map((event) => ({
        id: event.id,
        title: event.title,
        description:
          event.description?.substring(0, 100) + (event.description && event.description.length > 100 ? '...' : ''),
        position: {
          lat: event.location?.lat || 0,
          lng: event.location?.lng || 0
        },
        startDate: event.startDate,
        imageUrl: event.posterUrl,
        price: event.price,
        url: `/events/${event.id}`
      }));

    setMapEvents(convertedEvents);
  }, [events]);

  return (
    <div className="h-150 rounded-lg overflow-hidden">
      <EventsMapComponent events={mapEvents} />
    </div>
  );
};
