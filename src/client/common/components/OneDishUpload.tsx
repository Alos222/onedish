import { useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Box, Button, CardActions, CardContent, CardMedia, Grid } from '@mui/material';
import PhotoIcon from '@mui/icons-material/Photo';
import ODTextField from './ODTextField';
import { Vendor, VendorPhoto } from '@prisma/client';
import { useNotifications } from '../hooks/useNotifications';
import PhotoListSelect from './PhotoListSelect';
import { OneDishTempData } from 'src/types';

interface FileUploadProps {
  vendor?: Vendor;

  onConfirm: (data: OneDishTempData) => void;
}

export default function OneDishUpload({ vendor, onConfirm }: FileUploadProps) {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [file, setFile] = useState<File | undefined>();
  const [fileString, setFileString] = useState<string | undefined>();
  const [selectedImage, setSelectedImage] = useState<VendorPhoto | null>(null);
  const [url, setUrl] = useState<string | undefined>();
  const [id, setId] = useState(uuidv4());

  const inputRef = useRef<HTMLInputElement | null>(null);

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

    const data: OneDishTempData = {
      id,
      title,
      description,
      url,
      file,
      fileString,
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
    <Grid container columnSpacing={2}>
      <Grid item xs={12} sm={5}>
        <CardContent>
          {fileString && <CardMedia sx={{ height: 300, borderRadius: 2 }} image={fileString} title="oneDish" />}
          {url && <CardMedia sx={{ height: 300, borderRadius: 2 }} image={url} title="oneDish" />}
          {!fileString && !url && (
            <Box display="flex" alignContent="center" justifyContent="center" p={4}>
              <PhotoIcon />
            </Box>
          )}
          <Button component="label" variant="outlined" sx={{ mt: 2 }}>
            Upload File
            <input
              type="file"
              hidden
              ref={inputRef}
              onChange={(event) => {
                if (event.target.files?.length) {
                  const selectedFile = event.target.files[0];
                  setFile(selectedFile);

                  // Clear out any image selections
                  setSelectedImage(null);
                  setUrl(undefined);

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
          <Button onClick={confirmOneDish}>Add OneDish</Button>
        </CardActions>
      </Grid>

      {vendor && (
        <Grid item xs={12} sm={7} sx={{ overflowY: 'auto' }}>
          <PhotoListSelect
            photos={vendor.place?.photos || []}
            selectedImage={selectedImage}
            label="Use for OneDish"
            onPhotoSelected={(photo) => {
              setSelectedImage(photo);
              setUrl(photo?.url);

              // Clear out any file uploads
              setFile(undefined);
              setFileString(undefined);
              if (inputRef.current) {
                inputRef.current.value = '';
              }
            }}
          />
        </Grid>
      )}
    </Grid>
  );
}
