import { CircularProgress } from '@mui/material';
import Button, { ButtonProps } from '@mui/material/Button';

interface LoadingButtonProps extends ButtonProps {
  loading: boolean;
}
export default function LoadingButton({
  loading,
  children,
  startIcon,
  ...other
}: React.PropsWithChildren<LoadingButtonProps>) {
  return (
    <Button disabled={loading} startIcon={loading ? <CircularProgress size={20} /> : startIcon} {...other}>
      {children}
    </Button>
  );
}
