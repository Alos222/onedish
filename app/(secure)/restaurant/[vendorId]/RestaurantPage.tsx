'use client';

import { Vendor } from '@prisma/client';
import VendorDetails from 'src/client/admin/vendors/components/VendorDetails';

interface RestaurantPageProps {
  vendor: Vendor;
}

// This is a Client Component. It receives data as props and
// has access to state and effects just like Page components
// in the `pages` directory.
export default function RestaurantPage({ vendor }: RestaurantPageProps) {
  return <VendorDetails vendor={vendor} />;
}
