'use client';

import { VendorsRoute } from 'app/routes';
import VendorsTable from 'src/client/admin/vendors/components/VendorsTable';
import PageContainer from 'src/client/common/components/PageContainer';

interface VendorPageProps {}

// This is a Client Component. It receives data as props and
// has access to state and effects just like Page components
// in the `pages` directory.
export default function VendorPage({}: VendorPageProps) {
  return (
    <PageContainer route={VendorsRoute}>
      <VendorsTable />
    </PageContainer>
  );
}
