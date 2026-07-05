import './footer.css';

const LINKS = [
  { label: 'My studio site', href: 'https://bar-builds.vercel.app/en' },
  { label: 'GitHub', href: 'https://github.com/barmoshe' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/barmoshe' },
];

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <p className="footer-note">
          I&apos;m Bar. I build working software fast, and I&apos;d rather show
          it than describe it. If one of these landed with you, let&apos;s talk.
        </p>
        <nav className="footer-links" aria-label="Elsewhere">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer">
              {l.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
