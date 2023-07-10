import { Prisma } from '@prisma/client';
import { OneDishTempData } from './one-dish-temp-data';

/**
 * List of keys that will be requested in the Google places API
 */
export const GooglePlacesKeys = [
  'formatted_address',
  'geometry',
  'icon',
  'name',
  'photos',
  'place_id',
  'price_level',
  'rating',
  'url',
  'website',
] as const;

type GooglePlacesKeys = (typeof GooglePlacesKeys)[number];

export type VendorTier = 'first' | 'second' | 'third';

// Vendor data without the id, to be used in POST requests
const vendorData = Prisma.validator<Prisma.VendorArgs>()({
  select: { address: true, name: true, place: true, oneDishes: false, tier: true, vendorImage: true },
});
export type VendorWithoutId = Prisma.VendorGetPayload<typeof vendorData> & { oneDishesFiles: OneDishTempData[] };
