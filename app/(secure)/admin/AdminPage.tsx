'use client';

import { AdminRoute } from 'app/routes';
import AdminConsole from 'src/client/admin/components/AdminConsole';
import PageContainer from 'src/client/common/components/PageContainer';

interface AdminPageProps {}

// This is a Client Component. It receives data as props and
// has access to state and effects just like Page components
// in the `pages` directory.
export default function AdminPage({}: AdminPageProps) {
  return (
    <PageContainer route={AdminRoute}>
      <AdminConsole />
    </PageContainer>
  );
}
