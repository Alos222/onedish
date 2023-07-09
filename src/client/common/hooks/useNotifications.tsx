import Button from '@mui/material/Button';
import { useSnackbar, VariantType } from 'notistack';
import { grey } from '@mui/material/colors';

export const useNotification = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const displaySnackbar = (message: string, variant: VariantType) => {
    const key = enqueueSnackbar(
      <div
        dangerouslySetInnerHTML={{ __html: message.replaceAll('\n', '<br/>') }}
      />,
      {
        variant,
        persist: true,
        action: () => (
          <Button sx={{ color: grey[50] }} onClick={() => closeSnackbar(key)}>
            Close
          </Button>
        ),
      }
    );
  };

  const displayInfo = (message: string) => {
    displaySnackbar(message, 'info');
  };

  const displayWarning = (message: string) => {
    displaySnackbar(message, 'warning');
  };

  const displayError = (message: string) => {
    displaySnackbar(message, 'error');
  };

  return { displayInfo, displayWarning, displayError };
};