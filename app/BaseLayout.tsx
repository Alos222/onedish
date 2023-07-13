'use client';

import { ThemeProvider, Box } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { THEME } from 'app/theme';
import { SnackbarProvider } from 'notistack';

interface BaseLayoutProps {
  children: React.ReactNode;
}

/**
 * The base layout for all pages in the app
 * @param param0
 * @returns
 */
export default function BaseLayout({ children }: BaseLayoutProps) {
  return (
    <SnackbarProvider maxSnack={3}>
      <ThemeProvider theme={THEME}>
        <Box sx={{ flexGrow: 1 }}>
          <CssBaseline />
          {children}
        </Box>
      </ThemeProvider>
    </SnackbarProvider>
  );
}
