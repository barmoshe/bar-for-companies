'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import type { Site } from '@/lib/sites';
import { logoOf, shotOf } from '@/lib/sites';

export function PreviewSheet({
  site,
  onClose,
}: {
  site: Site;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div
        className="sheet"
        role="dialog"
        aria-modal="true"
        aria-label={`Preview of the bar-for-${site.id} site`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sheet-head">
          <Image
            className="card-badge"
            src={logoOf(site)}
            alt=""
            width={28}
            height={28}
          />
          <span className="sheet-company">{site.company}</span>
          <button
            ref={closeRef}
            type="button"
            className="sheet-close"
            onClick={onClose}
            aria-label="Close preview"
          >
            &times;
          </button>
        </div>
        <div className="sheet-shot-wrap">
          <Image
            className="sheet-shot"
            src={shotOf(site)}
            alt={`Screenshot of the bar-for-${site.id} site`}
            width={1200}
            height={750}
          />
        </div>
        <p className="sheet-tagline">{site.tagline}</p>
        <a
          className="sheet-visit"
          href={site.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          Visit the live site
        </a>
      </div>
    </div>
  );
}
