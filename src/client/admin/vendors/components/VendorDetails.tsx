import React from 'react';
import { Card, CardContent, CardMedia, Grid, Paper, Typography } from '@mui/material';
import { Vendor } from '@prisma/client';
import GoogleMap from '../../../common/components/GoogleMap';
import PlaceDetails from 'src/client/common/components/PlaceDetails';
import ManageVendorDialog from './ManageVendorDialog';
import OneDishCard from 'src/client/common/components/OneDishCard';

interface VendorDetailsProps {
  vendor: Vendor;
  onVendorUpdated?: (vendor: Vendor) => void;
}

export default function VendorDetails({ vendor, onVendorUpdated }: VendorDetailsProps) {
  const { vendorImage, place, oneDishes } = vendor;

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={4}>
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <PlaceDetails vendor={vendor} place={vendor.place} />
            {onVendorUpdated && (
              <ManageVendorDialog
                vendor={vendor}
                onVendor={(vendor) => {
                  onVendorUpdated(vendor);
                }}
              />
            )}
          </CardContent>
          {vendorImage && <CardMedia sx={{ height: 200 }} image={vendorImage} title="Vendor image" />}
        </Card>
        <GoogleMap placeId={place?.placeId} />
        <Typography variant="subtitle2" color="secondary">
          Details on map may differ than those saved for a restaurant
        </Typography>
      </Grid>
      <Grid item xs={12} sm={8}>
        <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
          <Typography gutterBottom variant="h5" component="div" color="primary">
            OneDish
          </Typography>

          <Grid container mt={2} spacing={2} justifyContent="center">
            {oneDishes.map((oneDish) => (
              <Grid item md={12} lg={6} xl={4} key={oneDish.id} display="flex" justifyContent="center">
                <OneDishCard key={oneDish.id} oneDish={oneDish} vendor={vendor} />
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
}
