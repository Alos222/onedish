'use client';

import { Box } from '@mui/material';
import { Vendor } from '@prisma/client';
import AddVendorDialog from 'src/client/admin/vendors/components/AddVendorDialog';
import VendorsTable from 'src/client/admin/vendors/components/VendorsTable';

interface VendorPageProps {}

// This is a Client Component. It receives data as props and
// has access to state and effects just like Page components
// in the `pages` directory.
export default function VendorPage({}: VendorPageProps) {
  return (
    <Box>
      <AddVendorDialog />
      <VendorsTable />
    </Box>
  );
}
