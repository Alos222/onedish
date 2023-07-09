import UnsecureLayout from 'app/(unsecure)/UnsecureLayout';

export default async function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode;
}) {
  return <UnsecureLayout>{children}</UnsecureLayout>;
}