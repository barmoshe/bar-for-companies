'use client';

import { useState } from 'react';
import { missingMailto } from './MissingCard';
import './sticky-cta.css';

export function StickyCta() {
  const [open, setOpen] = useState(true);
  if (!open) return null;
  return (
    <div className="sticky-cta" role="complementary" aria-label="Get a site built">
      <p className="sticky-cta-text">Your company missing?</p>
      <a className="cta cta-primary sticky-cta-btn" href={missingMailto()}>
        Email me
      </a>
      <button
        type="button"
        className="sticky-cta-close"
        aria-label="Dismiss"
        onClick={() => setOpen(false)}
      >
        &times;
      </button>
    </div>
  );
}
