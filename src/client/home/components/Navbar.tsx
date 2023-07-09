import MenuIcon from '@mui/icons-material/Menu';
import { Icon, useTheme } from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import UserMenu from 'src/client/home/components/UserMenu';

interface NavbarProps {
  /**
   * If true, then this component will render the `UserMenu`.
   *
   * This should only be true if this component is wrapped in a `SecureLayout` and provided with the oAuth user data.
   */
  isSecure?: boolean;
}

function Navbar({ isSecure }: NavbarProps) {
  const theme = useTheme();
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="appbar">
        <Toolbar>
          <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" color="primary" sx={{ flexGrow: 1 }}>
            <Link
              href="/"
              style={{
                textDecoration: 'none',
                color: theme.palette.primary.main,
              }}
            >
              {/* <img src="" width={100} style={{ margin: 'auto 5px auto' }} /> */}
              <Typography variant="h5" display="flex" alignItems="center">
                <RestaurantIcon sx={{ mr: 2 }} /> OneDish
              </Typography>
            </Link>
          </Typography>

          {isSecure && <UserMenu />}
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Navbar;
