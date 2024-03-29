import { Prisma } from '@prisma/client';

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
  select: {
    address: true,
    name: true,
    place: true,
    oneDishes: true,
    tier: true,
    vendorImage: true,
    created: true,
    updated: true,
  },
});
export type VendorWithoutId = Prisma.VendorGetPayload<typeof vendorData>;
