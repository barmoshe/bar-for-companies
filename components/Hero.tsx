'use client';

import { useLang } from '@/lib/LangContext';
import { missingMailto } from './MissingCard';
import { LangToggle } from './LangToggle';
import { Marquee } from './Marquee';
import './hero.css';

export function Hero({ count, names }: { count: number; names: string[] }) {
  const { t } = useLang();
  return (
    <header className="hero">
      <div className="container">
        <div className="hero-masthead hero-reveal" style={{ '--i': 0 } as React.CSSProperties}>
          <p className="smallcaps hero-wordmark">
            {t.hero.wordmarkName} <span aria-hidden="true">&middot;</span>{' '}
            {t.hero.wordmarkRole}
          </p>
          <div className="hero-masthead-end">
            <p className="smallcaps hero-stamp">
              {t.hero.stampWorks(count)} <span aria-hidden="true">&middot;</span>{' '}
              {t.hero.stampLive}
            </p>
            <LangToggle />
          </div>
        </div>
        <div className="hero-rule" aria-hidden="true" />
        <h1
          className="hero-title hero-reveal"
          style={{ '--i': 1 } as React.CSSProperties}
        >
          {t.hero.titleLine1}
          <br />
          {t.hero.titleLine2}
          <em>{t.hero.titleEm}</em>
        </h1>
        <p
          className="hero-lead hero-reveal"
          style={{ '--i': 2 } as React.CSSProperties}
        >
          {t.hero.lead}
        </p>
        <div
          className="hero-cta hero-reveal"
          style={{ '--i': 3 } as React.CSSProperties}
        >
          <p className="smallcaps hero-cta-kicker">{t.hero.kicker}</p>
          <div className="hero-cta-actions">
            <a className="cta cta-primary" href={missingMailto(t)}>
              {t.hero.ctaBuild}
            </a>
            <a className="cta cta-ghost" href="#main">
              {t.hero.ctaBrowse}
            </a>
          </div>
        </div>
        <div
          className="hero-marquee hero-reveal"
          style={{ '--i': 4 } as React.CSSProperties}
        >
          <Marquee items={names} />
        </div>
        <a
          className="hero-scroll-cue smallcaps"
          href="#main"
          aria-hidden="true"
          tabIndex={-1}
        >
          {t.hero.scroll}
        </a>
      </div>
    </header>
  );
}
