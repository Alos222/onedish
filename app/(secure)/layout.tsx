import SecureLayout from 'app/(secure)/SecureLayout';

export default async function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode;
}) {
  return <SecureLayout>{children}</SecureLayout>;
}
