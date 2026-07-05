#!/usr/bin/env node
// Fetch each company's actual logo mark into public/logos/<id>.png.
// Sources, in order: Clearbit logo API, the company site's apple-touch-icon,
// Google s2 favicons. Existing files are kept, so a hand-dropped logo wins.
// Usage: node scripts/logos.mjs [id ...]
import { existsSync, mkdirSync, writeFileSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(root, 'public', 'logos');
mkdirSync(OUT, { recursive: true });

const { SITES } = await loadSites();
const only = process.argv.slice(2);
const targets = only.length ? SITES.filter((s) => only.includes(s.id)) : SITES;

const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36';

// The s2 generic globe is a tiny file; anything this small is a miss.
const MIN_BYTES = 1500;

async function fetchBuf(url) {
  try {
    const res = await fetch(url, {
      headers: { 'user-agent': UA },
      redirect: 'follow',
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    return buf.length >= MIN_BYTES ? buf : null;
  } catch {
    return null;
  }
}

async function appleTouchIcon(domain) {
  for (const origin of [`https://www.${domain}`, `https://${domain}`]) {
    try {
      const res = await fetch(origin, {
        headers: { 'user-agent': UA },
        redirect: 'follow',
        signal: AbortSignal.timeout(15000),
      });
      if (!res.ok) continue;
      const html = await res.text();
      const m =
        html.match(
          /<link[^>]+rel=["'](?:apple-touch-icon[^"']*|icon)["'][^>]+href=["']([^"']+)["']/i
        ) ??
        html.match(
          /<link[^>]+href=["']([^"']+)["'][^>]+rel=["'](?:apple-touch-icon[^"']*|icon)["']/i
        );
      if (!m) continue;
      const href = new URL(m[1], res.url).href;
      const buf = await fetchBuf(href);
      if (buf) return buf;
    } catch {
      /* next origin */
    }
  }
  return null;
}

const failures = [];
for (const site of targets) {
  const out = join(OUT, `${site.id}.png`);
  if (existsSync(out) && statSync(out).size >= MIN_BYTES) {
    console.log(`skip  ${site.id} (exists)`);
    continue;
  }
  const buf =
    (await fetchBuf(`https://logo.clearbit.com/${site.domain}?size=256`)) ??
    (await appleTouchIcon(site.domain)) ??
    (await fetchBuf(
      `https://www.google.com/s2/favicons?domain=${site.domain}&sz=256`
    ));
  if (buf) {
    writeFileSync(out, buf);
    console.log(`ok    ${site.id} <- ${site.domain} (${buf.length}b)`);
  } else {
    failures.push(site.id);
    console.log(`FAIL  ${site.id} (${site.domain})`);
  }
}

if (failures.length) {
  console.log(`\n${failures.length} need hand-collection: ${failures.join(', ')}`);
  process.exitCode = 1;
} else {
  console.log('\nall logos present');
}

async function loadSites() {
  // lib/sites.ts is plain data; strip types so node can import it.
  const { readFileSync } = await import('node:fs');
  const src = readFileSync(join(root, 'lib', 'sites.ts'), 'utf8');
  const body = src
    .replace(/export type[\s\S]*?};\n/g, '')
    .replace(/: Site\[\]/, '')
    .replace(/export const logoOf[\s\S]*$/m, '');
  const dataUrl =
    'data:text/javascript;base64,' + Buffer.from(body).toString('base64');
  return import(dataUrl);
}
