import { Box, Button, Card, CardActions, CardContent, CardMedia, Typography } from '@mui/material';
import PhotoIcon from '@mui/icons-material/Photo';
import ReadonlyText from './ReadonlyText';

interface OneDishCardProps {
  url?: string;
  title: string;
  description?: string | null;
  onDelete?: () => void;
}

export default function OneDishCard({ url, title, description, onDelete }: OneDishCardProps) {
  return (
    <Card sx={{ maxWidth: 350 }}>
      {url && <CardMedia sx={{ height: 300 }} image={url} title="oneDish" />}
      {!url && (
        <Box display="flex" alignContent="center" justifyContent="center" p={4}>
          <PhotoIcon />
        </Box>
      )}
      <CardContent>
        <Typography gutterBottom variant="h5" component="div" color="primary">
          OneDish
        </Typography>

        <ReadonlyText title="title" value={title} />
        <ReadonlyText title="Description" value={description} />
      </CardContent>
      {onDelete && (
        <CardActions>
          <Button onClick={onDelete} color="error">
            Delete
          </Button>
        </CardActions>
      )}
    </Card>
  );
}
