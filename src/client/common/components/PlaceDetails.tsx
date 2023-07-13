import Image from 'next/image';
import { Typography, Box, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import PublicIcon from '@mui/icons-material/Public';
import PinDropIcon from '@mui/icons-material/PinDrop';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import StarIcon from '@mui/icons-material/Star';
import MapIcon from '@mui/icons-material/Map';
import { Vendor, VendorPlace } from '@prisma/client';
import { green, yellow } from '@mui/material/colors';
import LinkInNewWindow from './LinkInNewWindow';

interface PlaceDetailsProps {
  vendor?: Vendor;
  place?: VendorPlace | null;
}

/**
 * Displays details for a place.
 *
 * Can provide either a vendor, or a place.
 * @param param0
 * @returns
 */
export default function PlaceDetails({ vendor, place: p }: PlaceDetailsProps) {
  const { name: vendorName, address: vendorAddress, place: vendorPlace } = vendor || {};

  const place = vendorPlace || p;
  const { name: placeName, formatted_address: placeAddress, icon, price_level, rating, url, website } = place || {};

  // Prefer the vendor defined name and address, if available
  const name = vendorName || placeName;
  const address = vendorAddress || placeAddress;

  const iconSize = 20;
  const image = icon ? <Image src={icon} width={iconSize} height={iconSize} alt="Vendor icon" /> : null;

  let dollars = [];
  const price: number = price_level || 0;
  for (let i = 0; i < price; i++) {
    dollars.push(<AttachMoneyIcon key={i} fontSize="small" sx={{ color: green[300], mr: -1 }} />);
  }
  return (
    <>
      <Box display="flex" flexWrap="wrap" alignItems="center" justifyContent="space-between" mr={2}>
        <Typography variant="h5" color="primary" display="flex" alignItems="center">
          <Box mr={1}>{image}</Box>
          {name}
        </Typography>
        <Box display="flex" alignItems="center">
          {rating}/5 <StarIcon fontSize="small" sx={{ color: yellow[700] }} /> &#8226; {dollars}
        </Box>
      </Box>
      <List dense>
        <ListItem>
          <ListItemIcon>
            <PinDropIcon />
          </ListItemIcon>
          <ListItemText primary={address} />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <PublicIcon />
          </ListItemIcon>
          <ListItemText primary={website ? <LinkInNewWindow href={website} text={website} /> : 'Link not available'} />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <MapIcon />
          </ListItemIcon>
          <ListItemText
            primary={url ? <LinkInNewWindow href={url} text="View on Google Maps" /> : 'Link not available'}
          />
        </ListItem>
      </List>
    </>
  );
}
