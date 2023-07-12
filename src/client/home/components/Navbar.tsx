import Link from 'next/link';
import MenuIcon from '@mui/icons-material/Menu';
import { Icon, useTheme } from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import UserMenu from 'src/client/home/components/UserMenu';
import { User } from 'next-auth';

interface NavbarProps {
  user?: User;
}

export default function Navbar({ user }: NavbarProps) {
  const theme = useTheme();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="appbar">
        <Toolbar>
          <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" color="primary" sx={{ flexGrow: 1, display: 'flex' }}>
            <Link
              href="/"
              style={{
                textDecoration: 'none',
                color: theme.palette.primary.main,
              }}
            >
              <Typography variant="h5" display="flex" alignItems="center">
                <RestaurantIcon sx={{ mr: 2 }} /> OneDish
              </Typography>
            </Link>
          </Typography>

          {user && <UserMenu user={user} />}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
