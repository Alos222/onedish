import { Box, Button, Card, CardActions, CardContent, CardMedia, Typography } from '@mui/material';
import PhotoIcon from '@mui/icons-material/Photo';
import ReadonlyText from './ReadonlyText';
import { OneDish, Vendor } from '@prisma/client';

interface OneDishCardProps {
  oneDish: OneDish;
  vendor?: Vendor;
  actions?: React.ReactNode;
  onDelete?: () => void;
}

export default function OneDishCard({ oneDish, vendor, onDelete, actions }: OneDishCardProps) {
  const { url, title, description } = oneDish;
  const { name } = vendor || {};

  return (
    <Card sx={{ maxWidth: 350, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      {url && <CardMedia sx={{ height: 300 }} image={url} title="oneDish" />}
      {!url && (
        <Box display="flex" alignContent="center" justifyContent="center" p={4}>
          <PhotoIcon />
        </Box>
      )}
      <Box display="flex" flexDirection="column" flexGrow={1}>
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography gutterBottom variant="h5" component="div" color="primary">
            OneDish{name ? ` for ${name}` : ''}
          </Typography>

          <ReadonlyText title="title" value={title} />
          <ReadonlyText title="Description" value={description} />
        </CardContent>
        {actions && <CardActions>{actions}</CardActions>}
      </Box>
    </Card>
  );
}
