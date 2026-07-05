import Image from 'next/image';
import type { Site } from '@/lib/sites';
import { logoOf, shotOf } from '@/lib/sites';

export function SiteCard({ site, number }: { site: Site; number: number }) {
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
      aria-label={`bar for ${site.company}, opens the live site`}
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
            sizes="(max-width: 720px) 100vw, (max-width: 1240px) 33vw, 380px"
            loading="lazy"
          />
          <span className="card-visit smallcaps" aria-hidden="true">
            visit live
          </span>
        </div>
      </div>
      <div className="card-plaque">
        <div className="card-plaque-text">
          <h2 className="card-company">{site.company}</h2>
          <p className="card-tagline">{site.tagline}</p>
        </div>
        <span className="card-go smallcaps" aria-hidden="true">
          Visit the live site
        </span>
      </div>
    </a>
  );
}
