import React from 'react';
import { Card, CardContent, CardMedia, Grid, Paper, Typography } from '@mui/material';
import { Vendor } from '@prisma/client';
import GoogleMap from '../../../common/components/GoogleMap';
import PlaceDetails from 'src/client/common/components/PlaceDetails';
import ManageVendorDialog from './ManageVendorDialog';
import OneDishCard from 'src/client/common/components/OneDishCard';

interface VendorDetailsProps {
  vendor: Vendor;
  onVendorUpdated: (vendor: Vendor) => void;
}

export default function VendorDetails({ vendor, onVendorUpdated }: VendorDetailsProps) {
  const { vendorImage, place, oneDishes } = vendor;

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={4}>
        <Card sx={{ maxWidth: 450 }}>
          {/* {oneDish && <CardMedia sx={{ height: 200 }} image={oneDish.url} title="Vendor OneDish" />} */}
          <CardContent>
            <PlaceDetails vendor={vendor} />
            <ManageVendorDialog vendor={vendor} onVendor={(vendor) => onVendorUpdated(vendor)} />
          </CardContent>
          {vendorImage && <CardMedia sx={{ height: 200 }} image={vendorImage.url} title="Vendor image" />}
        </Card>
      </Grid>
      <Grid item xs={12} sm={8}>
        <GoogleMap place={place} />
        <Typography variant="subtitle2" color="secondary">
          Details on map may differ than those saved for a vendor
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
          <Typography gutterBottom variant="h5" component="div" color="primary">
            OneDish
          </Typography>

          <Grid container mt={2} spacing={2}>
            {oneDishes.map((oneDish) => (
              <Grid item xs={12} sm={6} md={4} key={oneDish.id}>
                <OneDishCard
                  key={oneDish.id}
                  url={oneDish.url}
                  title={oneDish.title}
                  description={oneDish.description}
                />
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
}
