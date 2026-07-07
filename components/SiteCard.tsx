'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useLang } from '@/lib/LangContext';
import type { Site } from '@/lib/sites';
import { logoOf, shotOf } from '@/lib/sites';

export function SiteCard({ site, hits }: { site: Site; hits: number }) {
  const { t, lang } = useLang();
  const [count, setCount] = useState(hits);
  const tileStyle = {
    '--accent': site.accent,
    ...(site.tile ? { background: site.tile } : {}),
  } as React.CSSProperties;

  // Every click is a hit: bump the badge immediately, then record it globally.
  // Fire-and-forget with keepalive so the request survives the new-tab open.
  const recordHit = () => {
    setCount((c) => c + 1);
    void fetch('/api/hits', {
      method: 'POST',
      keepalive: true,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ id: site.id }),
    }).catch(() => {});
  };

  return (
    <a
      className="card"
      href={site.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t.card.aria(site.company)}
      style={{ '--accent': site.accent } as React.CSSProperties}
      onClick={recordHit}
      onAuxClick={recordHit}
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
            sizes="(max-width: 720px) 100vw, (max-width: 1099px) 33vw, (max-width: 1359px) 24vw, (max-width: 1619px) 19vw, (max-width: 1879px) 16vw, 250px"
            loading="lazy"
          />
          <span className="card-visit smallcaps" aria-hidden="true">
            {t.card.visit}
          </span>
          <span className="card-hits smallcaps" aria-label={t.card.hits(count)}>
            <svg
              className="card-hits-icon"
              width="11"
              height="11"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5Z"
                stroke="currentColor"
                strokeWidth="1.4"
              />
              <circle cx="8" cy="8" r="2.1" fill="currentColor" />
            </svg>
            <span aria-hidden="true">{count.toLocaleString(lang)}</span>
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
