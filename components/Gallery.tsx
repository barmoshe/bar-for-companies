'use client';

import { useState } from 'react';
import type { RoleType, Site } from '@/lib/sites';
import { SiteCard } from './SiteCard';
import { MissingCard } from './MissingCard';
import { PreviewSheet } from './PreviewSheet';
import './gallery.css';

type Filter = 'all' | RoleType;

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'ai', label: 'AI Engineering' },
  { key: 'fullstack', label: 'Full Stack' },
  { key: 'other', label: 'More' },
];

export function Gallery({ sites }: { sites: Site[] }) {
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');
  const [preview, setPreview] = useState<Site | null>(null);

  const q = query.trim().toLowerCase();
  const visible = sites.filter((s) => {
    if (filter !== 'all' && s.roleType !== filter) return false;
    if (!q) return true;
    return s.company.toLowerCase().includes(q) || s.id.includes(q);
  });

  return (
    <section className="gallery container" aria-label="Application sites">
      <div className="gallery-toolbar">
        <div
          className="gallery-filters"
          role="group"
          aria-label="Filter by role"
        >
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              className="gallery-pill"
              aria-pressed={filter === f.key}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>
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
