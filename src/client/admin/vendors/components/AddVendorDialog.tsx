import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import CloseIcon from '@mui/icons-material/Close';
import MapSelect from './VendorMap';
import { Box, DialogContentText, Divider, IconButton, TextField, Typography } from '@mui/material';
import { Vendor } from 'src/types';
import { useNotifications } from 'src/client/common/hooks/useNotifications';

interface AddVendorDialogProps {
  onVendorAdded: (vendor: Vendor) => void;
}
export default function AddVendorDialog({ onVendorAdded }: AddVendorDialogProps) {
  const [open, setOpen] = useState(false);

  // The name and address details of a vendor
  // Can be autofilled by selecting something on the map, or manually entered
  const [placeName, setPlaceName] = useState<string | undefined>('');
  const [placeAddress, setPlaceAddress] = useState<string | undefined>('');

  const { displayError } = useNotifications();

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleAdd = () => {
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
    onVendorAdded({
      name: placeName,
      address: placeAddress,
    });
    handleClose();
  };

  return (
    <>
      <Button variant="outlined" onClick={handleClickOpen}>
        Add vendor
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
          <MapSelect
            onVendorSelected={(name, address) => {
              setPlaceName(name);
              setPlaceAddress(address);
            }}
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
          <Button onClick={handleAdd}>Add</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
