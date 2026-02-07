import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Cyber Dodge - Base Game',
  description: 'An exciting dodge game on Base network',
  metadataBase: new URL('https://localhost:3000'),
  manifest: '/manifest.json',
  other: {
    'base:app_id': '6984a6d24609f1d788ad2bd3',
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1.0,
  maximumScale: 1.0,
  userScalable: false,
  themeColor: '#000000',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        <meta charSet="UTF-8" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
