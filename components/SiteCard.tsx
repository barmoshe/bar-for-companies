'use client';

import Image from 'next/image';
import type { Site } from '@/lib/sites';
import { logoOf, shotOf } from '@/lib/sites';

export function SiteCard({
  site,
  number,
  onPreview,
}: {
  site: Site;
  number: number;
  onPreview?: (site: Site) => void;
}) {
  const tileStyle = {
    '--accent': site.accent,
    ...(site.tile ? { background: site.tile } : {}),
  } as React.CSSProperties;

  const handleClick = (e: React.MouseEvent) => {
    // Touch devices get a preview sheet first; desktop opens the site.
    if (onPreview && window.matchMedia('(hover: none)').matches) {
      e.preventDefault();
      onPreview(site);
    }
  };

  return (
    <a
      className="card"
      href={site.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`bar for ${site.company}, opens a preview of the live site`}
      onClick={handleClick}
      style={{ '--accent': site.accent } as React.CSSProperties}
    >
      <span className="card-number smallcaps" aria-hidden="true">
        No {String(number).padStart(2, '0')}
      </span>
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
            alt={`Screenshot of the bar-for-${site.id} site`}
            width={1200}
            height={750}
            loading="lazy"
          />
          <span className="card-visit smallcaps" aria-hidden="true">
            visit live
          </span>
        </div>
      </div>
      <div className="card-plaque">
        <h2 className="card-company">{site.company}</h2>
        <p className="card-tagline">{site.tagline}</p>
      </div>
    </a>
  );
}
