'use client';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box, Button, Typography } from '@mui/material';
import Link from 'next/link';

interface RestaurantNotFoundPageProps {}

// This is a Client Component. It receives data as props and
// has access to state and effects just like Page components
// in the `pages` directory.
export default function RestaurantNotFoundPage({}: RestaurantNotFoundPageProps) {
  return (
    <Box height={300} display="flex" justifyContent="center" pl={2} flexDirection="column">
      <Typography variant="h4" color="primary" mb={2}>
        Sorry, we couldn&apos;t find that restaurant
      </Typography>
      <Box>
        <Button LinkComponent={Link} href="/" startIcon={<ArrowBackIcon />}>
          Go back home
        </Button>
      </Box>
    </Box>
  );
}
