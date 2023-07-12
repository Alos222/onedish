'use client';

import { Vendor } from '@prisma/client';
import { useState } from 'react';
import VendorDetails from 'src/client/admin/vendors/components/VendorDetails';
import PageContainer from 'src/client/common/components/PageContainer';

interface VendorDetailsPageProps {
  vendor: Vendor;
}

// This is a Client Component. It receives data as props and
// has access to state and effects just like Page components
// in the `pages` directory.
export default function VendorDetailsPage({ vendor: v }: VendorDetailsPageProps) {
  const [vendor, setVendor] = useState(v);

  return (
    <PageContainer title="Vendor Details" subtitle={`Manage details for the ${vendor.name} vendor`}>
      <VendorDetails vendor={vendor} onVendorUpdated={setVendor} />
    </PageContainer>
  );
}
