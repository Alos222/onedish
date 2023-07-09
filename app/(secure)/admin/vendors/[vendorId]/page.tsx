import { ConfigService } from 'src/server/services/config.service';

import { Metadata } from 'next';
import VendorDetailsPage from './VendorDetailsPage';
import { VendorService } from 'src/server/services/vendor.service';
import getGoogleLibraries from 'src/client/common/google/google-libraries';
import GoogleLibrariesProvider from 'src/client/common/components/GoogleLibrariesProvider';
export const metadata: Metadata = {
  title: `${ConfigService.appName()} | Vendor Details`,
};

export default async function App({ params: { vendorId } }: { params: { vendorId: string } }) {
  const vendor = await new VendorService().getVendor(vendorId);

  console.log(vendor);
  if (!vendor) {
    // TODO Fix this
    return <div>Could not find vendor</div>;
  }

  return <VendorDetailsPage vendor={vendor} />;
}
