'use client';

import { useRef, useState } from 'react';
import type { Site } from '@/lib/sites';
import { SiteCard } from './SiteCard';
import { MissingCard, missingMailto } from './MissingCard';
import { PreviewSheet } from './PreviewSheet';
import './gallery.css';

export function Gallery({ sites }: { sites: Site[] }) {
  const [query, setQuery] = useState('');
  const [preview, setPreview] = useState<Site | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const q = query.trim().toLowerCase();
  const visible = q
    ? sites.filter(
        (s) => s.company.toLowerCase().includes(q) || s.id.includes(q)
      )
    : sites;

  const clear = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  const sitesWord = (n: number) => (n === 1 ? 'site' : 'sites');

  return (
    <section className="gallery container" aria-label="Application sites">
      <div className="gallery-toolbar">
        <p className="gallery-count smallcaps" role="status" aria-live="polite">
          {q
            ? `${visible.length} of ${sites.length} ${sitesWord(sites.length)}`
            : `${sites.length} ${sitesWord(sites.length)}`}
        </p>
        <div className="gallery-field">
          <svg
            className="gallery-field-icon"
            aria-hidden="true"
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
          >
            <circle
              cx="6.5"
              cy="6.5"
              r="4.75"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M10.3 10.3 13.5 13.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          <input
            ref={inputRef}
            className="gallery-search"
            type="search"
            placeholder="Search your company"
            aria-label="Search your company"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query ? (
            <button
              type="button"
              className="gallery-clear"
              onClick={clear}
              aria-label="Clear search"
            >
              &times;
            </button>
          ) : null}
        </div>
      </div>
      {visible.length === 0 ? (
        <div className="gallery-empty">
          <p className="gallery-empty-kicker smallcaps">
            Not in the catalogue yet
          </p>
          <p className="gallery-empty-lead">
            No site for &quot;{query.trim()}&quot; yet. That could change
            quickly.
          </p>
          <p className="gallery-empty-note">
            Tell me where you work and I&apos;ll build yours next, usually
            within a day or two.
          </p>
          <div className="gallery-empty-actions">
            <a
              className="gallery-cta gallery-cta-primary"
              href={missingMailto(query.trim())}
            >
              Ask me to build it
            </a>
            <button
              type="button"
              className="gallery-cta gallery-cta-ghost"
              onClick={clear}
            >
              Show all sites
            </button>
          </div>
          <p className="gallery-empty-aside">
            Or see how I work on my{' '}
            <a
              href="https://bar-builds.vercel.app/en"
              target="_blank"
              rel="noopener noreferrer"
            >
              studio site
            </a>
            .
          </p>
        </div>
      ) : (
        <ul className="gallery-grid">
          {visible.map((site) => (
            <li key={site.id}>
              <SiteCard
                site={site}
                number={sites.indexOf(site) + 1}
                onPreview={setPreview}
              />
            </li>
          ))}
          <li>
            <MissingCard />
          </li>
        </ul>
      )}
      {preview ? (
        <PreviewSheet site={preview} onClose={() => setPreview(null)} />
      ) : null}
    </section>
  );
}
