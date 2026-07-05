import './hero.css';

export function Hero({ count }: { count: number }) {
  return (
    <header className="hero">
      <div className="container hero-inner">
        <p className="hero-kicker">
          <span className="hero-pill">Bar Moshe</span>
          <span className="hero-count">{count} sites, all live</span>
        </p>
        <h1 className="hero-title">
          When I apply somewhere, I build the company a site first.
        </h1>
        <p className="hero-lead">
          Each card below is a real application: a one-page site rebuilt in that
          company&apos;s own visual language, with my work inside it. Hover a
          logo to preview the site, click to open it live.
        </p>
      </div>
    </header>
  );
}
