import Image from 'next/image';
import { Typography, Box, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import PublicIcon from '@mui/icons-material/Public';
import PinDropIcon from '@mui/icons-material/PinDrop';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import MapIcon from '@mui/icons-material/Map';
import { VendorPlace } from '@prisma/client';
import Link from 'next/link';
import { green } from '@mui/material/colors';

interface GoogleContentInfoProps {
  place: VendorPlace;

  ContentInfoActions?: (currentPlace: VendorPlace) => React.ReactNode;
}

export default function GoogleContentInfo({ place, ContentInfoActions }: GoogleContentInfoProps) {
  const { name, formatted_address: address, icon, price_level, rating, url, website } = place;

  const contentInfoSize = 350;
  const iconSize = 20;
  const image = icon ? <Image src={icon} width={iconSize} height={iconSize} alt="Vendor icon" /> : null;

  let dollars = [];
  const price: number = price_level || 0;
  for (let i = 0; i < price; i++) {
    dollars.push(<AttachMoneyIcon key={i} fontSize="small" sx={{ color: green[300], mr: -1 }} />);
  }

  return (
    <Box display="flex" flexDirection="column" width={contentInfoSize}>
      <Typography variant="h6" color="primary" display="flex" alignItems="center">
        <Box mr={1}>{image}</Box>
        {name}
      </Typography>
      <Box display="flex" alignItems="center">
        {rating} &#8226; {dollars}
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
          <ListItemText primary={website ? <Link href={website}>{website}</Link> : 'Link not available'} />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <MapIcon />
          </ListItemIcon>
          <ListItemText primary={url ? <Link href={url}>View on Google Maps</Link> : 'Link not available'} />
        </ListItem>
      </List>
      {ContentInfoActions && ContentInfoActions(place)}
    </Box>
  );
}
