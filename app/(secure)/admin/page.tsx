import { Metadata } from 'next';
import { ConfigService } from 'src/server/services/config.service';
import AdminPage from './AdminPage';
import { AdminRouteName } from 'app/route-names';

export const metadata: Metadata = {
  title: `${ConfigService.appName()} | ${AdminRouteName}`,
};

export default async function App() {
  return <AdminPage />;
}
