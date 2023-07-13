import HomeIcon from '@mui/icons-material/Home';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import StoreIcon from '@mui/icons-material/Store';
import StorefrontIcon from '@mui/icons-material/Storefront';
import { SvgIconTypeMap } from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import {
  AdminRouteName,
  HomeRouteName,
  RestaurantRouteName,
  VendorDetailsRouteName,
  VendorsRouteName,
} from './route-names';

export type SvgIconComponent = OverridableComponent<SvgIconTypeMap>;

export interface OneDishRoute {
  name: string;
  description?: string;
  href: string;
  regex?: boolean;
  children?: OneDishRoute[];
  icon?: SvgIconComponent;
}

export const HomeRoute: OneDishRoute = {
  name: HomeRouteName,
  href: '/',
  icon: HomeIcon,
};

export const RestaurantRoute: OneDishRoute = {
  name: RestaurantRouteName,
  href: '/restaurant/[a-zA-Z0-9]+',
  regex: true,
  icon: StorefrontIcon,
};

export const AdminRoute: OneDishRoute = {
  name: AdminRouteName,
  description: 'Manage adminstrator tasks',
  href: '/admin',
  icon: AdminPanelSettingsIcon,
};

export const VendorsRoute: OneDishRoute = {
  name: VendorsRouteName,
  description: 'Manage all of your vendors',
  href: '/admin/vendors',
  icon: StoreIcon,
};

export const VendorDetailsRoute: OneDishRoute = {
  name: VendorDetailsRouteName,
  href: '/admin/vendors/[a-zA-Z0-9]+',
  regex: true,
  icon: StorefrontIcon,
};

const routes: OneDishRoute[] = [HomeRoute, RestaurantRoute, AdminRoute, VendorsRoute, VendorDetailsRoute];

export default routes;
