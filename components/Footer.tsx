'use client';

import { useLang } from '@/lib/LangContext';
import { STUDIO_URL } from '@/lib/i18n';
import './footer.css';

export function Footer() {
  const { t, lang } = useLang();
  const links = [
    { label: t.footer.studioLabel, href: STUDIO_URL[lang] },
    { label: 'GitHub', href: 'https://github.com/barmoshe' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/barmoshe' },
  ];
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <p className="smallcaps footer-colophon">{t.footer.colophon}</p>
        <p className="footer-note">{t.footer.note}</p>
        <nav className="footer-links" aria-label={t.footer.elsewhereLabel}>
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {l.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
