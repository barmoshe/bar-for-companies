import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

const PAPER = '#f6f4ee';
const INK = '#24252f';
const ACCENT = '#2745d4';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: PAPER,
          border: `2px solid ${INK}`,
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: 20,
            fontWeight: 700,
            color: ACCENT,
          }}
        >
          B
        </div>
      </div>
    ),
    size
  );
}
