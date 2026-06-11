export const metadata = {
  title: 'VortexScans API',
  description: 'Unofficial REST API for Vortex Scans (vortexscans.org)',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
