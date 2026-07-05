import { ImageResponse } from 'next/og';
import { SITES } from '@/lib/sites';

// Rendered by next/og (Satori): flexbox-only CSS, plain hex colours.
export const alt =
  'bar for companies: the gallery of my job-application sites';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const PAPER = '#f6f4ee';
const INK = '#24252f';
const ACCENT = '#2745d4';

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
          background: PAPER,
          color: INK,
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 22,
              fontWeight: 600,
              letterSpacing: 3,
              textTransform: 'uppercase',
            }}
          >
            <div style={{ display: 'flex' }}>
              Bar Moshe &middot; Application Gallery
            </div>
            <div style={{ display: 'flex', color: '#6c6d78' }}>
              all works live
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
            }}
          >
            <div style={{ display: 'flex', height: 2, background: INK }} />
            <div style={{ display: 'flex', height: 1, background: INK }} />
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            fontSize: 60,
            fontWeight: 700,
            lineHeight: 1.12,
            maxWidth: 1000,
          }}
        >
          <div style={{ display: 'flex' }}>When I apply somewhere,</div>
          <div style={{ display: 'flex' }}>
            I build the company&nbsp;
            <span style={{ color: ACCENT }}>a site first.</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          {accents.map((accent, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                width: 62,
                height: 62,
                background: '#fdfdfb',
                border: '1px solid #d9d6cc',
                padding: 8,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  width: '100%',
                  height: '100%',
                  background: accent,
                }}
              />
            </div>
          ))}
        </div>
      </div>
    ),
    size
  );
}
