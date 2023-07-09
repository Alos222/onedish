import { createTheme } from '@mui/material';

declare module '@mui/material/styles' {
  interface Palette {
    appbar: Palette['primary'];
  }

  // allow configuration using `createTheme`
  interface PaletteOptions {
    appbar?: PaletteOptions['primary'];
  }
}
declare module '@mui/material/AppBar' {
  interface AppBarPropsColorOverrides {
    appbar: true;
  }
}

// TODO Move to config folder
export const THEME = createTheme({
  palette: {
    primary: { main: '#b60f0f' },
    secondary: { main: '#0fb6b6' },
    appbar: {
      main: '#fff',
    },
  },
  typography: {
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      'Oxygen',
      'Ubuntu',
      'Cantarell',
      'Droid Sans',
      'Cantarell',
      '"Helvetica Neue"',
      'sans-serif',
    ].join(','),
  },
});
