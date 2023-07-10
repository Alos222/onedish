import { Card, CardActions, CardMedia, Checkbox, FormControlLabel, Grid } from '@mui/material';
import { VendorPhoto } from '@prisma/client';

interface PhotoListSelectProps {
  photos: VendorPhoto[];
  selectedImage: VendorPhoto | null;
  label: string;
  onPhotoSelected: (photo: VendorPhoto | null) => void;
}

export default function PhotoListSelect({ photos, selectedImage, label, onPhotoSelected }: PhotoListSelectProps) {
  return (
    <Grid container spacing={2} sx={{ maxHeight: 500, overflowY: 'auto' }}>
      {photos.map((photo) => (
        <Grid item key={photo.url}>
          <Card key={photo.url}>
            <CardMedia image={photo.url} sx={{ width: 200, height: 150 }} />
            <CardActions>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={photo.url === selectedImage?.url}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      let image: VendorPhoto | null;
                      if (photo.url === selectedImage?.url) {
                        image = null;
                      } else {
                        image = photo;
                      }
                      onPhotoSelected(image);
                    }}
                  />
                }
                label={label}
              />
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
