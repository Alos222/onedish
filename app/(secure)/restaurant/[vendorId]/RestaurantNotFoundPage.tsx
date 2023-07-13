'use client';

import { Box, Button, Typography } from '@mui/material';
import { Vendor } from '@prisma/client';
import Link from 'next/link';
import VendorDetails from 'src/client/admin/vendors/components/VendorDetails';

interface RestaurantNotFoundPageProps {}

// This is a Client Component. It receives data as props and
// has access to state and effects just like Page components
// in the `pages` directory.
export default function RestaurantNotFoundPage({}: RestaurantNotFoundPageProps) {
  return (
    <Box height={300} display="flex" justifyContent="center" pl={2} flexDirection="column">
      <Typography variant="h4" color="primary" mb={2}>
        Sorry, we couldn't find that restaurant
      </Typography>
      <Box>
        <Button LinkComponent={Link} href="/">
          Go back home
        </Button>
      </Box>
    </Box>
  );
}
