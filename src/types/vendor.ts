import { Prisma } from '@prisma/client';

/**
 * List of keys that will be requested in the Google places API
 */
export const GooglePlacesKeys = [
  'place_id',
  'name',
  'formatted_address',
  'geometry',
  'icon',
  'price_level',
  'rating',
  'url',
  'website',
] as const;

type GooglePlacesKeys = (typeof GooglePlacesKeys)[number];

// Vendor data without the id, to be used in POST requests
const vendorData = Prisma.validator<Prisma.VendorArgs>()({
  select: { address: true, name: true, place: true },
});
export type VendorWithoutId = Prisma.VendorGetPayload<typeof vendorData>;
