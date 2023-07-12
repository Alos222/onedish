'use client';

import { SessionProvider, useSession } from 'next-auth/react';
import AppWrapper from 'app/AppWrapper';
import Navbar from 'src/client/common/components/Navbar';

interface SecureLayoutProps {
  children: React.ReactNode;
}

function Layout({ children }: SecureLayoutProps) {
  const { data: session } = useSession();

  return (
    <>
      <Navbar user={session?.user} />
      <AppWrapper user={session?.user}>{children}</AppWrapper>
    </>
  );
}

/**
 * Layout for pages that can only be accessed when logged in
 * @param param0
 * @returns
 */
export default function SecureLayout({ children }: SecureLayoutProps) {
  return (
    <SessionProvider>
      <Layout>{children}</Layout>
    </SessionProvider>
  );
}
