'use client';

import { useState } from 'react';
import type { Site } from '@/lib/sites';
import { SiteCard } from './SiteCard';
import { MissingCard } from './MissingCard';
import { PreviewSheet } from './PreviewSheet';
import './gallery.css';

export function Gallery({ sites }: { sites: Site[] }) {
  const [query, setQuery] = useState('');
  const [preview, setPreview] = useState<Site | null>(null);

  const q = query.trim().toLowerCase();
  const visible = q
    ? sites.filter(
        (s) => s.company.toLowerCase().includes(q) || s.id.includes(q)
      )
    : sites;

  return (
    <section className="gallery container" aria-label="Application sites">
      <div className="gallery-toolbar">
        <input
          className="gallery-search"
          type="search"
          placeholder="Search your company"
          aria-label="Search your company"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      {visible.length === 0 ? (
        <div className="gallery-empty">
          <p>
            No site for &quot;{query.trim()}&quot; yet. That could change
            quickly.
          </p>
          <MissingCard company={query.trim()} />
        </div>
      ) : (
        <ul className="gallery-grid">
          {visible.map((site) => (
            <li key={site.id}>
              <SiteCard site={site} onPreview={setPreview} />
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
