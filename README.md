# bar for companies

When I apply somewhere, I build the company a site first: a one-page
application site rebuilt in that company's own visual language, with my work
inside it. This repo is the gallery of all of them, live at
[bar-for-companies.vercel.app](https://bar-for-companies.vercel.app).

Each card shows the company's logo; hover (or focus) reveals a screenshot of
the live site, and clicking opens it. On touch screens the screenshot is
always visible.

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
