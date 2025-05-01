import { useMemo } from 'react';

import { getStaticMapImageUrl } from '../../utils/maps.utils';
import { Image } from '../common/image';

interface StaticMapProps {
  center: { lat: number; lng: number };
  zoom?: number;
  width?: number;
  height?: number;
  markers?: Array<{
    position: { lat: number; lng: number };
    color?: string;
    label?: string;
  }>;
  className?: string;
  alt?: string;
}

export const StaticMap = ({
  center,
  zoom = 14,
  width = 600,
  height = 300,
  markers = [],
  className,
  alt = 'Static map'
}: StaticMapProps) => {
  // Generate the static map URL
  const mapUrl = useMemo(() => {
    return getStaticMapImageUrl({
      center,
      zoom,
      size: { width, height },
      markers: markers
    });
  }, [center, zoom, width, height, markers]);

  return <Image src={mapUrl} alt={alt} width={width} height={height} className={className} />;
};
