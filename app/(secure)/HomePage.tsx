'use client';

import { Vendor } from '@prisma/client';
import OneDishGrid from 'src/client/home/components/OneDishGrid';

interface HomePageProps {
  vendors: Vendor[];
}

// This is a Client Component. It receives data as props and
// has access to state and effects just like Page components
// in the `pages` directory.
export default function HomePage({ vendors }: HomePageProps) {
  return <OneDishGrid vendors={vendors} />;
}
