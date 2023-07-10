import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Checkbox,
  FormControlLabel,
  Grid,
  Paper,
  Typography,
} from '@mui/material';
import PhotoIcon from '@mui/icons-material/Photo';
import ODTextField from './ODTextField';
import { Vendor, VendorPhoto } from '@prisma/client';
import { useNotifications } from '../hooks/useNotifications';

export type FileData = {
  id: string;
  url?: string;
  file?: File;
  fileString?: string;
  title: string;
  description?: string;
};

interface PhotoListSelectProps {
  photos: VendorPhoto[];
  selectedImage: VendorPhoto | null;
  onPhotoSelected: (photo: VendorPhoto | null) => void;
}

function PhotoListSelect({ photos, selectedImage, onPhotoSelected }: PhotoListSelectProps) {
  return (
    <Grid container spacing={2} sx={{ maxHeight: 500, overflowY: 'auto' }}>
      {photos.map((photo) => (
        <Grid item>
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
                label="Use for OneDish"
              />
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

interface FileUploadProps {
  vendor?: Vendor;

  onConfirm: (data: FileData) => void;
}

export default function OneDishUpload({ vendor, onConfirm }: FileUploadProps) {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [file, setFile] = useState<File | undefined>();
  const [fileString, setFileString] = useState<string | undefined>();
  const [selectedImage, setSelectedImage] = useState<VendorPhoto | null>(vendor?.oneDish || null);
  const [url, setUrl] = useState<string | undefined>();
  const [id, setId] = useState(uuidv4());

  const { displayError } = useNotifications();

  const confirmOneDish = () => {
    if (!file && !url) {
      displayError('You need to select or upload an image');
      return;
    }
    if (!title) {
      displayError('You need to provide a title');
      return;
    }

    // TODO Save uploaded image
    const data: FileData = {
      id,
      url,
      file,
      fileString,
      title,
      description,
    };
    onConfirm(data);

    setTitle('');
    setDescription('');
    setFile(undefined);
    setFileString('');
    setUrl('');
    setSelectedImage(null);
    setId(uuidv4());
  };

  return (
    <Paper>
      <Grid container columnSpacing={2}>
        <Grid item xs={12} sm={5}>
          {fileString && <CardMedia sx={{ height: 300 }} image={fileString} title="oneDish" />}
          {url && <CardMedia sx={{ height: 300 }} image={url} title="oneDish" />}
          {!fileString && !url && (
            <Box display="flex" alignContent="center" justifyContent="center" p={4}>
              <PhotoIcon />
            </Box>
          )}
          <CardContent>
            <Typography gutterBottom variant="h5" component="div" color="primary">
              Choose OneDish
            </Typography>
            <Typography gutterBottom variant="body1" component="div" color="secondary">
              Select an image from Google on the right, or upload a file
            </Typography>
            <Button component="label" variant="outlined">
              Upload File
              <input
                type="file"
                hidden
                onChange={(event) => {
                  if (event.target.files) {
                    const selectedFile = event.target.files[0];
                    setFile(selectedFile);

                    const reader = new FileReader();
                    reader.onload = function (e) {
                      if (e.target?.result) {
                        setFileString(e.target?.result.toString());
                      }
                    };
                    reader.readAsDataURL(selectedFile);
                  }
                }}
              />
            </Button>

            <ODTextField
              id="title"
              label="Title"
              placeholder="Title of the OneDish"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <ODTextField
              id="description"
              label="Description"
              placeholder="Description of the OneDish"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </CardContent>
          <CardActions>
            <Button onClick={confirmOneDish}>Confirm OneDish</Button>
          </CardActions>
        </Grid>

        {vendor && (
          <Grid item xs={12} sm={7} sx={{ overflowY: 'auto' }}>
            <PhotoListSelect
              photos={vendor.place?.photos || []}
              selectedImage={selectedImage}
              onPhotoSelected={(photo) => {
                setSelectedImage(photo);
                setUrl(photo?.url);
              }}
            />
          </Grid>
        )}
      </Grid>
    </Paper>
  );
}
