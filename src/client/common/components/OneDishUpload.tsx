import { useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Box, Button, CardActions, CardContent, CardMedia, Grid } from '@mui/material';
import PhotoIcon from '@mui/icons-material/Photo';
import ODTextField from './ODTextField';
import { Vendor, VendorPhoto, VendorPlace } from '@prisma/client';
import { useNotifications } from '../hooks/useNotifications';
import PhotoListSelect from './PhotoListSelect';
import { OneDishTempData } from 'src/types';
import FileUploadButton from './FileUploadButton';

interface FileUploadProps {
  vendor?: Vendor;

  place?: VendorPlace | null;

  onConfirm: (data: OneDishTempData) => void;
}

export default function OneDishUpload({ vendor, place, onConfirm }: FileUploadProps) {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [fileBlob, setFileBlob] = useState<Blob | undefined>();
  const [fileName, setFileName] = useState<string | undefined>();
  const [fileString, setFileString] = useState<string | undefined>();
  const [selectedImage, setSelectedImage] = useState<VendorPhoto | null>(null);
  const [url, setUrl] = useState<string | undefined>();
  const [id, setId] = useState(uuidv4());

  const inputRef = useRef<HTMLInputElement | null>(null);

  const { displayError } = useNotifications();

  const confirmOneDish = () => {
    if (!url && !fileBlob) {
      displayError('You need to select or upload an image');
      return;
    }
    if (!title) {
      displayError('You need to provide a title');
      return;
    }

    const data: OneDishTempData = {
      id,
      title: title?.trim(),
      description: description?.trim(),
      newFileUrl: url,
      fileBlob,
      fileName,
      fileString,
    };
    onConfirm(data);

    setTitle('');
    setDescription('');
    setFileBlob(undefined);
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
          <FileUploadButton
            onFileUploaded={(compressedFile, compressedFileString, fileName) => {
              setFileString(compressedFileString);
              setFileBlob(compressedFile);
              setFileName(fileName);

              setSelectedImage(null);
              setUrl(undefined);
            }}
            ref={inputRef}
          />

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

      <Grid item xs={12} sm={7} sx={{ overflowY: 'auto' }}>
        <PhotoListSelect
          photos={vendor?.place?.photos || place?.photos || []}
          selectedImage={selectedImage}
          label="Use for OneDish"
          onPhotoSelected={(photo) => {
            setSelectedImage(photo);
            setUrl(photo?.url);

            // Clear out any file uploads
            setFileString(undefined);
            if (inputRef.current) {
              inputRef.current.value = '';
            }
          }}
        />
      </Grid>
    </Grid>
  );
}
