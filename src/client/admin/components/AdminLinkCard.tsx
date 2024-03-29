import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Button, Card, CardContent, Typography } from '@mui/material';
import Link from 'next/link';

import { OneDishRoute } from 'app/routes';

interface AdminLinkCardProps {
  route: OneDishRoute;
}

export default function AdminLinkCard({ route }: AdminLinkCardProps) {
  return (
    <Card sx={{ maxWidth: 300 }}>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div" color="primary" display="flex" alignItems="center">
          {route.icon && <route.icon sx={{ mr: 2 }} />}
          {route.name}
        </Typography>
        <Typography gutterBottom variant="body1" component="div" color="secondary">
          {route.description}
        </Typography>

        <Button LinkComponent={Link} href={route.href} variant="outlined" endIcon={<ArrowForwardIcon />}>
          Go to page
        </Button>
      </CardContent>
    </Card>
  );
}
