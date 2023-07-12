import { Metadata } from 'next';
import { ConfigService } from 'src/server/services/config.service';
import HomePage from 'app/(secure)/HomePage';

export const metadata: Metadata = {
  title: `${ConfigService.appName()}`,
};
export default async function App() {
  return <HomePage />;
}
