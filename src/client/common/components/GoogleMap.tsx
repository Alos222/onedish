import { useCallback, useRef, useState } from 'react';
import { Box, Autocomplete, TextField, CircularProgress } from '@mui/material';
import { Loader } from '@googlemaps/js-api-loader';
import { VendorPlace } from '@prisma/client';
import { useDebouncedCallback } from 'use-debounce';
import { useNotifications } from 'src/client/common/hooks/useNotifications';
import { GooglePlacesKeys } from 'src/types';
import { ConfigService } from 'src/server/services/config.service';
import GoogleContentInfo from './GoogleContentInfo';

type AutocompletePrediction = google.maps.places.AutocompletePrediction;

const googlePlaceToVendorPlace = (googlePlace: google.maps.places.PlaceResult): VendorPlace => ({
  formattedAddress: googlePlace.formatted_address || null,
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
  placeId: googlePlace.place_id || null,
  priceLevel: googlePlace.price_level || null,
  rating: googlePlace.rating || null,
  url: googlePlace.url || null,
  website: googlePlace.website || null,
  htmlAttributions: googlePlace.html_attributions || [],
  photos:
    googlePlace.photos?.map((photo) => ({
      url: photo.getUrl(),
      height: photo.height,
      width: photo.width,
      htmlAttributions: photo.html_attributions,
    })) || [],
});

interface GoogleMapProps {
  /**
   * An initial place to start the map loaded at
   */
  placeId?: string | null;

  /**
   * True if the map should be searchable
   */
  searchable?: boolean;

  /**
   * Component to hold actions for the content info panel of a place on the map
   */
  ContentInfoActions?: (currentPlace: VendorPlace) => React.ReactNode;
}

/**
 * Component for setting up vendor details, with a map that an be searched
 * @returns
 */
export default function GoogleMap({ placeId, searchable, ContentInfoActions }: GoogleMapProps) {
  // Ref to the element for showing content in the map info window
  const contentRef = useRef<HTMLDivElement>(null);

  // The list of predicted places from Google Places search
  const [predictions, setPredictions] = useState<AutocompletePrediction[]>([]);
  const [selectedPrediction, setSelectedPrediction] = useState<AutocompletePrediction | null>();
  // Loading indicator for when we are searching Google Places
  const [loadingPlaces, setLoadingPlaces] = useState(false);

  // The value typed into the places search autocomplete field
  const [placeTextValue, setPlaceTextValue] = useState('');

  const [loading, setLoading] = useState(true);
  const [loader, setLoader] = useState<Loader | undefined>();
  const [autocompleteService, setAutocompleteService] = useState<google.maps.places.AutocompleteService | undefined>();
  const [placesService, setPlacesService] = useState<google.maps.places.PlacesService | undefined>();
  const [map, setMap] = useState<google.maps.Map | undefined>();

  const [infowindow, setInfowindow] = useState<google.maps.InfoWindow | undefined>();
  const [marker, setMarker] = useState<google.maps.Marker | undefined>();

  const [currentPlace, setCurrentPlace] = useState<VendorPlace | null | undefined>(null);

  const { displayWarning } = useNotifications();

  /**
   * Opens the hidden content Box element
   */
  const openContent = useCallback(
    (infoWindow: google.maps.InfoWindow, marker: google.maps.Marker) => {
      if (infoWindow) {
        if (contentRef.current) {
          contentRef.current.style.display = 'block';
          infoWindow.setContent(contentRef.current);
        }
        infoWindow.open(map, marker);
      }
    },
    [map],
  );

  const createMarker = useCallback(
    (place: VendorPlace, infoWindow: google.maps.InfoWindow, map: google.maps.Map) => {
      if (!place || !place.geometry?.location || !map) {
        return;
      }

      if (marker) {
        // Remove an existing marker
        marker.setMap(null);
      }

      // Create a new marker
      const newMarker = new google.maps.Marker({
        map,
        position: place.geometry.location,
      });
      setMarker(newMarker);

      map?.panTo(place.geometry.location);

      openContent(infoWindow, newMarker);

      google.maps.event.addListener(newMarker, 'click', () => openContent(infoWindow, newMarker));
    },
    [marker, openContent],
  );

  /**
   * Searches with the Google Places API after typing something in the autocomplete field
   */
  const searchPlaces = useDebouncedCallback(async (value) => {
    if (autocompleteService && value) {
      setLoadingPlaces(true);
      const { predictions: placePredictions } = await autocompleteService.getPlacePredictions({
        input: value,
      });
      setPredictions(placePredictions);
      setLoadingPlaces(false);
    }
  }, 1000);

  /**
   * After selecting an item in the autocomplete list, this will search the Google PlacesService API for a place
   * @param prediction
   * @returns
   */
  const searchMap = useCallback(
    async (
      placeId: string,
      placesService?: google.maps.places.PlacesService,
      infoWindow?: google.maps.InfoWindow,
      map?: google.maps.Map,
    ) => {
      const request: google.maps.places.PlaceDetailsRequest = {
        placeId: placeId,
        fields: GooglePlacesKeys.map((key) => key),
      };
      if (!placesService) {
        displayWarning('Google search not initialized, try refreshing the page');
        return;
      }
      placesService.getDetails(request, (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && place?.geometry?.location && infoWindow && map) {
          const vendorPlace = googlePlaceToVendorPlace(place);
          createMarker(vendorPlace, infoWindow, map);
          setCurrentPlace(vendorPlace);
        }
      });
      return;
    },
    [createMarker, displayWarning],
  );

  /**
   * Loads the Google APIs
   * @param mapDiv
   */
  const loadMap = useCallback(
    async (mapDiv: HTMLElement) => {
      const init = async () => {
        const l = new Loader({
          apiKey: ConfigService.googlePlacesApiKey(),
          version: 'weekly',
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
        const infoWindow = new google.maps.InfoWindow();

        const placesService = new PlacesService(map);
        setAutocompleteService(new AutocompleteService());
        setPlacesService(placesService);
        setMap(map);
        setInfowindow(infoWindow);
        if (placeId) {
          // Get an initial place
          searchMap(placeId, placesService, infoWindow, map);
        }
      };

      if (!loader) {
        init();
      } else if (!autocompleteService || !placesService || !map) {
        initServices(loader);
      }
    },
    [autocompleteService, loader, map, placeId, placesService, searchMap],
  );

  /**
   * Ref for the map that will load the map once it is rendered
   */
  const mapRef = useCallback(
    async (mapDiv: HTMLElement) => {
      if (mapDiv !== null) {
        await loadMap(mapDiv);
      }
    },
    [loadMap],
  );

  return (
    <>
      {searchable && (
        <Box display="flex" alignItems="center">
          <Autocomplete
            id="predictions-autocomplete"
            options={predictions}
            value={selectedPrediction || null}
            inputValue={placeTextValue}
            onChange={(event: any, newPrediction: AutocompletePrediction | null) => {
              setSelectedPrediction(newPrediction);
              if (newPrediction) {
                searchMap(newPrediction.place_id, placesService, infowindow, map);
              }
            }}
            onInputChange={async (event, newInputValue) => {
              setPlaceTextValue(newInputValue || '');
              searchPlaces(newInputValue);
            }}
            fullWidth
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search"
                placeholder="Search for a restaurant"
                margin="dense"
                variant="standard"
              />
            )}
            renderOption={(props, prediction) => {
              return (
                <li {...props} key={prediction.place_id}>
                  {prediction.description}
                </li>
              );
            }}
            getOptionLabel={(option) => option.description}
            isOptionEqualToValue={(option, value) => option.place_id === value.place_id}
            noOptionsText="No options found, try searching for something"
          />
          {loadingPlaces && <CircularProgress sx={{ ml: 2 }} />}
        </Box>
      )}

      {loading && (
        <Box display="flex" justifyContent="center" p={8} width="100%">
          <CircularProgress />
        </Box>
      )}
      <Box display="flex" id="map" ref={mapRef} width="100%" height={500} />

      {/* Hidden Box for the content info marker */}
      <Box ref={contentRef} style={{ display: 'none' }}>
        {currentPlace && <GoogleContentInfo place={currentPlace} ContentInfoActions={ContentInfoActions} />}
      </Box>
    </>
  );
}
