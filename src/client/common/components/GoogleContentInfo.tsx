import Image from 'next/image';
import {
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ImageList,
  ImageListItem,
  Paper,
} from '@mui/material';
import PublicIcon from '@mui/icons-material/Public';
import PinDropIcon from '@mui/icons-material/PinDrop';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import MapIcon from '@mui/icons-material/Map';
import { VendorPlace } from '@prisma/client';
import Link from 'next/link';
import { green } from '@mui/material/colors';
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
      {photos.length && (
        <ImageList sx={{ width: contentInfoSize - 20, height: 450 }}>
          {photos.map((photo) => (
            <ImageListItem key={photo.url}>
              <img
                src={`${photo.url}?w=164&h=164&fit=crop&auto=format`}
                srcSet={`${photo.url}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                alt={`Photo of ${name}`}
                loading="lazy"
              />
            </ImageListItem>
          ))}
        </ImageList>
      )}
      {ContentInfoActions && ContentInfoActions(place)}
    </Box>
  );
}
