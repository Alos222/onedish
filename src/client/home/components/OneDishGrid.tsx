import { useState } from 'react';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Box, Button, CircularProgress, FormControl, Grid, Input, InputLabel, Typography } from '@mui/material';
import { Vendor } from '@prisma/client';
import Link from 'next/link';
import { useDebouncedCallback } from 'use-debounce';

import OneDishCard from 'src/client/common/components/OneDishCard';
import { useApiRequest } from 'src/client/common/hooks/useApiRequest';
import { useNotifications } from 'src/client/common/hooks/useNotifications';

interface OneDishGridProps {
  vendors: Vendor[];
}

export default function OneDishGrid({ vendors: v }: OneDishGridProps) {
  const [vendors, setVendors] = useState(v);
  const { get, loading } = useApiRequest(`vendors`);
  const { displayError } = useNotifications();

  const debounced = useDebouncedCallback(async (value) => {
    if (!value) {
      // Reset back to the original value from the props
      setVendors(v);
      return;
    }
    const response = await get<Vendor[]>(`?search=${value}`);
    if (response.error) {
      displayError(response.error);
      return;
    }
    setVendors(response.data || []);
  }, 1000);

  return (
    <Box>
      <FormControl sx={{ mb: 3, width: '100%' }} variant="standard">
        <InputLabel htmlFor="onedish-search">What do you want to eat?</InputLabel>
        <Input
          id="onedish-search"
          placeholder="Search for some food"
          defaultValue={''}
          onChange={(e) => debounced(e.target.value)}
          endAdornment={loading && <CircularProgress size={25} />}
        />
      </FormControl>
      <Grid container spacing={3} display="flex" justifyContent="space-between" flexDirection="row">
        {vendors.map((vendor) => {
          const { oneDishes } = vendor;
          const oneDish = oneDishes[0];
          return (
            <Grid item xs={12} sm={6} md={4} display="flex" height="auto" key={oneDish.id}>
              <OneDishCard
                oneDish={oneDish}
                vendor={vendor}
                actions={
                  <Button LinkComponent={Link} href={`/restaurant/${vendor.id}`} endIcon={<ArrowForwardIcon />}>
                    More Details
                  </Button>
                }
              />
            </Grid>
          );
        })}
        {!vendors.length && (
          <Grid item xs={12} display="flex" justifyContent="center">
            <Typography variant="body1" color="secondary" py={5}>
              Nothing here
            </Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
