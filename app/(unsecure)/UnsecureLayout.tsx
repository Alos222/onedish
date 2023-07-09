'use client';

import AppWrapper from 'app/AppWrapper';
import Navbar from 'src/client/home/components/Navbar';

interface UnsecureLayoutProps {
  children: React.ReactNode;
}

/**
 * Layout for pages that can be accessed without needing to log in to anything
 * @param param0
 * @returns
 */
export default function UnsecureLayout({ children }: UnsecureLayoutProps) {
  return (
    <>
      <Navbar />
      <AppWrapper>{children}</AppWrapper>
    </>
  );
}