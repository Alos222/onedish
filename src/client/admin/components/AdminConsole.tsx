import { Grid } from '@mui/material';
import AdminLinkCard from './AdminLinkCard';
import { VendorsRoute } from 'app/routes';

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
