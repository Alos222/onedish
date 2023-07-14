import { Metadata } from 'next';

import HomePage from 'app/(secure)/HomePage';
import { ConfigService } from 'src/server/services/config.service';
import { VendorService } from 'src/server/services/vendor.service';

export const metadata: Metadata = {
  title: `${ConfigService.appName()}`,
};

export const revalidate = 10;

export default async function App() {
  const vendors = await new VendorService().getAllOneDishVendors();

  return <HomePage vendors={vendors} />;
}
