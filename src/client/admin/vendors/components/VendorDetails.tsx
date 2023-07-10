import React, { useState } from 'react';
import { Card, CardContent, CardMedia, Grid, Typography } from '@mui/material';
import { Vendor } from '@prisma/client';
import GoogleMap from '../../../common/components/GoogleMap';
import PlaceDetails from 'src/client/common/components/PlaceDetails';
import ManageVendorDialog from './ManageVendorDialog';

interface VendorDetailsProps {
  vendor: Vendor;
}

export default function VendorDetails({ vendor: v }: VendorDetailsProps) {
  const [vendor, setVendor] = useState(v);
  const { name, address, image, oneDish, place } = vendor;

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={4}>
        <Card sx={{ maxWidth: 450 }}>
          {oneDish && <CardMedia sx={{ height: 200 }} image={oneDish.url} title="Vendor OneDish" />}
          <CardContent>
            {!place && (
              <>
                <Typography gutterBottom variant="h5" component="div" color="primary">
                  {name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {address}
                </Typography>
              </>
            )}
            {place && <PlaceDetails place={place} />}
            <ManageVendorDialog vendor={vendor} onVendor={(vendor) => setVendor(vendor)} />
          </CardContent>
          {image && <CardMedia sx={{ height: 200 }} image={image.url} title="Vendor image" />}
        </Card>
      </Grid>
      <Grid item xs={12} sm={8}>
        <GoogleMap place={place} />
        <Typography variant="subtitle2" color="secondary">
          Details on map may differ than those saved for a vendor
        </Typography>
      </Grid>
    </Grid>
  );
}
