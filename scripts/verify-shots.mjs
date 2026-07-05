#!/usr/bin/env node
// Assert every site has a 1200px-wide, non-flat screenshot and a real logo.
import { existsSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const { SITES } = await loadSites();

let bad = 0;
const rows = [];
for (const site of SITES) {
  const shot = join(root, 'public', 'shots', `${site.id}.webp`);
  const logo = join(root, 'public', 'logos', `${site.id}.png`);
  const row = { id: site.id, shot: 'missing', logo: 'missing' };

  if (existsSync(shot)) {
    const meta = await sharp(shot).metadata();
    const { channels } = await sharp(shot).stats();
    const meanLum =
      (channels[0].mean + channels[1].mean + channels[2].mean) / 3 / 255;
    const maxStd = Math.max(...channels.slice(0, 3).map((c) => c.stdev));
    if (meta.width !== 1200) row.shot = `width ${meta.width}`;
    else if (meanLum < 0.08 && maxStd < 8) row.shot = 'flat/black';
    else row.shot = `ok (${Math.round(statSync(shot).size / 1024)}KB)`;
  }
  if (existsSync(logo)) {
    const size = statSync(logo).size;
    row.logo = size < 1500 ? `tiny ${size}b` : `ok (${Math.round(size / 1024)}KB)`;
  }
  if (!row.shot.startsWith('ok') || !row.logo.startsWith('ok')) bad += 1;
  rows.push(row);
}

console.table(rows);
console.log(`${SITES.length} sites, ${bad} with problems`);
process.exitCode = bad ? 1 : 0;

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
