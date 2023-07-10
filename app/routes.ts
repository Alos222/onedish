import HomeIcon from '@mui/icons-material/Home';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import StoreIcon from '@mui/icons-material/Store';
import StorefrontIcon from '@mui/icons-material/Storefront';
import { SvgIconTypeMap } from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';

export type SvgIconComponent = OverridableComponent<SvgIconTypeMap>;

interface Route {
  name: string;
  href: string;
  icon?: SvgIconComponent;
  regex?: boolean;
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
    icon: AdminPanelSettingsIcon,
  },
  {
    name: 'Vendors',
    href: '/admin/vendors',
    icon: StoreIcon,
  },
  {
    name: 'Vendor Details',
    href: '/admin/vendors/[a-zA-Z0-9]+',
    regex: true,
    icon: StorefrontIcon,
  },
];

export default routes;
