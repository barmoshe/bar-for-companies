'use client';

import { useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { useGSAP } from '@gsap/react';
import { useLang } from '@/lib/LangContext';
import { STUDIO_URL } from '@/lib/i18n';
import type { Site } from '@/lib/sites';
import { gsap, Flip, HOUSE_EASE } from '@/lib/anim';
import { SiteCard } from './SiteCard';
import { MissingCard, missingMailto } from './MissingCard';
import { useCardSpotlight } from './useCardSpotlight';
import './gallery.css';

const matches = (site: Site, q: string) =>
  !q || site.company.toLowerCase().includes(q) || site.id.includes(q);

export function Gallery({
  sites,
  counts,
}: {
  sites: Site[];
  counts: Record<string, number>;
}) {
  const { t, lang } = useLang();
  const [query, setQuery] = useState('');
  const [sortByViews, setSortByViews] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLUListElement>(null);
  const filteredOnce = useRef(false);

  const q = query.trim().toLowerCase();
  const filtered = sites.filter((s) => matches(s, q));
  // Sort is a view over the filtered set; a stable sort keeps the shuffled
  // order among cards with equal counts. Counts are the page-load values.
  const visible = sortByViews
    ? [...filtered].sort((a, b) => (counts[b.id] ?? 0) - (counts[a.id] ?? 0))
    : filtered;

  // Entrance reveals are pure CSS scroll timelines now (develop-in in
  // gallery.css): plates develop as the wall scrolls, staggered by the
  // per-li --i below. CSS never hides the cards, so no-JS, reduced-motion,
  // and no-timeline-support users always see the grid.

  // Cursor paper highlight: one rAF-throttled pointermove writing CSS vars.
  useGSAP(
    () => {
      const grid = gridRef.current;
      if (!grid) return;
      if (
        !window.matchMedia('(hover: hover) and (pointer: fine)').matches ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ) {
        return;
      }
      let raf = 0;
      let last: PointerEvent | null = null;
      const onMove = (e: PointerEvent) => {
        last = e;
        if (raf) return;
        raf = requestAnimationFrame(() => {
          raf = 0;
          if (!last) return;
          const r = grid.getBoundingClientRect();
          grid.style.setProperty('--mx', `${last.clientX - r.left}px`);
          grid.style.setProperty('--my', `${last.clientY - r.top}px`);
          grid.style.setProperty('--spot-o', '1');
        });
      };
      const onLeave = () => grid.style.setProperty('--spot-o', '0');
      grid.addEventListener('pointermove', onMove);
      grid.addEventListener('pointerleave', onLeave);
      return () => {
        grid.removeEventListener('pointermove', onMove);
        grid.removeEventListener('pointerleave', onLeave);
        if (raf) cancelAnimationFrame(raf);
      };
    },
    { scope: sectionRef }
  );

  // GSAP lift + accent spotlight on the hovered/focused plate (replaces the
  // old CSS wall-dim; the rest of the wall stays fully lit).
  useCardSpotlight(gridRef);

  // Animate the grid reorder with Flip; fall back to a plain re-render on
  // touch layouts, reduced motion, or when the visible set is unchanged.
  // Animate any grid reorder (filter or sort) with Flip; fall back to a plain
  // re-render on touch layouts, reduced motion, or a missing grid.
  const flipReorder = (commit: () => void) => {
      const grid = gridRef.current;
      if (
        !grid ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
        window.matchMedia('(max-width: 720px)').matches
      ) {
        commit();
        return;
      }
      // Hand li ownership from the CSS development animation to Flip the
      // first time the wall reorders (gallery.css releases the animation on
      // [data-filtered]). Set before Flip.getState so the boxes are
      // measured with the animation released.
      if (!filteredOnce.current) {
        filteredOnce.current = true;
        grid.dataset.filtered = '';
      }
      const state = Flip.getState(grid.querySelectorAll(':scope > li'));
      flushSync(commit);
      Flip.from(state, {
        duration: 0.5,
        ease: HOUSE_EASE,
        absolute: true,
        onEnter: (els) =>
          gsap.fromTo(
            els,
            { autoAlpha: 0, y: 12 },
            { autoAlpha: 1, y: 0, duration: 0.35, ease: HOUSE_EASE }
          ),
        onLeave: (els) => gsap.to(els, { autoAlpha: 0, duration: 0.25 }),
      });
  };

  const applyFilter = (nextQuery: string, commit: () => void) => {
    // Skip the animation when the visible set is unchanged (e.g. typing a
    // character that filters nothing new).
    const nextQ = nextQuery.trim().toLowerCase();
    const sameSet =
      visible.length === sites.filter((s) => matches(s, nextQ)).length &&
      visible.every((s) => matches(s, nextQ));
    if (sameSet) {
      commit();
      return;
    }
    flipReorder(commit);
  };

  const toggleSort = () => flipReorder(() => setSortByViews((v) => !v));

  const onQuery = (v: string) => applyFilter(v, () => setQuery(v));
  const clear = () => {
    applyFilter('', () => setQuery(''));
    inputRef.current?.focus();
  };

  const filtering = q !== '';

  return (
    <section
      ref={sectionRef}
      className="gallery"
      aria-label={t.gallery.sectionLabel}
    >
      <div className="gallery-toolbar">
        <div className="gallery-toolbar-row">
          <p
            className="gallery-count smallcaps"
            role="status"
            aria-live="polite"
          >
            {filtering
              ? t.gallery.countFiltered(visible.length, sites.length)
              : t.gallery.count(sites.length)}
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
              dir="auto"
              placeholder={t.gallery.searchPlaceholder}
              aria-label={t.gallery.searchPlaceholder}
              value={query}
              onChange={(e) => onQuery(e.target.value)}
            />
            {query ? (
              <button
                type="button"
                className="gallery-clear"
                onClick={clear}
                aria-label={t.gallery.clearLabel}
              >
                &times;
              </button>
            ) : null}
          </div>
          <button
            type="button"
            className="gallery-sort smallcaps"
            onClick={toggleSort}
            aria-pressed={sortByViews}
            aria-label={t.gallery.sortLabel}
          >
            <svg
              className="gallery-sort-icon"
              width="13"
              height="13"
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
            {t.gallery.sortViewed}
          </button>
        </div>
      </div>
      {visible.length === 0 ? (
        <div className="gallery-empty">
          <p className="gallery-empty-kicker smallcaps">
            {t.gallery.emptyKicker}
          </p>
          <p className="gallery-empty-lead">{t.gallery.emptyLead(query.trim())}</p>
          <p className="gallery-empty-note">{t.gallery.emptyNote}</p>
          <div className="gallery-empty-actions">
            <a
              className="cta cta-primary"
              href={missingMailto(t, query.trim())}
            >
              {t.gallery.emptyBuild}
            </a>
            <button type="button" className="cta cta-ghost" onClick={clear}>
              {t.gallery.emptyShowAll}
            </button>
          </div>
          <p className="gallery-empty-aside">
            {t.gallery.asidePre}
            <a href={STUDIO_URL[lang]} target="_blank" rel="noopener noreferrer">
              {t.gallery.asideLink}
            </a>
            {t.gallery.asidePost}
          </p>
        </div>
      ) : (
        <ul ref={gridRef} className="gallery-grid">
          {visible.map((site, i) => (
            <li
              key={site.id}
              data-flip-id={site.id}
              style={{ '--i': i % 4 } as React.CSSProperties}
            >
              <SiteCard site={site} hits={counts[site.id] ?? 0} />
            </li>
          ))}
          <li
            key="missing"
            data-flip-id="missing"
            style={{ '--i': visible.length % 4 } as React.CSSProperties}
          >
            <MissingCard />
          </li>
        </ul>
      )}
    </section>
  );
}
