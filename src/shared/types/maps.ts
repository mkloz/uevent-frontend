import { z } from 'zod';

export interface AddressSuggestion {
  description: string;
  placeId: string;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export const LocationSchema = z.object({
  address: z.string().min(1, 'Address is required'),
  lat: z.number(),
  lng: z.number()
});
export type LocationDto = z.infer<typeof LocationSchema>;
