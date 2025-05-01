import { ExternalLink, MapPin } from 'lucide-react';

import { StaticMap } from '@/shared/components/maps/static-map';
import { Button } from '@/shared/components/ui/button';

import type { Location } from '../../interfaces/event.interface';

interface EventMapProps {
  location: Location;
}

export const EventMap = ({ location }: EventMapProps) => {
  const openInMaps = () => {
    const url =
      'https://maps.google.com/?q=' +
      (location.lat && location.lng ? `${location.lat},${location.lng}` : `${encodeURIComponent(location.address)}`);

    window.open(url, '_blank');
  };

  return (
    <div className="relative rounded-lg overflow-hidden bg-muted group border">
      {/* Stylized map placeholder */}
      <StaticMap
        center={{ lat: location.lat, lng: location.lng }}
        zoom={12}
        width={800}
        height={300}
        className="w-full h-auto"
        alt={`Map showing location at ${location.address}`}
      />

      <MapPin className="absolute top-1/2 left-1/2 text-primary text-4xl animate-bounce-slow drop-shadow-md size-16 transform -translate-y-full -translate-x-1/2" />

      {/* Location details */}
      <div className="absolute bottom-0 left-0 p-2 bg-black/50 text-white w-full text-center">
        <p>{location.address}</p>
      </div>

      {/* Overlay with controls */}
      <div
        className={`absolute inset-0 bg-black/0 flex items-center justify-center transition-all duration-500 z-20 group-hover:bg-black/30`}>
        <div className={`transform transition-all duration-500 opacity-0 group-hover:opacity-100`}>
          <Button onClick={openInMaps} className="shadow-lg">
            <ExternalLink className="mr-2 h-4 w-4" />
            View on Google Maps
          </Button>
        </div>
      </div>
    </div>
  );
};
