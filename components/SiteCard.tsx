'use client';

import Image from 'next/image';
import { useLang } from '@/lib/LangContext';
import type { Site } from '@/lib/sites';
import { logoOf, shotOf } from '@/lib/sites';

export function SiteCard({ site }: { site: Site }) {
  const { t } = useLang();
  const tileStyle = {
    '--accent': site.accent,
    ...(site.tile ? { background: site.tile } : {}),
  } as React.CSSProperties;

  return (
    <a
      className="card"
      href={site.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t.card.aria(site.company)}
      style={{ '--accent': site.accent } as React.CSSProperties}
    >
      <div className="card-frame">
        <div className="card-media" style={tileStyle}>
          <div className="card-face" style={tileStyle} aria-hidden="true">
            <Image
              className="card-logo"
              src={logoOf(site)}
              alt=""
              width={72}
              height={72}
              loading="lazy"
            />
          </div>
          <Image
            className="card-shot"
            src={shotOf(site)}
            alt={t.card.shotAlt(site.id)}
            width={1200}
            height={750}
            sizes="(max-width: 720px) 100vw, (max-width: 1240px) 33vw, 380px"
            loading="lazy"
          />
          <span className="card-visit smallcaps" aria-hidden="true">
            {t.card.visit}
          </span>
        </div>
      </div>
      <div className="card-plaque">
        {/* company names and taglines are catalogue copy and stay English */}
        <div className="card-plaque-text" lang="en" dir="ltr">
          <h2 className="card-company">{site.company}</h2>
          <p className="card-tagline">{site.tagline}</p>
        </div>
        <span className="card-go smallcaps" aria-hidden="true">
          {t.card.go}
        </span>
      </div>
    </a>
  );
}
