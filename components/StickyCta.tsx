'use client';

import { useState } from 'react';
import { useLang } from '@/lib/LangContext';
import { missingMailto } from './MissingCard';
import './sticky-cta.css';

export function StickyCta() {
  const { t } = useLang();
  const [open, setOpen] = useState(true);
  if (!open) return null;
  return (
    <div className="sticky-cta" role="complementary" aria-label={t.sticky.regionLabel}>
      <p className="sticky-cta-text">{t.sticky.text}</p>
      <a className="cta cta-primary sticky-cta-btn" href={missingMailto(t)}>
        {t.sticky.cta}
      </a>
      <button
        type="button"
        className="sticky-cta-close"
        aria-label={t.sticky.dismiss}
        onClick={() => setOpen(false)}
      >
        &times;
      </button>
    </div>
  );
}
