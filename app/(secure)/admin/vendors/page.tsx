import { Metadata } from 'next';
import { ConfigService } from 'src/server/services/config.service';
import VendorPage from './VendorPage';
import { VendorsRouteName } from 'app/route-names';

export const metadata: Metadata = {
  title: `${ConfigService.appName()} | ${VendorsRouteName}`,
};

export default async function App() {
  return <VendorPage />;
}
