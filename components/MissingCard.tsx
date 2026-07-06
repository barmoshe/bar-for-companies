'use client';

import { useLang } from '@/lib/LangContext';
import type { Dict } from '@/lib/i18n';

const EMAIL = 'Barprojectsandbuilds@gmail.com';

export function missingMailto(t: Dict, company?: string) {
  return `mailto:${EMAIL}?subject=${encodeURIComponent(t.missing.mailSubject(company))}`;
}

export function MissingCard({ company }: { company?: string }) {
  const { t } = useLang();
  return (
    <a className="card card-missing" href={missingMailto(t, company)}>
      <div className="card-frame card-missing-frame">
        <div className="card-media card-missing-media" aria-hidden="true">
          <span className="smallcaps card-missing-mark">{t.missing.mark}</span>
        </div>
      </div>
      <div className="card-plaque">
        <h2 className="card-company">{t.missing.title}</h2>
        <p className="card-tagline">{t.missing.note}</p>
        <span className="card-missing-cta smallcaps">{t.missing.cta}</span>
      </div>
    </a>
  );
}
