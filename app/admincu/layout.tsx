// Root admin layout - don't redirect here
// Let subdir layouts (login/ and (dashboard)/) handle their own logic

export default async function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
