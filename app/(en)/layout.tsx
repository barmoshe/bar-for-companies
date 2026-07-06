import type { Metadata } from 'next';
import { RootHtml } from '../RootHtml';
import { getDict } from '@/lib/i18n';

const d = getDict('en');

export const metadata: Metadata = {
  metadataBase: new URL('https://bar-for-companies.vercel.app'),
  title: d.meta.title,
  description: d.meta.description,
  robots: { index: false, follow: false },
  alternates: {
    canonical: '/',
    languages: { en: '/', he: '/he', 'x-default': '/' },
  },
  openGraph: {
    type: 'website',
    siteName: 'Bar Moshe',
    title: d.meta.title,
    description: d.meta.description,
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: d.meta.title,
    description: d.meta.description,
  },
};

export default function EnLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <RootHtml lang="en">{children}</RootHtml>;
}
