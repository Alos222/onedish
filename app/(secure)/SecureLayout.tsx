'use client';

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
    <>
      <Navbar isSecure />
      <AppWrapper>{children}</AppWrapper>
    </>
  );
}
