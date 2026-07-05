const EMAIL = 'Barprojectsandbuilds@gmail.com';

export function MissingCard({ company }: { company?: string }) {
  const subject = company
    ? `A bar-for site for ${company}`
    : 'A bar-for site for my company';
  const href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}`;
  return (
    <a className="card card-missing" href={href}>
      <div className="card-media card-missing-media" aria-hidden="true">
        <span className="card-missing-mark">?</span>
      </div>
      <div className="card-meta">
        <div>
          <h2 className="card-company">Your company missing?</h2>
          <p className="card-role">Let me know</p>
        </div>
      </div>
      <p className="card-tagline">
        Tell me where you work and I&apos;ll build yours next, usually within a
        day or two.
      </p>
    </a>
  );
}
