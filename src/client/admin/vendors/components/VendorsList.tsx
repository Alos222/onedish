import React from 'react';
import { Box } from '@mui/material';
import type { Vendor } from '@prisma/client';

interface VendorsListProps {
  vendors: Vendor[];
}

export default function VendorList({ vendors }: VendorsListProps) {
  return vendors.map((vendor) => <Box>{vendor.name}</Box>);
}
