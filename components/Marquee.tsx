import './marquee.css';

export function Marquee({ items }: { items: string[] }) {
  const row = items.join('  ·  ');
  return (
    <div className="marquee" aria-label={`In the catalogue: ${items.join(', ')}`}>
      <div className="marquee-track">
        <span className="marquee-row smallcaps">{row}</span>
        <span className="marquee-row smallcaps" aria-hidden="true">
          {row}
        </span>
      </div>
    </div>
  );
}
