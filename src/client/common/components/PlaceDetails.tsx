import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import MapIcon from '@mui/icons-material/Map';
import PinDropIcon from '@mui/icons-material/PinDrop';
import PublicIcon from '@mui/icons-material/Public';
import StarIcon from '@mui/icons-material/Star';
import { Box, List, ListItem, ListItemIcon,ListItemText, Typography } from '@mui/material';
import { green, yellow } from '@mui/material/colors';
import { Vendor, VendorPlace } from '@prisma/client';
import Image from 'next/image';

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
export default function PlaceDetails({ vendor, place }: PlaceDetailsProps) {
  const { name: vendorName, address: vendorAddress } = vendor || {};

  const { name: placeName, formattedAddress: placeAddress, icon, priceLevel, rating, url, website } = place || {};

  // Prefer the vendor defined name and address, if available
  const name = vendorName || placeName;
  const address = vendorAddress || placeAddress;

  const iconSize = 20;
  const image = icon ? <Image src={icon} width={iconSize} height={iconSize} alt="Vendor icon" /> : null;

  let dollars = [];
  const price: number = priceLevel || 0;
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
