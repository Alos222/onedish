import { useRef, useState } from 'react';
import { Box, Autocomplete, TextField, CircularProgress, Typography, Button, Divider } from '@mui/material';
import type { VendorPlace } from '@prisma/client';
import { useDebouncedCallback } from 'use-debounce';
import usePlacesServices from '../hooks/usePlacesServices';
import { useNotifications } from 'src/client/common/hooks/useNotifications';
import { GooglePlacesKeys } from 'src/types';

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

interface VendorMapProps {
  onVendorSelected: (place: VendorPlace) => void;
}

/**
 * Component for setting up vendor details, with a map that an be searched
 * @returns
 */
export default function VendorMap({ onVendorSelected }: VendorMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [autocompleteService, placesService, map, loading] = usePlacesServices(mapRef);

  // The list of predicted places from Google Places search
  const [predictions, setPredictions] = useState<AutocompletePrediction[]>([]);
  const [selectedPrediction, setSelectedPrediction] = useState<AutocompletePrediction | null>();
  // Loading indicator for when we are searching Google Places
  const [loadingPlaces, setLoadingPlaces] = useState(false);

  // The value typed into the places search autocomplete field
  const [placeTextValue, setPlaceTextValue] = useState('');

  // The current place searched after selecting a value from the autocomplete
  const [currentPlace, setCurrentPlace] = useState<VendorPlace | null>(null);

  // Ref to the element for showing content in the map info window
  const contentRef = useRef<HTMLDivElement>(null);

  const { displayWarning } = useNotifications();

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

        setCurrentPlace(googlePlaceToVendorPlace(place));

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

  /**
   * After choosing a place on the map, this will auto fill in the place detail text fields
   * @param place
   */
  const onSelectVendor = (place: VendorPlace) => {
    onVendorSelected(place);
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <>
      <Box display="flex" alignItems="center">
        <Autocomplete
          id="predictions-autocomplete"
          options={predictions}
          value={selectedPrediction || null}
          inputValue={placeTextValue}
          onChange={(event: any, newPrediction: AutocompletePrediction | null) => {
            setSelectedPrediction(newPrediction);
            if (newPrediction) {
              searchMap(newPrediction);
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
      <Box display="flex" id="map" ref={mapRef} width="100%" height={500} />

      {/* Hidden Box for the content info marker */}
      <Box ref={contentRef} width={300} style={{ display: 'none' }}>
        {currentPlace && (
          <>
            <Typography variant="h6" color="secondary">
              {currentPlace.name}
            </Typography>
            <Typography variant="body1" pt={1}>
              {currentPlace.formatted_address}
            </Typography>
            <Button
              variant="outlined"
              sx={{ mt: 1 }}
              onClick={() => {
                if (currentPlace) {
                  onSelectVendor(currentPlace);
                }
              }}
            >
              Choose
            </Button>
          </>
        )}
      </Box>
    </>
  );
}
