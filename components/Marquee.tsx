'use client';

import { useLang } from '@/lib/LangContext';
import './marquee.css';

export function Marquee({ items }: { items: string[] }) {
  const { t } = useLang();
  const row = items.join('  ·  ');
  return (
    // Company names are English, and the translateX keyframe assumes an LTR
    // flex track, so the strip stays LTR even on the Hebrew page.
    <div dir="ltr" className="marquee" aria-label={t.marquee.label(items.join(', '))}>
      <div className="marquee-track">
        <span className="marquee-row smallcaps">{row}</span>
        <span className="marquee-row smallcaps" aria-hidden="true">
          {row}
        </span>
      </div>
    </div>
  );
}
