import { useEffect, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

const GOOGLE_PLACES_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;

/**
 * Hooks for services related to Google Places and Maps
 *
 * TODO Should come here and check that all this code is good and clean
 * @param mapRef
 * @returns
 */
const usePlacesServices = (
  mapRef: React.MutableRefObject<HTMLDivElement | null>
): [
  google.maps.places.AutocompleteService | undefined,
  google.maps.places.PlacesService | undefined,
  google.maps.Map | undefined,
  boolean,
] => {
  const [loading, setLoading] = useState(true);
  const [loader, setLoader] = useState<Loader | undefined>();
  const [autocompleteService, setAutocompleteService] = useState<google.maps.places.AutocompleteService | undefined>();
  const [placesService, setPlacesService] = useState<google.maps.places.PlacesService | undefined>();
  const [map, setMap] = useState<google.maps.Map | undefined>();

  useEffect(() => {
    const init = async () => {
      if (!GOOGLE_PLACES_API_KEY) {
        console.error('No Google Places API key found...');
        return;
      }
      const l = new Loader({
        apiKey: GOOGLE_PLACES_API_KEY,
        version: 'weekly',
        libraries: ['places'],
      });
      setLoader(l);
      setLoading(true);
      await initServices(l);
      setLoading(false);
    };

    const initServices = async (loader: Loader) => {
      if (!loader) {
        console.error('No loader yet!');
        return;
      }
      if (!mapRef.current) {
        return;
      }

      const { AutocompleteService, PlacesService } = await loader.importLibrary('places');
      const { Map } = await loader.importLibrary('maps');
      const map = new Map(mapRef.current, { center: { lat: 39.1019503402557, lng: -84.5016085506675 }, zoom: 15 });

      setAutocompleteService(new AutocompleteService());
      setPlacesService(new PlacesService(map));
      setMap(map);
    };

    if (!loader) {
      init();
    } else {
      initServices(loader);
    }
  }, [mapRef.current]);

  return [autocompleteService, placesService, map, loading];
};

export default usePlacesServices;
