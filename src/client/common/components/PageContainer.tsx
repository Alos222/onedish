import { Box, Typography } from '@mui/material';

import { OneDishRoute } from 'app/routes';

interface PageContainerProps {
  route: OneDishRoute;
  /**
   * Provide a description here for the case when you need to dynamically determine it
   */
  description?: string;
}

export default function PageContainer({
  route,
  description: propsDescription,
  children,
}: React.PropsWithChildren<PageContainerProps>) {
  const { name, description: routeDescription } = route;

  const description = routeDescription || propsDescription;

  return (
    <Box>
      <Box mb={2}>
        <Typography variant="h5" color="primary">
          {name}
        </Typography>
        {description && (
          <Typography variant="body1" color="secondary">
            {description}
          </Typography>
        )}
      </Box>
      {children}
    </Box>
  );
}
