import BaseLayout from './BaseLayout';

export default async function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body>
        <BaseLayout>
          {children}
        </BaseLayout>
      </body>
    </html>
  );
}