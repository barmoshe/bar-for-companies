import { ImageResponse } from 'next/og';
import { SITES } from '@/lib/sites';

// Rendered by next/og (Satori): flexbox-only CSS, plain hex colours.
export const alt =
  'bar for companies: the gallery of my job-application sites';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
  const accents = SITES.map((s) => s.accent)
    .filter((a) => a.startsWith('#'))
    .slice(0, 12);
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 72,
          background: '#faf9f6',
          color: '#22232e',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            fontSize: 26,
            fontWeight: 600,
            letterSpacing: 2,
            textTransform: 'uppercase',
          }}
        >
          <div
            style={{
              display: 'flex',
              padding: '10px 26px',
              border: '2px solid #22232e',
              borderRadius: 999,
            }}
          >
            Bar Moshe
          </div>
          <div style={{ display: 'flex', color: '#6b6d7a' }}>
            bar for companies
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 62,
            fontWeight: 700,
            lineHeight: 1.15,
            maxWidth: 980,
          }}
        >
          When I apply somewhere, I build the company a site first.
        </div>
        <div style={{ display: 'flex', gap: 14 }}>
          {accents.map((accent, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                width: 64,
                height: 64,
                borderRadius: 14,
                background: accent,
                border: '1px solid rgba(0,0,0,0.08)',
              }}
            />
          ))}
        </div>
      </div>
    ),
    size
  );
}
