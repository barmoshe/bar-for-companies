# bar-for-companies

Gallery of my bar-for-X job-application sites: one card per company, the
company's logo on a brand-tinted tile, the live site's screenshot on
hover/focus (always visible on touch), click opens the live site.

## Stack

- Next.js 16 + React 19 + TypeScript, plain scoped CSS with oklch tokens.
  No Tailwind. Same conventions as the other bar-for-* siblings.
- Data: `lib/sites.ts` is the single source of truth. Screenshots and logos
  are derived paths (`/shots/<id>.webp`, `/logos/<id>.png`).
- Workshop folder: `bar_builds/lab/bar-for-companies/` (STATUS, brief, scope).

## Adding a new application

1. Add one entry to `lib/sites.ts` (id = the bar-for-<id> repo suffix).
2. `npm run logos -- <id>` and `npm run shots -- <id>`.
3. `npm run verify-shots`, commit, `npx vercel --prod`.

## Rules

- qbiq's live URL is `https://bar-for-qbit.vercel.app` (canonical typo, never
  "fix" it).
- Copy: first person, plain, no em dashes, no years-of-experience numbers,
  no "senior" claims, never hardcode the site count (compute from SITES).
- Logos are the companies' real marks, fetched once into public/logos/ and
  committed; editorial/nominative use, removed on request. A hand-dropped
  logo file wins over the fetch script (it skips existing files).
- Screenshots capture with reducedMotion: 'reduce' so animated heroes render
  settled instead of black; verify via DOM text length, not pixels.
- The gallery wall's hover effect is a GSAP lift+spotlight (`useCardSpotlight`):
  only the hovered plate moves, lifting with an accent glow while the rest of
  the wall stays fully lit. The old CSS wall-dim (fading every other tile) was
  dropped. `npm run verify-gallery` asserts this against a build (`npm run
  build` first) alongside the column ramp, keyboard/RTL parity, filter, and
  mobile feed.
