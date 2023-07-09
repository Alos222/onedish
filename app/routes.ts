import HomeIcon from '@mui/icons-material/Home';
import StoreIcon from '@mui/icons-material/Store';
import { SvgIconTypeMap } from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';

export type SvgIconComponent = OverridableComponent<SvgIconTypeMap>;

interface Route {
  name: string;
  href: string;
  icon?: SvgIconComponent;
  children?: Route[];
}

const routes: Route[] = [
  {
    name: 'Home',
    href: '/',
    icon: HomeIcon,
  },
  {
    name: 'Login Success',
    href: '/auth/login-success',
    icon: HomeIcon,
  },
  {
    name: 'Admin',
    href: '/admin',
    icon: HomeIcon,
  },
  {
    name: 'Vendors',
    href: '/admin/vendors',
    icon: StoreIcon,
  },
];

export default routes;
