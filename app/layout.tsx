import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ahana Mehra · Yoga teacher',
  description: 'Calm, strong mornings with yoga teacher Ahana Mehra: private sessions, small groups, live online classes and retreats by the water. A concept website.',
};

export const viewport: Viewport = {
  themeColor: '#fbf9f8',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link rel="preconnect" href="https://cdn.fontshare.com" crossOrigin="" />
        <link href="https://api.fontshare.com/v2/css?f[]=general-sans@300,400,500&f[]=gambetta@300,400&display=swap" rel="stylesheet" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Playball&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
