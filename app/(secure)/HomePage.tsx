'use client';

import { Box } from '@mui/material';

interface HomePageProps {}

// This is a Client Component. It receives data as props and
// has access to state and effects just like Page components
// in the `pages` directory.
export default function HomePage({}: HomePageProps) {
  return <Box>Hello OneDish</Box>;
}
