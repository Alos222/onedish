import { useCallback, useEffect, useRef, useState } from 'react';
import { Box, Autocomplete, TextField, CircularProgress, Typography, Button, Divider } from '@mui/material';
import type { Vendor, VendorPlace } from '@prisma/client';
import { useDebouncedCallback } from 'use-debounce';
import usePlacesServices from '../../admin/vendors/hooks/usePlacesServices';
import { useNotifications } from 'src/client/common/hooks/useNotifications';
import { GooglePlacesKeys } from 'src/types';
import { ConfigService } from 'src/server/services/config.service';
import { Loader } from '@googlemaps/js-api-loader';
import GoogleContentInfo from './GoogleContentInfo';

type AutocompletePrediction = google.maps.places.AutocompletePrediction;

const googlePlaceToVendorPlace = (googlePlace: google.maps.places.PlaceResult): VendorPlace => ({
  formatted_address: googlePlace.formatted_address || null,
  geometry: googlePlace.geometry
    ? {
        location: {
          lat: googlePlace.geometry.location?.lat() || 0,
          lng: googlePlace.geometry.location?.lng() || 0,
        },
        viewport: {
          south: googlePlace.geometry.viewport?.getSouthWest().lat() || 0,
          west: googlePlace.geometry.viewport?.getSouthWest().lng() || 0,
          north: googlePlace.geometry.viewport?.getNorthEast().lat() || 0,
          east: googlePlace.geometry.viewport?.getNorthEast().lat() || 0,
        },
      }
    : null,
  icon: googlePlace.icon || null,
  name: googlePlace.name || null,
  place_id: googlePlace.place_id || null,
  price_level: googlePlace.price_level || null,
  rating: googlePlace.rating || null,
  url: googlePlace.url || null,
  website: googlePlace.website || null,
  html_attributions: googlePlace.html_attributions || [],
});

async function loadGoogleMaps(mapDiv: HTMLElement) {
  const [initialized, setInitialized] = useState(false);

  const loader = new Loader({
    apiKey: ConfigService.googlePlacesApiKey(),
    version: 'weekly',
    libraries: ['places'],
  });

  const { AutocompleteService, PlacesService } = await loader.importLibrary('places');
  const { Map } = await loader.importLibrary('maps');
  const map = new Map(mapDiv, { center: { lat: 39.1019503402557, lng: -84.5016085506675 }, zoom: 15 });
}

interface GoogleMapProps {
  place?: VendorPlace | null;
}

/**
 * Component for setting up vendor details, with a map that an be searched
 * @returns
 */
export default function GoogleMap({ place }: GoogleMapProps) {
  // Ref to the element for showing content in the map info window
  const contentRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState(true);
  const [loader, setLoader] = useState<Loader | undefined>();
  const [autocompleteService, setAutocompleteService] = useState<google.maps.places.AutocompleteService | undefined>();
  const [placesService, setPlacesService] = useState<google.maps.places.PlacesService | undefined>();
  const [map, setMap] = useState<google.maps.Map | undefined>();

  const [currentPlace, setCurrentPlace] = useState<VendorPlace | null | undefined>(place);

  const { displayWarning } = useNotifications();

  const loadEverything = async (mapDiv: HTMLElement) => {
    const init = async () => {
      const l = new Loader({
        apiKey: ConfigService.googlePlacesApiKey(),
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
      if (!mapDiv) {
        return;
      }

      const { AutocompleteService, PlacesService } = await loader.importLibrary('places');
      const { Map } = await loader.importLibrary('maps');
      const map = new Map(mapDiv, { center: { lat: 39.1019503402557, lng: -84.5016085506675 }, zoom: 15 });

      setAutocompleteService(new AutocompleteService());
      setPlacesService(new PlacesService(map));
      setMap(map);
    };

    if (!loader) {
      init();
    } else {
      initServices(loader);
    }
  };

  const measuredRef = useCallback(async (mapDiv: HTMLElement) => {
    if (mapDiv !== null) {
      await loadEverything(mapDiv);
    }
  }, []);

  const openContent = (place: VendorPlace) => {
    if (!place || !place.geometry?.location || !map) {
      return;
    }
    const infowindow = new google.maps.InfoWindow();
    const marker = new google.maps.Marker({
      map,
      position: place.geometry.location,
    });

    map?.panTo(place.geometry.location);

    /**
     * Opens the hidden content Box element
     */
    const openContent = () => {
      if (contentRef.current) {
        contentRef.current.style.display = 'block';
        infowindow.setContent(contentRef.current);
      }
      infowindow.open(map, marker);
    };

    openContent();

    google.maps.event.addListener(marker, 'click', openContent);
  };

  useEffect(() => {
    if (!place) {
      return;
    }
    openContent(place);
  }, [place, openContent]);

  /**
   * After selecting an item in the autocomplete list, this will search the Google PlacesService API for a place
   * @param prediction
   * @returns
   */
  const searchMap = async (prediction: AutocompletePrediction) => {
    const request: google.maps.places.PlaceDetailsRequest = {
      placeId: prediction.place_id,
      fields: GooglePlacesKeys.map((key) => key),
    };
    if (!placesService) {
      displayWarning('Google search not initialized, try refreshing the page');
      return;
    }
    placesService.getDetails(request, (place, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && place && place.geometry && place.geometry.location) {
        const infowindow = new google.maps.InfoWindow();
        const marker = new google.maps.Marker({
          map,
          position: place.geometry.location,
        });

        map?.panTo(place.geometry.location);

        /**
         * Opens the hidden content Box element
         */
        const openContent = () => {
          if (contentRef.current) {
            contentRef.current.style.display = 'block';
            infowindow.setContent(contentRef.current);
          }
          infowindow.open(map, marker);
        };

        openContent();

        google.maps.event.addListener(marker, 'click', openContent);
      }
    });
    return;
  };

  return (
    <>
      {loading && (
        <Box display="flex" justifyContent="center" p={8} width="100%">
          <CircularProgress />
        </Box>
      )}
      <Box display="flex" id="map" ref={measuredRef} width="100%" height={500} />

      {/* Hidden Box for the content info marker */}
      <Box ref={contentRef} style={{ display: 'none' }}>
        {currentPlace && <GoogleContentInfo place={currentPlace} />}
      </Box>
    </>
  );
}
