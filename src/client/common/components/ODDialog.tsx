import { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface ODDialogProps {
  buttonText: string;
  title: string;
  onOpen?: () => void;
  onClose?: () => void;
  Actions?: React.ReactNode;
}

export default function ODDialog({
  buttonText,
  title,
  onOpen,
  onClose,
  Actions,
  children,
}: React.PropsWithChildren<ODDialogProps>) {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
    onOpen?.();
  };
  const handleClose = () => {
    setOpen(false);
    onClose?.();
  };

  return (
    <>
      <Button variant="outlined" onClick={handleClickOpen}>
        {buttonText}
      </Button>
      <Dialog open={open} fullWidth maxWidth="xl">
        <DialogTitle>
          {title}
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
        <DialogContent sx={{ mt: 2 }}>{children}</DialogContent>
        {Actions && <DialogActions>{Actions}</DialogActions>}
      </Dialog>
    </>
  );
}
