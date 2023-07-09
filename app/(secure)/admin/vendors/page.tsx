import { VendorService } from 'src/server/services/vendor.service';
import VendorPage from './VendorPage';

export default async function App() {
  const vendorService = new VendorService();
  const vendors = await vendorService.getAllVendors();
  return <VendorPage vendors={vendors} />;
}
