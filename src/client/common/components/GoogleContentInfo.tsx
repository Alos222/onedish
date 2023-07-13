import { Box, ImageList, ImageListItem } from '@mui/material';
import { VendorPlace } from '@prisma/client';
import Image from 'next/image';

import PlaceDetails from './PlaceDetails';

interface GoogleContentInfoProps {
  place: VendorPlace;

  ContentInfoActions?: (currentPlace: VendorPlace) => React.ReactNode;
}

export default function GoogleContentInfo({ place, ContentInfoActions }: GoogleContentInfoProps) {
  const { name, photos } = place;

  const contentInfoSize = 400;

  return (
    <Box display="flex" flexDirection="column" width={contentInfoSize}>
      <PlaceDetails place={place} />
      {ContentInfoActions && ContentInfoActions(place)}
      {photos.length && (
        <ImageList sx={{ width: contentInfoSize - 20, height: 450 }} cols={4} rowHeight={80}>
          {photos.map((photo) => (
            <ImageListItem key={photo.url}>
              <Image
                src={`${photo.url}?w=164&h=164&fit=crop&auto=format`}
                alt={`Photo of ${name}`}
                loading="lazy"
                width={80}
                height={80}
              />
            </ImageListItem>
          ))}
        </ImageList>
      )}
    </Box>
  );
}
