/**
 * Options for generating a static map image URL
 */
export interface StaticMapOptions {
  center: { lat: number; lng: number };
  zoom?: number;
  size?: { width: number; height: number };
  scale?: 1 | 2 | 4;
  format?: 'png' | 'png8' | 'png32' | 'gif' | 'jpg' | 'jpg-baseline';
  mapType?: 'roadmap' | 'satellite' | 'terrain' | 'hybrid';
  markers?: Array<{
    position: { lat: number; lng: number };
    color?: string;
    label?: string;
    size?: 'tiny' | 'mid' | 'small' | 'normal';
  }>;
  path?: Array<{ lat: number; lng: number }>;
  apiKey?: string;
}

/**
 * Generates a URL for a static Google Maps image
 */
export const getStaticMapImageUrl = (options: StaticMapOptions): string => {
  const {
    center,
    zoom = 14,
    size = { width: 600, height: 300 },
    scale = 2,
    format = 'png',
    mapType = 'roadmap',
    markers = [],
    path = [],
    apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || import.meta.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  } = options;

  // Base URL
  let url = 'https://maps.googleapis.com/maps/api/staticmap?style=feature:poi|element:labels|visibility:off';

  url += `&center=${center.lat},${center.lng}`;
  url += `&zoom=${zoom}`;
  url += `&size=${size.width}x${size.height}`;
  url += `&scale=${scale}`;
  url += `&format=${format}`;
  url += `&maptype=${mapType}`;

  // Add markers
  markers.forEach((marker) => {
    let markerParam = 'markers=';

    if (marker.color) {
      markerParam += `color:${marker.color}|`;
    }

    if (marker.size) {
      markerParam += `size:${marker.size}|`;
    }

    if (marker.label) {
      markerParam += `label:${marker.label}|`;
    }

    markerParam += `${marker.position.lat},${marker.position.lng}`;
    url += `&${markerParam}`;
  });

  // Add path if provided
  if (path.length > 0) {
    const pathParam = path.map((point) => `${point.lat},${point.lng}`).join('|');
    url += `&path=color:0x0000ff|weight:5|${pathParam}`;
  }

  // Add API key
  url += `&key=${apiKey}`;

  return url;
};
