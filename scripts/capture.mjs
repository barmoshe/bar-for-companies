#!/usr/bin/env node
// Capture each live bar-for-* site into public/shots/<id>.webp (1200px wide).
// Reduced-motion emulation keeps GSAP-heavy heroes at their settled state
// (animated pages otherwise capture black). Usage: node scripts/capture.mjs [id ...]
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(root, 'public', 'shots');
mkdirSync(OUT, { recursive: true });

const { SITES } = await loadSites();
const only = process.argv.slice(2);
const targets = only.length ? SITES.filter((s) => only.includes(s.id)) : SITES;

const browser = await chromium.launch();
const failures = [];

for (const site of targets) {
  try {
    await capture(site, 2000);
    console.log(`ok    ${site.id}`);
  } catch {
    try {
      await capture(site, 5000); // retry with a longer settle
      console.log(`ok    ${site.id} (retry)`);
    } catch (err2) {
      failures.push(site.id);
      console.log(`FAIL  ${site.id}: ${err2.message}`);
    }
  }
}

await browser.close();
if (failures.length) {
  console.log(`\nfailed: ${failures.join(', ')}`);
  process.exitCode = 1;
} else {
  console.log(`\ncaptured ${targets.length} sites`);
}

async function capture(site, settleMs) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
    reducedMotion: 'reduce',
  });
  const page = await context.newPage();
  try {
    const res = await page.goto(site.url, {
      waitUntil: 'networkidle',
      timeout: 45000,
    });
    if (!res || !res.ok()) {
      throw new Error(`HTTP ${res ? res.status() : 'no response'}`);
    }
    await page.waitForTimeout(settleMs);
    // Verify via DOM, not pixels: the page must have rendered real content.
    const textLen = await page.evaluate(
      () => document.body.innerText.trim().length
    );
    if (textLen < 100) throw new Error(`page looks empty (text=${textLen})`);

    const png = await page.screenshot({ type: 'png' });
    const webp = await sharp(png).resize({ width: 1200 }).webp({ quality: 82 });
    const buf = await webp.toBuffer();

    // Flat/black frame check on the actual output.
    const { channels } = await sharp(buf).stats();
    const meanLum =
      (channels[0].mean + channels[1].mean + channels[2].mean) / 3 / 255;
    const maxStd = Math.max(...channels.slice(0, 3).map((c) => c.stdev));
    if (meanLum < 0.08 && maxStd < 8) {
      throw new Error(`frame looks black (lum=${meanLum.toFixed(3)})`);
    }

    await sharp(buf).toFile(join(OUT, `${site.id}.webp`));
  } finally {
    await context.close();
  }
}

async function loadSites() {
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
