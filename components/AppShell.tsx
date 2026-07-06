'use client';

import { LangProvider, useLang } from '@/lib/LangContext';
import type { Lang } from '@/lib/i18n';
import type { Site } from '@/lib/sites';
import { Footer } from './Footer';
import { Gallery } from './Gallery';
import { Hero } from './Hero';
import { StickyCta } from './StickyCta';

function Shell({ sites }: { sites: Site[] }) {
  const { t } = useLang();
  return (
    <>
      <a className="skip-link" href="#main">
        {t.skip}
      </a>
      <Hero count={sites.length} names={sites.map((s) => s.company)} />
      <main id="main" tabIndex={-1}>
        <Gallery sites={sites} />
      </main>
      <Footer />
      <StickyCta />
    </>
  );
}

export function AppShell({
  sites,
  initialLang,
}: {
  sites: Site[];
  initialLang: Lang;
}) {
  return (
    <LangProvider initialLang={initialLang}>
      <Shell sites={sites} />
    </LangProvider>
  );
}
