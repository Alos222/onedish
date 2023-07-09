import HomeIcon from '@mui/icons-material/Home';
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
];

export default routes;