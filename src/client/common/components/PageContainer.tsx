import { Box, Typography } from '@mui/material';

interface PageContainerProps {
  title: string;
  subtitle?: string;
}

export default function PageContainer({ title, subtitle, children }: React.PropsWithChildren<PageContainerProps>) {
  return (
    <Box>
      <Box>
        <Typography variant="h5" color="primary">
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body1" color="secondary">
            {subtitle}
          </Typography>
        )}
      </Box>
      {children}
    </Box>
  );
}
