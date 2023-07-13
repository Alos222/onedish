import { Card, CardActions, CardContent, Checkbox, FormControlLabel, Typography } from '@mui/material';

import { VendorTier } from 'src/types';

interface OneDishCardProps {
  tier: VendorTier;
  tierDescription: string;
  selectedTier?: VendorTier | null;

  onTierSelected: (tier: VendorTier | null) => void;
}

export default function OneDishTier({ tier, tierDescription, selectedTier, onTierSelected }: OneDishCardProps) {
  return (
    <Card sx={{ maxWidth: 350, mb: 2 }}>
      <CardContent>
        <Typography gutterBottom variant="h6" component="div" color="primary">
          {tier.toLocaleUpperCase()}
        </Typography>

        <Typography gutterBottom variant="body1" component="div" color="primary">
          {tierDescription}
        </Typography>
      </CardContent>
      <CardActions>
        <FormControlLabel
          control={
            <Checkbox
              checked={selectedTier === tier}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                let newTier: VendorTier | null;
                if (selectedTier === tier) {
                  newTier = null;
                } else {
                  newTier = tier;
                }
                onTierSelected(newTier);
              }}
            />
          }
          label="Select this tier"
        />
      </CardActions>
    </Card>
  );
}
