import {
  Fraunces,
  Frank_Ruhl_Libre,
  Heebo,
  Instrument_Sans,
} from 'next/font/google';
import { DIR, type Lang } from '@/lib/i18n';
import { PREPAINT_SCRIPT } from '@/lib/prepaint';
import './globals.css';

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
  axes: ['opsz'],
  style: ['normal', 'italic'],
});

const instrument = Instrument_Sans({
  subsets: ['latin'],
  variable: '--font-instrument',
  display: 'swap',
});

// Hebrew-capable pair; globals.css swaps the font vars under html[lang="he"].
const frank = Frank_Ruhl_Libre({
  subsets: ['hebrew', 'latin'],
  variable: '--font-frank',
  display: 'swap',
});

const heebo = Heebo({
  subsets: ['hebrew', 'latin'],
  variable: '--font-heebo',
  display: 'swap',
});

/**
 * Shared <html>/<body> shell for both locale root layouts. The pre-paint
 * script runs before first paint and may rewrite lang/dir from the stored
 * preference, hence suppressHydrationWarning.
 */
export function RootHtml({
  lang,
  children,
}: {
  lang: Lang;
  children: React.ReactNode;
}) {
  return (
    <html
      lang={lang}
      dir={DIR[lang]}
      suppressHydrationWarning
      className={`${fraunces.variable} ${instrument.variable} ${frank.variable} ${heebo.variable}`}
    >
      <body>
        <script dangerouslySetInnerHTML={{ __html: PREPAINT_SCRIPT }} />
        {children}
      </body>
    </html>
  );
}
