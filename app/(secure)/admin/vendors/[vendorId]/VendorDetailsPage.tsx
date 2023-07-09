'use client';

import { Vendor } from '@prisma/client';
import VendorDetails from 'src/client/admin/vendors/components/VendorDetails';
import PageContainer from 'src/client/common/components/PageContainer';

interface VendorDetailsPageProps {
  vendor: Vendor;
}

// This is a Client Component. It receives data as props and
// has access to state and effects just like Page components
// in the `pages` directory.
export default async function VendorDetailsPage({ vendor }: VendorDetailsPageProps) {
  return (
    <PageContainer title="Vendor Details" subtitle="Manage details for a vendor">
      <VendorDetails vendor={vendor} />
    </PageContainer>
  );
}
