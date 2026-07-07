'use client';

import { LangProvider, useLang } from '@/lib/LangContext';
import type { Lang } from '@/lib/i18n';
import type { Site } from '@/lib/sites';
import { Footer } from './Footer';
import { Gallery } from './Gallery';
import { Hero } from './Hero';
import { StickyCta } from './StickyCta';

function Shell({
  sites,
  counts,
}: {
  sites: Site[];
  counts: Record<string, number>;
}) {
  const { t } = useLang();
  return (
    <>
      <a className="skip-link" href="#main">
        {t.skip}
      </a>
      <Hero count={sites.length} names={sites.map((s) => s.company)} />
      <main id="main" tabIndex={-1}>
        <Gallery sites={sites} counts={counts} />
      </main>
      <Footer />
      <StickyCta />
    </>
  );
}

export function AppShell({
  sites,
  initialLang,
  counts,
}: {
  sites: Site[];
  initialLang: Lang;
  counts: Record<string, number>;
}) {
  return (
    <LangProvider initialLang={initialLang}>
      <Shell sites={sites} counts={counts} />
    </LangProvider>
  );
}
