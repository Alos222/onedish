import React, { useState } from 'react';
import { Grid, Typography } from '@mui/material';
import { Vendor } from '@prisma/client';
import ReadonlyText from 'src/client/common/components/ReadonlyText';
import GoogleMap from '../../../common/components/GoogleMap';
import ManageVendorDialog from './ManageVendorDialog';

interface VendorDetailsProps {
  vendor: Vendor;
}

export default function VendorDetails({ vendor: v }: VendorDetailsProps) {
  const [vendor, setVendor] = useState(v);

  return (
    <Grid container>
      <Grid item xs={12} sm={4}>
        <ReadonlyText title="Name" value={vendor.name} />
        <ReadonlyText title="Address" value={vendor.address} />
        <ManageVendorDialog vendor={vendor} onVendor={(vendor) => setVendor(vendor)} />
      </Grid>
      <Grid item xs={12} sm={8}>
        <GoogleMap place={vendor.place} />
        <Typography variant="subtitle2" color="secondary">
          Details on map may differ than those saved for a vendor
        </Typography>
      </Grid>
    </Grid>
  );
}
