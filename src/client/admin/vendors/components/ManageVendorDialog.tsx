import React, { useCallback, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import CloseIcon from '@mui/icons-material/Close';
import { Divider, Grid, IconButton, Paper, Typography } from '@mui/material';
import type { OneDish, Vendor, VendorPhoto, VendorPlace } from '@prisma/client';
import { useNotifications } from 'src/client/common/hooks/useNotifications';
import { useApiRequest } from 'src/client/common/hooks/useApiRequest';
import { OneDishTempData, VendorTier, VendorWithoutId } from 'src/types';
import GoogleMap from 'src/client/common/components/GoogleMap';
import OneDishUpload from 'src/client/common/components/OneDishUpload';
import ODTextField from 'src/client/common/components/ODTextField';
import OneDishCard from 'src/client/common/components/OneDishCard';
import OneDishTier from 'src/client/common/components/OneDishTier';
import PhotoListSelect from 'src/client/common/components/PhotoListSelect';
import { ApiResponse } from 'src/types/response/api-response';
import { AddVendorRequest } from 'src/types/request/vendors/add-vendor.request';
import { ImageData } from 'src/types/image-data';
import LoadingButton from 'src/client/common/components/LoadingButton';
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
  const { postFile, deleteWithData, loading: loadingVendorPhotos } = useApiRequest('secure/admin/vendors-photos');
  const { displayInfo, displayError } = useNotifications();
  const [open, setOpen] = useState(false);

  // The name and address details of a vendor
  // Can be autofilled by selecting something on the map, or manually entered
  const [placeName, setPlaceName] = useState<string | null>(vendor?.name || '');
  const [placeAddress, setPlaceAddress] = useState<string | null>(vendor?.address || '');
  const [place, setPlace] = useState<VendorPlace | null>(vendor?.place || null);
  const [vendorImage, setVendorImage] = useState<VendorPhoto | null>(vendor?.vendorImage || null);
  // TODO Check this casting...
  const [selectedTier, setSelectedTier] = useState<VendorTier | null>((vendor?.tier as VendorTier) || null);

  // Temp data for files that need to be saved for a OneDish
  const [oneDishFileUploads, setOneDishFileUploads] = useState<OneDishTempData[]>([]);
  // Temp dat for files that we need to delete
  const [oneDishesToDelete, setOneDishesToDelete] = useState<OneDishTempData[]>([]);

  /**
   * Function to reset the form
   */
  const clearData = () => {
    setOneDishFileUploads([]);
    setOneDishesToDelete([]);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    clearData();
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
      // Then check if we have any new files to upload
      if (oneDishFileUploads.length) {
        const formData = new FormData();
        let hasUploads = false;
        oneDishFileUploads.forEach(async (oneDishTempData) => {
          if (oneDishTempData?.file) {
            formData.append(oneDishTempData.id, oneDishTempData.file, oneDishTempData.file.name);
            hasUploads = true;
          }
        });

        if (hasUploads) {
          const result = await postFile<ImageData[]>(`${vendor?.id}`, formData);
          if (result.error) {
            displayError(result.error);
            return;
          }
          if (!result.data || !result.data.length) {
            displayError('Could not upload photos');
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
      }

      // Then check if we have any files to delete
      if (oneDishesToDelete.length) {
        const imageUrlsToDelete: string[] = [];
        oneDishesToDelete.forEach(async (oneDishTempData) => {
          if (oneDishTempData?.url) {
            // Only delete if there is a saved url, since that is the one that is saved in S3
            // The `newFileUrl` would be something from Google maps, so we can't delete that
            imageUrlsToDelete.push(oneDishTempData.url);
          }
        });

        if (imageUrlsToDelete.length) {
          const result = await deleteWithData<DeleteVendorPhotosRequest, boolean>(`/${vendor?.id}`, {
            imageUrls: imageUrlsToDelete,
          });
          if (result.error) {
            displayError(result.error);
            return;
          }
          if (!result.data) {
            displayError('Could not delete photos');
            return;
          }

          // Remove those deleted images from the data that we are saving
          oneDishes = oneDishes.filter((o) => oneDishesToDelete.some((toDelete) => o.id !== toDelete.id));
        }
      }

      const vendorData: VendorWithoutId = {
        place,
        name: placeName,
        address: placeAddress,
        tier: selectedTier,
        vendorImage,
        oneDishes,
      };

      let response: ApiResponse<string>;
      if (isEditing) {
        response = await patch<AddVendorRequest, string>(`/${vendor.id}`, { vendor: vendorData });
      } else {
        response = await post<AddVendorRequest, string>({ vendor: vendorData });
      }
      if (response.error) {
        displayError(response.error);
      } else if (response.data) {
        clearData();
        onVendor({ ...vendorData, id: response.data });

        displayInfo(`The vendor ${vendorData.name} at ${vendorData.address} was saved!`);
        handleClose();
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

  return (
    <>
      <Button variant="outlined" onClick={handleClickOpen}>
        {text}
      </Button>
      <Dialog open={open} fullWidth maxWidth="lg">
        <DialogTitle>
          {text}
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
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
                  place={vendor?.place}
                  searchable
                  ContentInfoActions={(place) => (
                    <Button
                      variant="outlined"
                      sx={{ mt: 1 }}
                      onClick={() => {
                        if (place) {
                          setPlaceName(place.name);
                          setPlaceAddress(place.formatted_address);
                          setPlace(place);
                        }
                      }}
                    >
                      Choose
                    </Button>
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1" color="primary">
                  Restaurant Image
                </Typography>
                <PhotoListSelect
                  photos={place?.photos || []}
                  selectedImage={vendorImage}
                  label="Use for Restaurant"
                  onPhotoSelected={(photo) => {
                    setVendorImage(photo);
                  }}
                />
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
                <OneDishUpload vendor={vendor} onConfirm={(data) => setOneDishFileUploads((prev) => [...prev, data])} />
                <Divider sx={{ pt: 2 }} />
              </>
            )}

            <Grid container mt={2} spacing={2}>
              {restrictedOneDishes.map((oneDish) => (
                <Grid item xs={12} sm={6} md={4} key={oneDish.id}>
                  <OneDishCard
                    key={oneDish.id}
                    url={oneDish.url || oneDish.newFileUrl || oneDish.fileString}
                    title={oneDish.title}
                    description={oneDish.description}
                    onDelete={() => setOneDishesToDelete((prev) => [...prev, oneDish])}
                  />
                </Grid>
              ))}
            </Grid>
          </Paper>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <LoadingButton loading={loadingVendorPhotos || loadingSave} onClick={handleSave}>
            Save
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
}
