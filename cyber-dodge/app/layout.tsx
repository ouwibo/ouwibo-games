import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Cyber Dodge - Base Mini App',
  description: 'An exciting dodge game on Base network. Play Now!',
  metadataBase: new URL('https://cyber-dodge.vercel.app'),
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Cyber Dodge',
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: 'https://i.postimg.cc/m2jtY6m9/player-ship.png',
    apple: 'https://i.postimg.cc/m2jtY6m9/player-ship.png',
  },
  other: {
    'base:app_id': '6984a6d24609f1d788ad2bd3',
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    title: 'Cyber Dodge - Base Mini App',
    description: 'An exciting dodge game on Base network',
    siteName: 'Cyber Dodge',
    images: [
      {
        url: 'https://i.postimg.cc/m2jtY6m9/player-ship.png',
        width: 192,
        height: 192,
        alt: 'Cyber Dodge Game',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'Cyber Dodge - Base Mini App',
    description: 'An exciting dodge game on Base network',
    images: ['https://i.postimg.cc/m2jtY6m9/player-ship.png'],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1.0,
  maximumScale: 1.0,
  userScalable: false,
  themeColor: '#0d0208',
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
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
