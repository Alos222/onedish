import { ConfigService } from 'src/server/services/config.service';
import VendorPage from './VendorPage';

import { Metadata } from 'next';
export const metadata: Metadata = {
  title: `${ConfigService.appName()} | Vendors`,
};

export default async function App() {
  return <VendorPage />;
}
