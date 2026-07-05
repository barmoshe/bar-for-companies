import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const description =
  'When I apply somewhere, I build the company a site first. This is the gallery of those sites, all live.';

export const metadata: Metadata = {
  metadataBase: new URL('https://bar-for-companies.vercel.app'),
  title: 'bar for companies',
  description,
  robots: { index: false, follow: false },
  openGraph: {
    type: 'website',
    siteName: 'Bar Moshe',
    title: 'bar for companies',
    description,
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'bar for companies',
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
