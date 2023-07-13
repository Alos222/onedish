import { Grid } from '@mui/material';

import { VendorsRoute } from 'app/routes';

import AdminLinkCard from './AdminLinkCard';

interface AdminConsoleProps {}

export default function AdminConsole({}: AdminConsoleProps) {
  return (
    <Grid container>
      <Grid item>
        <AdminLinkCard route={VendorsRoute} />
      </Grid>
    </Grid>
  );
}
