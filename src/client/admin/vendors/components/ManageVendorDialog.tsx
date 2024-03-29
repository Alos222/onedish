import React, { useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import { Card, CardActions, CardContent, CardMedia, Divider, Grid, Paper, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import type { OneDish, Vendor, VendorPlace } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

import GoogleMap from 'src/client/common/components/GoogleMap';
import LoadingButton from 'src/client/common/components/LoadingButton';
import ODDialog from 'src/client/common/components/ODDialog';
import ODTextField from 'src/client/common/components/ODTextField';
import OneDishCard from 'src/client/common/components/OneDishCard';
import OneDishTier from 'src/client/common/components/OneDishTier';
import OneDishUpload from 'src/client/common/components/OneDishUpload';
import PhotoListSelect from 'src/client/common/components/PhotoListSelect';
import { useApiRequest } from 'src/client/common/hooks/useApiRequest';
import { useNotifications } from 'src/client/common/hooks/useNotifications';
import {
  ImageDataRequest,
  OneDishTempData,
  SaveVendorPhotosFromUrlRequest,
  SaveVendorPhotosFromUrlResponse,
  VendorTier,
  VendorWithoutId,
} from 'src/types';
import { AddVendorRequest, ApiResponse, UrlImageData } from 'src/types';
import { DeleteVendorPhotosRequest } from 'src/types/request/vendors/delete-vendor-photos.request';

interface ManageVendorDialogProps {
  /**
   * Provide a vendor to edit. If this is empty, you can create a new vendor
   */
  vendor?: Vendor;

  /**
   * Called when a vendor is added or edited
   * @param vendor
   * @returns
   */
  onVendor: (vendor: Vendor) => void;
}

export default function ManageVendorDialog({ vendor, onVendor }: ManageVendorDialogProps) {
  const isEditing = !!vendor;
  const { post, patch, loading: loadingSave } = useApiRequest('secure/admin/vendors');
  const { postFile: uploadFromFile, loading: loadingUploadFromFile } = useApiRequest(
    'secure/admin/vendors-photos/upload-from-file',
  );
  const { postWithUrl: uploadFromUrl, loading: loadingUploadFromUrl } = useApiRequest(
    'secure/admin/vendors-photos/upload-from-url',
  );
  const { deleteWithData, loading: loadingDelete } = useApiRequest('secure/admin/vendors-photos/delete');

  const isLoading = loadingSave || loadingUploadFromFile || loadingUploadFromUrl || loadingDelete;

  const { displayInfo, displayError } = useNotifications();

  // The name and address details of a vendor
  // Can be autofilled by selecting something on the map, or manually entered
  const [placeName, setPlaceName] = useState<string | null>(vendor?.name || '');
  const [placeAddress, setPlaceAddress] = useState<string | null>(vendor?.address || '');
  const [place, setPlace] = useState<VendorPlace | null>(vendor?.place || null);
  // TODO Check this casting...
  const [selectedTier, setSelectedTier] = useState<VendorTier | null>((vendor?.tier as VendorTier) || null);

  // Temp data for files that need to be saved for a OneDish
  const [oneDishFileUploads, setOneDishFileUploads] = useState<OneDishTempData[]>([]);
  // Temp dat for files that we need to delete
  const [oneDishesToDelete, setOneDishesToDelete] = useState<OneDishTempData[]>([]);
  const [vendorImageToUpload, setVendorImageToUpload] = useState<string | null>(vendor?.vendorImage || null);
  const [vendorImageToDelete, setVendorImageToDelete] = useState<string | null>();

  // Dialog
  const openState = useState(false);
  const [, setOpen] = openState;

  /**
   * Function to reset the form
   */
  const clearData = (newVendor?: Vendor) => {
    setOneDishFileUploads([]);
    setOneDishesToDelete([]);
    setVendorImageToUpload(newVendor?.vendorImage || null);
    setVendorImageToDelete(undefined);
    setPlace(newVendor?.place || null);
  };

  const handleClose = (newVendor?: Vendor) => {
    clearData(newVendor);
    setOpen(false);
  };

  const handleSave = async () => {
    // Set any existing vendor OneDishes
    let oneDishes: OneDish[] = vendor?.oneDishes || [];

    let isError = false;
    if (!placeName) {
      displayError('You need to provide a name');
      isError = true;
    }
    if (!placeAddress) {
      displayError('You need to provide an address');
      isError = true;
    }
    if (!selectedTier) {
      displayError('You need to select a tier');
      isError = true;
    }
    if (selectedOneDishesCount === 0) {
      displayError('You need to select some OneDishes');
      isError = true;
    }
    if (isError || !placeName || !placeAddress || !selectedTier) {
      return;
    }

    try {
      let vendorId: string | undefined = vendor?.id;
      if (!vendor) {
        const createVendorData: VendorWithoutId = {
          place,
          name: placeName,
          address: placeAddress,
          tier: selectedTier,
          vendorImage: null,
          oneDishes: [],
          created: new Date(),
          updated: new Date(),
        };
        // Need to create the vendor first, so we can associate images with the vendor id
        const createResponse = await post<AddVendorRequest, string>({ vendor: createVendorData });

        if (createResponse.error) {
          displayError(createResponse.error);
          return;
        }
        vendorId = createResponse.data;
      }

      if (!vendorId) {
        displayError('Could not create vendor');
        return;
      }

      let isError = false;
      // Then check if we have any new files to upload
      const uploadPhotos = async () => {
        if (!oneDishFileUploads.length) {
          return;
        }
        const formData = new FormData();
        let hasUploads = false;
        oneDishFileUploads.forEach(async (oneDishTempData) => {
          if (oneDishTempData?.fileBlob) {
            formData.append(
              oneDishTempData.id,
              oneDishTempData.fileBlob,
              oneDishTempData.fileName || oneDishTempData.id,
            );
            hasUploads = true;
          }
        });

        if (hasUploads) {
          const result = await uploadFromFile<UrlImageData[]>(`${vendorId}`, formData);
          if (result.error) {
            displayError(result.error);
            isError = true;
            return;
          }
          if (!result.data || !result.data.length) {
            displayError('Could not upload photos');
            isError = true;
            return;
          }

          // Associate the saved files with a OneDish
          result.data.forEach(({ id, url }) => {
            const oneDishTempData = oneDishFileUploads.find((o) => o.id === id);
            if (!oneDishTempData) {
              console.error('Could not find OneDish data for a saved image', {
                id,
                s3Url: url,
              });
              displayError('Could not find OneDish data for a saved image');
            } else {
              oneDishes.push({
                id,
                url,
                title: oneDishTempData.title,
                description: oneDishTempData.description,
              });
            }
          });
        }
      };

      // TODO I don't know if this is really safe...
      // Should move this function out of this file, and have it return the image data
      // instead of modifying variables...
      let vendorImageData: UrlImageData | undefined;
      const uploadPhotoUrls = async (vendorId: string) => {
        if (!oneDishFileUploads.length && !vendorImageToUpload) {
          return;
        }
        const imageData: ImageDataRequest[] = [];
        let hasUploads = false;
        oneDishFileUploads.forEach(async (oneDishTempData) => {
          if (oneDishTempData?.newFileUrl) {
            imageData.push({
              id: oneDishTempData.id,
              url: oneDishTempData.newFileUrl,
            });
            hasUploads = true;
          }
        });

        let vendorImageDataRequest: ImageDataRequest | undefined;
        if (vendorImageToUpload) {
          vendorImageDataRequest = {
            id: `${vendorId}-${uuidv4()}`,
            url: vendorImageToUpload,
          };
          hasUploads = true;
        }

        if (hasUploads) {
          const result = await uploadFromUrl<SaveVendorPhotosFromUrlRequest, SaveVendorPhotosFromUrlResponse>(
            `/${vendorId}`,
            {
              imageData,
              vendorImageData: vendorImageDataRequest,
            },
          );
          if (result.error) {
            displayError(result.error);
            isError = true;
            return;
          }
          if (!result.data) {
            displayError('Could not upload photos');
            isError = true;
            return;
          }
          const { imageData: responseImageData, vendorImageData: responseVendorImageData } = result.data;
          vendorImageData = responseVendorImageData;

          // Associate the saved files with a OneDish
          responseImageData.forEach(({ id, url }) => {
            const oneDishTempData = oneDishFileUploads.find((o) => o.id === id);
            if (!oneDishTempData) {
              console.error('Could not find OneDish data for a saved image', {
                id,
                s3Url: url,
              });
              displayError('Could not find OneDish data for a saved image');
            } else {
              oneDishes.push({
                id,
                url,
                title: oneDishTempData.title,
                description: oneDishTempData.description,
              });
            }
          });
        }
      };

      // Then check if we have any files to delete
      const deletePhotos = async () => {
        if (!oneDishesToDelete.length && !vendorImageToDelete) {
          return;
        }
        const imageUrlsToDelete: string[] = [];
        oneDishesToDelete.forEach(async (oneDishTempData) => {
          if (oneDishTempData?.url) {
            // Only delete if there is a saved url, since that is the one that is saved in S3
            // The `newFileUrl` would be something from Google maps, so we can't delete that
            imageUrlsToDelete.push(oneDishTempData.url);
          }
        });

        if (vendorImageToDelete) {
          // Also delete the vendor image
          imageUrlsToDelete.push(vendorImageToDelete);
        }

        if (imageUrlsToDelete.length) {
          const result = await deleteWithData<DeleteVendorPhotosRequest, boolean>(`/${vendorId}`, {
            imageUrls: imageUrlsToDelete,
          });
          if (result.error) {
            displayError(result.error);
            isError = true;
            return;
          }
          if (!result.data) {
            displayError('Could not delete photos');
            isError = true;
            return;
          }

          // Remove those deleted images from the data that we are saving
          if (oneDishesToDelete.length) {
            oneDishes = oneDishes.filter((o) => oneDishesToDelete.some((toDelete) => o.id !== toDelete.id));
          }
        }
      };

      // TODO I have a bad feeling about doing it this way...
      // Should probably move these request functions and error checking into seperate files/functions out of this hook
      await Promise.all([uploadPhotos(), uploadPhotoUrls(vendorId), deletePhotos()]);
      if (isError) {
        return;
      }

      // TODO Need to figure out how to only pass some props
      // For example, I don't need the `created` value when updating
      const vendorData: VendorWithoutId = {
        place,
        name: placeName,
        address: placeAddress,
        tier: selectedTier,
        vendorImage: vendorImageData?.url || null,
        oneDishes,
        created: vendor?.created || new Date(),
        updated: new Date(),
      };

      let response: ApiResponse<string> = await patch<AddVendorRequest, string>(`/${vendorId}`, {
        vendor: vendorData,
      });
      if (response.error) {
        displayError(response.error);
      } else if (response.data) {
        clearData();
        const newVendor = { ...vendorData, id: vendorId };
        onVendor(newVendor);

        displayInfo(`The vendor ${vendorData.name} at ${vendorData.address} was saved!`);
        handleClose(newVendor);
      } else {
        displayError('Could not update vendor...');
      }
    } catch (e) {
      const error = 'Something went wrong updating vendor...';
      console.error(error, e);
      displayError(error);
    }
  };

  const text = isEditing ? 'Edit Vendor' : 'Add Vendor';

  let allowedOneDishes: number;
  switch (selectedTier) {
    case 'first':
    default:
      allowedOneDishes = 1;
      break;
    case 'second':
      allowedOneDishes = 6;
      break;
    case 'third':
      allowedOneDishes = 12;
      break;
  }

  // Any existing OneDishes for this vendor
  const vendorOneDishes: OneDishTempData[] = vendor?.oneDishes || [];
  // Combine with new OneDishes that we need to upload
  const withoutUploads = oneDishFileUploads.filter((o) => !vendorOneDishes.some((toUpload) => o.id === toUpload.id));
  const allOneDishes = vendorOneDishes
    .concat(withoutUploads)
    .filter((o) => !oneDishesToDelete.some((toDelete) => o.id === toDelete.id));
  const canSelectMore = allOneDishes.length < allowedOneDishes;
  const restrictedOneDishes = allOneDishes.slice(0, allowedOneDishes);
  const selectedOneDishesCount = restrictedOneDishes.length;

  const placePhotos = (place?.photos || []).map((photo) => photo.url);
  const hasPlacePhotos = !!placePhotos.length;

  return (
    <ODDialog
      buttonText={text}
      ButtonStartIcon={isEditing ? <EditIcon /> : <AddIcon />}
      title={text}
      openState={openState}
      onClose={() => clearData(vendor)}
      Actions={
        <LoadingButton loading={isLoading} onClick={handleSave} variant="outlined" startIcon={<SaveIcon />}>
          Save
        </LoadingButton>
      }
    >
      <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
        <Typography variant="h5" color="primary">
          Restaurant details and tier
        </Typography>
        <Typography variant="body1" color="secondary">
          Search for a restaurant to quickly fill details
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={5}>
            <ODTextField
              id="placeName"
              label="Name"
              placeholder="Name of the restaurant"
              value={placeName}
              onChange={(e) => setPlaceName(e.target.value)}
            />
            <ODTextField
              id="placeAddress"
              label="Address"
              placeholder="Address of the restaurant"
              value={placeAddress}
              onChange={(e) => setPlaceAddress(e.target.value)}
              sx={{ mb: 3 }}
            />

            <Typography variant="body1" color="primary">
              Tier
            </Typography>
            <OneDishTier
              tier="first"
              tierDescription="With the first tier, you get a single OneDish"
              selectedTier={selectedTier}
              onTierSelected={(tier) => setSelectedTier(tier)}
            />

            <OneDishTier
              tier="second"
              tierDescription="With the second tier, you get 6 OneDish selections"
              selectedTier={selectedTier}
              onTierSelected={(tier) => setSelectedTier(tier)}
            />

            <OneDishTier
              tier="third"
              tierDescription="With the third tier, you get 12 OneDish selections"
              selectedTier={selectedTier}
              onTierSelected={(tier) => setSelectedTier(tier)}
            />
          </Grid>
          <Grid item xs={12} sm={7}>
            <GoogleMap
              placeId={vendor?.place?.placeId}
              searchable
              ContentInfoActions={(place) => (
                <Button
                  variant="outlined"
                  sx={{ mt: 1 }}
                  onClick={() => {
                    if (place) {
                      setPlaceName(place.name);
                      setPlaceAddress(place.formattedAddress);
                      setPlace(place);
                    }
                  }}
                >
                  Use this place
                </Button>
              )}
            />
          </Grid>
          <Grid item xs={12}>
            {vendorImageToUpload && (
              <Card sx={{ maxWidth: 500 }}>
                <CardMedia sx={{ height: 300 }} image={vendorImageToUpload} title="Vendor image" />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div" color="primary">
                    Restaurant Image
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    onClick={() => {
                      if (vendor?.vendorImage) {
                        // There is already a saved vendor image, so we need to delete that from S3
                        setVendorImageToDelete(vendor.vendorImage);
                      }
                      setVendorImageToUpload(null);
                    }}
                    color="error"
                    variant="outlined"
                    startIcon={<DeleteIcon />}
                  >
                    Delete
                  </Button>
                </CardActions>
              </Card>
            )}
            {!vendorImageToUpload && (
              <>
                <Typography variant="body1" color="primary">
                  Restaurant Image
                </Typography>
                {hasPlacePhotos && (
                  <PhotoListSelect
                    photos={placePhotos}
                    selectedImage={vendorImageToUpload}
                    label="Use for Restaurant"
                    onPhotoSelected={(photo) => {
                      setVendorImageToUpload(photo);
                    }}
                  />
                )}
                {!hasPlacePhotos && (
                  <Typography variant="body1" color="secondary">
                    Select a restaurant from the map to preview some images
                  </Typography>
                )}
              </>
            )}
          </Grid>
        </Grid>
      </Paper>

      <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
        <Typography gutterBottom variant="h5" component="div" color="primary">
          Choose OneDish ({`${selectedOneDishesCount}/${allowedOneDishes}`})
        </Typography>

        {canSelectMore && (
          <>
            <Typography gutterBottom variant="body1" component="div" color="secondary">
              Select an image from Google on the right, or upload a file
            </Typography>
            <OneDishUpload
              vendor={vendor}
              place={place}
              onConfirm={(data) => setOneDishFileUploads((prev) => [...prev, data])}
            />
            <Divider sx={{ pt: 2 }} />
          </>
        )}

        <Grid container mt={2} spacing={2}>
          {restrictedOneDishes.map((oneDish) => (
            <Grid item xs={12} sm={6} md={4} key={oneDish.id}>
              <OneDishCard
                key={oneDish.id}
                oneDish={{
                  id: oneDish.id,
                  // TODO Check the url for value
                  url: oneDish.url || oneDish.newFileUrl || oneDish.fileString || '',
                  title: oneDish.title,
                  description: oneDish.description,
                }}
                actions={
                  <Button
                    variant="outlined"
                    startIcon={<DeleteIcon />}
                    onClick={() => {
                      // First check if this is a new file upload
                      // If so, we don't have to delete anything, just remove it from the in-memory list
                      if (oneDishFileUploads.some((o) => o.id === oneDish.id)) {
                        setOneDishFileUploads((prev) => prev.filter((o) => o.id !== oneDish.id));
                        return;
                      }
                      setOneDishesToDelete((prev) => [...prev, oneDish]);
                    }}
                    color="error"
                  >
                    Delete
                  </Button>
                }
              />
            </Grid>
          ))}
        </Grid>
      </Paper>
    </ODDialog>
  );
}
