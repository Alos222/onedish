import { Metadata } from 'next';
import { ConfigService } from 'src/server/services/config.service';
import VendorDetailsPage from './VendorDetailsPage';
import { VendorService } from 'src/server/services/vendor.service';
import { VendorDetailsRouteName } from 'app/route-names';

export const metadata: Metadata = {
  title: `${ConfigService.appName()} | ${VendorDetailsRouteName}`,
};

export default async function App({ params: { vendorId } }: { params: { vendorId: string } }) {
  const vendor = await new VendorService().getVendor(vendorId);

  if (!vendor) {
    // TODO Fix this
    return <div>Could not find vendor</div>;
  }

  return <VendorDetailsPage vendor={vendor} />;
}
