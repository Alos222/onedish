import { useCallback } from 'react';
import { useSnackbar, VariantType } from 'notistack';
import Button from '@mui/material/Button';
import { grey } from '@mui/material/colors';

export const useNotifications = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const displaySnackbar = useCallback(
    (message: string, variant: VariantType) => {
      const key = enqueueSnackbar(<div dangerouslySetInnerHTML={{ __html: message.replaceAll('\n', '<br/>') }} />, {
        variant,
        persist: true,
        action: () => (
          <Button sx={{ color: grey[50] }} onClick={() => closeSnackbar(key)}>
            Close
          </Button>
        ),
      });
    },
    [closeSnackbar, enqueueSnackbar]
  );

  const displayInfo = useCallback(
    (message: string) => {
      displaySnackbar(message, 'info');
    },
    [displaySnackbar]
  );

  const displayWarning = useCallback(
    (message: string) => {
      displaySnackbar(message, 'warning');
    },
    [displaySnackbar]
  );

  const displayError = useCallback(
    (message: string) => {
      displaySnackbar(message, 'error');
    },
    [displaySnackbar]
  );

  return { displayInfo, displayWarning, displayError };
};
