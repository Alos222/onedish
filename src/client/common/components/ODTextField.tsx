import { TextField, TextFieldProps } from '@mui/material';

interface ODTextFieldProps {
  value?: string | null;
}

type Props = ODTextFieldProps & Omit<TextFieldProps, 'variant'>;

export default function ODTextField({ ...other }: Props) {
  return <TextField margin="dense" type="text" fullWidth variant="standard" {...other} />;
}
