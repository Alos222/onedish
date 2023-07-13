import { ChangeEvent, forwardRef } from 'react';
import { Button } from '@mui/material';
import { useNotifications } from '../hooks/useNotifications';

const maxWidth = 800;
const maxHeight = 800;
const quality = 0.7;

interface FileUploadButtonProps {
  onFileUploaded: (compressedFileBlob: Blob, compressedFileString: string, fileName: string) => void;
}

const FileUploadButton = forwardRef<HTMLInputElement, FileUploadButtonProps>(
  ({ onFileUploaded }: FileUploadButtonProps, inputRef) => {
    const { displayError } = useNotifications();

    // Function to handle file upload
    const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
      if (!event.target.files?.length) {
        return;
      }

      const file = event.target.files[0];
      // Check if the file is an image
      if (!file.type.startsWith('image/')) {
        return;
      }

      const reader = new FileReader();

      // Read the file as a data URL
      reader.readAsDataURL(file);

      // When the file is loaded
      reader.onload = function (event) {
        const loadResult = event.target?.result;
        if (!loadResult) {
          return;
        }
        const img = new Image();

        // When the image is loaded
        img.onload = () => {
          // Create a canvas element
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            console.error('Context is not available for canvas');
            displayError('Something went wrong during file compression before upload');
            return;
          }

          // Set the canvas dimensions to the desired compressed size
          let width = img.width;
          let height = img.height;

          // Calculate the new dimensions while maintaining the aspect ratio
          if (width > height) {
            if (width > maxWidth) {
              height *= maxWidth / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width *= maxHeight / height;
              height = maxHeight;
            }
          }

          // Set the canvas dimensions
          canvas.width = width;
          canvas.height = height;

          // Draw the image on the canvas with the new dimensions
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', quality); // Adjust the quality as needed

          // Get the compressed data URL from the canvas
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                displayError('Could not compress file upload');
                return;
              }
              onFileUploaded(blob, compressedDataUrl, file.name);
            },
            'image/jpeg',
            quality
          );
        };

        // Set the source of the image to the data URL
        // TODO Might want to check this linter ignore
        // @ts-ignore
        img.src = loadResult;
      };
    };

    return (
      <Button component="label" variant="outlined" sx={{ mt: 2 }}>
        Upload File
        <input type="file" hidden ref={inputRef} onChange={handleFileUpload} />
      </Button>
    );
  }
);

export default FileUploadButton;
