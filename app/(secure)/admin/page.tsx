import { Metadata } from 'next';

import { AdminRouteName } from 'app/route-names';
import { ConfigService } from 'src/server/services/config.service';

import AdminPage from './AdminPage';

export const metadata: Metadata = {
  title: `${ConfigService.appName()} | ${AdminRouteName}`,
};

export default async function App() {
  return <AdminPage />;
}
