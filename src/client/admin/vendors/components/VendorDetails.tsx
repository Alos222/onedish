import { Box } from '@mui/material';
import { Vendor } from '@prisma/client';
import ReadonlyText from 'src/client/common/components/ReadonlyText';
import GoogleMap from '../../../common/components/GoogleMap';

interface VendorDetailsProps {
  vendor: Vendor;
}

export default function VendorDetails({ vendor }: VendorDetailsProps) {
  return (
    <Box>
      <ReadonlyText title="Name" value={vendor.name} />
      <ReadonlyText title="Address" value={vendor.address} />
      <GoogleMap place={vendor.place} />
    </Box>
  );
}