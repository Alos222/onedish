import { Box, Button, Card, CardActions, CardContent, CardMedia, Typography } from '@mui/material';
import PhotoIcon from '@mui/icons-material/Photo';
import ReadonlyText from './ReadonlyText';
import { OneDishTempData } from 'src/types';

interface OneDishCardProps {
  data: OneDishTempData;

  onDelete?: () => void;
}

export default function OneDishCard({ data, onDelete }: OneDishCardProps) {
  const { fileData, title, description } = data;
  const { fileString, url } = fileData;

  return (
    <Card sx={{ maxWidth: 350 }}>
      {fileString && <CardMedia sx={{ height: 300 }} image={fileString} title="oneDish" />}
      {url && <CardMedia sx={{ height: 300 }} image={url} title="oneDish" />}
      {!fileString && !url && (
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
