import Head from 'next/head';
import './globals.css';

export const metadata = {
  title: 'Cyber Dodge - Base Game',
  description: 'An exciting dodge game on Base network',
  metadataBase: new URL('https://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'id_ID',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="base:app_id" content="6984a6d24609f1d788ad2bd3" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
