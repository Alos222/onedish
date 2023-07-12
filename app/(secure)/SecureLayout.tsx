'use client';

import { SessionProvider } from 'next-auth/react';
import AppWrapper from 'app/AppWrapper';
import Navbar from 'src/client/home/components/Navbar';

interface SecureLayoutProps {
  children: React.ReactNode;
}

/**
 * Layout for pages that can only be accessed when logged in
 * @param param0
 * @returns
 */
export default function SecureLayout({ children }: SecureLayoutProps) {
  return (
    <SessionProvider>
      <Navbar isSecure />
      <AppWrapper>{children}</AppWrapper>
    </SessionProvider>
  );
}
