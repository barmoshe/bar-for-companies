# bar for companies

When I apply somewhere, I build the company a site first: a one-page
application site rebuilt in that company's own visual language, with my work
inside it. This repo is the gallery of all of them, live at
[bar-for-companies.vercel.app](https://bar-for-companies.vercel.app).

Each card shows the company's logo; hover (or focus) wipes a screenshot of
the live site across the plate, which lifts off the wall with an accent glow,
and clicking opens it. On touch screens the screenshot is always visible.

## How it works

- `lib/sites.ts` holds one entry per application (company, role, live URL,
  brand accent, tagline).
- `scripts/logos.mjs` fetches each company's logo mark once into
  `public/logos/` (Clearbit logo API, then the site's apple-touch-icon, then
  Google's favicon service). Never hotlinked.
- `scripts/capture.mjs` screenshots every live site with Playwright
  (1440x900, reduced-motion so animated heroes render settled), then encodes
  1200px-wide webp files into `public/shots/`.
- `scripts/verify-shots.mjs` asserts every site has a real logo and a
  non-blank screenshot.
- `scripts/verify-gallery.mjs` boots the built app and asserts the wall
  behaves: the column ramp and breakout width, the hover lift+spotlight (the
  lit plate lifts with an accent glow while the rest of the wall stays fully
  lit), keyboard parity, RTL, the search filter, and the mobile feed. Run it
  against a build (`npm run build` first).

## Visit counter

Each card's badge counts real visits to that site, not gallery clicks. Every
`bar-for-*` site loads this repo's hosted `public/track.js` beacon (a `<script
data-bar-for-id="<id>">` tag in its `app/layout.tsx`), which POSTs one hit per
browser session to `/api/hits` here. The route is CORS-open (`*`), only
accepts ids that exist in `lib/sites.ts`, and stores counts in an Upstash Redis
hash (`gallery:hits`). The gallery card shows that stored count, bumped
optimistically on click for instant feedback.

```bash
npm install
npm run logos
npm run shots
npm run verify-shots
npm run dev
```

## Logo use

Company logos appear here to identify companies I genuinely applied to
(editorial, nominative use). If you own one of these marks and want it
removed, open an issue and I'll take it down.
