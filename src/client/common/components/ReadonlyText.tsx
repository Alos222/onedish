import { Box, Typography } from '@mui/material';

interface ReadonlyTextProps {
  /**
   * The title of the text value property
   */
  title: string;
  /**
   * The actual value to be display
   */
  value: React.ReactNode;
}

export default function ReadonlyText({ title, value }: ReadonlyTextProps) {
  return (
    <Box mb={2}>
      <Typography variant="body2" color="primary">
        {title}
      </Typography>
      <Typography variant="body1">{value}</Typography>
    </Box>
  );
}
