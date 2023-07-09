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
  'html_attributions',
] as const;

type GooglePlacesKeys = (typeof GooglePlacesKeys)[number];

export interface OnedishPlaceResult extends Omit<Pick<google.maps.places.PlaceResult, GooglePlacesKeys>, 'geometry'> {
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
    viewport: {
      south: number;
      west: number;
      north: number;
      east: number;
    };
  };
}

export interface Vendor {
  place?: OnedishPlaceResult;
  name: string;
  address: string;
}
