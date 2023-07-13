import { Button, Grid } from '@mui/material';
import { Vendor } from '@prisma/client';
import Link from 'next/link';
import OneDishCard from 'src/client/common/components/OneDishCard';

interface OneDishGridProps {
  vendors: Vendor[];
}

export default function OneDishGrid({ vendors }: OneDishGridProps) {
  return (
    <Grid container spacing={2}>
      {vendors.map((vendor) => {
        const { oneDishes } = vendor;
        const oneDish = oneDishes[0];
        return (
          <Grid item xs={12} sm={6} md={4} display="flex" height="auto" key={oneDish.id}>
            <OneDishCard
              oneDish={oneDish}
              vendor={vendor}
              actions={
                <Button LinkComponent={Link} href={`/restaurant/${vendor.id}`}>
                  More Details
                </Button>
              }
            />
          </Grid>
        );
      })}
    </Grid>
  );
}
