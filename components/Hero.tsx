import './hero.css';

export function Hero({ count }: { count: number }) {
  return (
    <header className="hero">
      <div className="container">
        <div className="hero-masthead hero-reveal" style={{ '--i': 0 } as React.CSSProperties}>
          <p className="smallcaps hero-wordmark">
            Bar Moshe <span aria-hidden="true">&middot;</span> Application
            Gallery
          </p>
          <p className="smallcaps hero-stamp">
            Cat. {count} works <span aria-hidden="true">&middot;</span> all
            live
          </p>
        </div>
        <div className="hero-rule" aria-hidden="true" />
        <h1
          className="hero-title hero-reveal"
          style={{ '--i': 1 } as React.CSSProperties}
        >
          When I apply somewhere,
          <br />I build the company <em>a site first.</em>
        </h1>
        <p
          className="hero-lead hero-reveal"
          style={{ '--i': 2 } as React.CSSProperties}
        >
          Each plate below is a real application: a one-page site rebuilt in
          that company&apos;s own visual language, with my work inside it.
          Hover or tap a plate to see the site, then open it live.
        </p>
      </div>
    </header>
  );
}
