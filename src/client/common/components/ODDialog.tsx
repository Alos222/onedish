import CloseIcon from '@mui/icons-material/Close';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material';

interface ODDialogProps {
  buttonText: string;
  ButtonStartIcon?: React.ReactNode;
  title: string;
  openState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  onOpen?: () => void;
  onClose?: () => void;
  Actions?: React.ReactNode;
}

export default function ODDialog({
  buttonText,
  ButtonStartIcon,
  title,
  openState,
  onOpen,
  onClose,
  Actions,
  children,
}: React.PropsWithChildren<ODDialogProps>) {
  const [open, setOpen] = openState;

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
      <Button variant="outlined" onClick={handleClickOpen} startIcon={ButtonStartIcon ? ButtonStartIcon : null}>
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

        <DialogActions>
          <>
            <Button onClick={handleClose}>Close</Button>
            {Actions && Actions}
          </>
        </DialogActions>
      </Dialog>
    </>
  );
}
