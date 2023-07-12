import { Metadata } from 'next';
import { ConfigService } from 'src/server/services/config.service';
import HomePage from 'app/(secure)/HomePage';
import { VendorService } from 'src/server/services/vendor.service';

export const metadata: Metadata = {
  title: `${ConfigService.appName()}`,
};
export default async function App() {
  const vendors = await new VendorService().getAllOneDishVendors();

  return <HomePage vendors={vendors} />;
}
