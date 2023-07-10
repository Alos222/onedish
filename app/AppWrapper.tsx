'use client';

import { Box, Divider, Paper } from '@mui/material';
import AppBreadcrumbs from 'app/AppBreadcrumbs';

interface AppWrapperProps {
  children: React.ReactNode;
}

/**
 * Wrapper component to be used in layouts
 * @param param0
 * @returns
 */
export default function AppWrapper({ children }: AppWrapperProps) {
  return (
    <Box m={2}>
      <Paper sx={{ p: 2 }} elevation={3}>
        <AppBreadcrumbs />
        <Divider sx={{ my: 2 }} />
        {children}
      </Paper>
    </Box>
  );
}
