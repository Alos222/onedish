import { Card, CardActions, CardMedia, Checkbox, FormControlLabel, Grid } from '@mui/material';

interface PhotoListSelectProps {
  /**
   * List of urls for photos
   */
  photos: string[];

  /**
   * The currently selected image
   */
  selectedImage?: string | null;

  /**
   * Label to use for the select checkbox text
   */
  label: string;

  /**
   * Callback for when an image is selected
   * @param photo
   * @returns
   */
  onPhotoSelected: (photo: string | null) => void;
}

export default function PhotoListSelect({ photos, selectedImage, label, onPhotoSelected }: PhotoListSelectProps) {
  return (
    <Grid container spacing={2} sx={{ maxHeight: 500, overflowY: 'auto' }}>
      {photos.map((photo) => (
        <Grid item key={photo}>
          <Card key={photo}>
            <CardMedia image={photo} sx={{ width: 200, height: 150 }} />
            <CardActions>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={photo === selectedImage}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      let image: string | null;
                      if (photo === selectedImage) {
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
