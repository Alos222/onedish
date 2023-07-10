import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import CloseIcon from '@mui/icons-material/Close';
import { Box, DialogContentText, Divider, IconButton, TextField, Typography } from '@mui/material';
import type { Vendor, VendorPlace } from '@prisma/client';
import { useNotifications } from 'src/client/common/hooks/useNotifications';
import { useApiRequest } from 'src/client/common/hooks/useApiRequest';
import { AddVendorResponse } from 'src/types/response/vendors/add-vendor.response';
import { AddVendorRequest } from 'src/types/request/vendors/add-vendor.request';
import { VendorWithoutId } from 'src/types';
import GoogleMap from 'src/client/common/components/GoogleMap';
import { ApiResponse } from 'src/types/response/api-response';

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
  const { post, patch } = useApiRequest('secure/admin/vendors');
  const { displayInfo, displayError } = useNotifications();
  const [open, setOpen] = useState(false);

  // The name and address details of a vendor
  // Can be autofilled by selecting something on the map, or manually entered
  const [placeName, setPlaceName] = useState<string | null>(vendor?.name || null);
  const [placeAddress, setPlaceAddress] = useState<string | null>(vendor?.address || null);
  const [place, setPlace] = useState<VendorPlace | null>(vendor?.place || null);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = async () => {
    let isError = false;
    if (!placeName) {
      displayError('You need to provide a name');
      isError = true;
    }
    if (!placeAddress) {
      displayError('You need to provide an address');
      isError = true;
    }
    if (isError || !placeName || !placeAddress) {
      return;
    }

    const vendorData: VendorWithoutId = {
      place,
      name: placeName,
      address: placeAddress,
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
      onVendor({ ...vendorData, id: response.data });
      displayInfo(`The vendor ${vendorData.name} at ${vendorData.address} was saved!`);
      handleClose();
    } else {
      displayError('Could not update vendor...');
    }
  };

  return (
    <>
      <Button variant="outlined" onClick={handleClickOpen}>
        {isEditing ? 'Edit Vendor' : 'Add Vendor'}
      </Button>
      <Dialog open={open} fullWidth maxWidth="xl">
        <DialogTitle>
          Add vendor{' '}
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
          <DialogContentText>Search for a restaurant to quickly fill details</DialogContentText>
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

          <Box pt={2}>
            <Divider />
            <Typography variant="body1" color="secondary" pt={2}>
              Restaurant details
            </Typography>

            <TextField
              margin="dense"
              id="placeName"
              label="Name"
              placeholder="Name of the restaurant"
              type="text"
              fullWidth
              variant="standard"
              value={placeName}
              onChange={(e) => setPlaceName(e.target.value)}
            />
            <TextField
              id="placeAddress"
              label="Address"
              placeholder="Address of the restaurant"
              type="text"
              fullWidth
              variant="standard"
              value={placeAddress}
              onChange={(e) => setPlaceAddress(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
