const EMAIL = 'Barprojectsandbuilds@gmail.com';

export function MissingCard({ company }: { company?: string }) {
  const subject = company
    ? `A bar-for site for ${company}`
    : 'A bar-for site for my company';
  const href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}`;
  return (
    <a className="card card-missing" href={href}>
      <span className="card-number smallcaps" aria-hidden="true">
        No ??
      </span>
      <div className="card-frame card-missing-frame">
        <div className="card-media card-missing-media" aria-hidden="true">
          <span className="smallcaps card-missing-mark">
            this frame is reserved
          </span>
        </div>
      </div>
      <div className="card-plaque">
        <h2 className="card-company">Your company missing?</h2>
        <p className="card-tagline">
          Tell me where you work and I&apos;ll build yours next, usually within
          a day or two.
        </p>
      </div>
    </a>
  );
}
