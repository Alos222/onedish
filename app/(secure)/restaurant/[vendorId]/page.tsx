import { Metadata } from 'next';

import { ConfigService } from 'src/server/services/config.service';
import { VendorService } from 'src/server/services/vendor.service';

import RestaurantNotFoundPage from './RestaurantNotFoundPage';
import RestaurantPage from './RestaurantPage';

export const metadata: Metadata = {
  title: `${ConfigService.appName()}`,
};
export default async function App({ params }: { params: { vendorId: string } }) {
  const vendor = await new VendorService().getVendor(params.vendorId);

  if (!vendor) {
    return <RestaurantNotFoundPage />;
  }

  return <RestaurantPage vendor={vendor} />;
}
