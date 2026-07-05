const EMAIL = 'Barprojectsandbuilds@gmail.com';

export function missingMailto(company?: string) {
  const subject = company
    ? `A bar-for site for ${company}`
    : 'A bar-for site for my company';
  return `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}`;
}

export function MissingCard({ company }: { company?: string }) {
  return (
    <a className="card card-missing" href={missingMailto(company)}>
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
        <span className="card-missing-cta smallcaps">Email me</span>
      </div>
    </a>
  );
}
