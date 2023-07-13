import { Metadata } from 'next';

import { VendorsRouteName } from 'app/route-names';
import { ConfigService } from 'src/server/services/config.service';

import VendorPage from './VendorPage';

export const metadata: Metadata = {
  title: `${ConfigService.appName()} | ${VendorsRouteName}`,
};

export default async function App() {
  return <VendorPage />;
}
