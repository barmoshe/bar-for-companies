import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 3 });
await p.goto('https://imagen-ai.com/', { waitUntil: 'networkidle' }).catch(()=>{});
await p.waitForTimeout(2000);
// find the homepage link in the header region and grab its svg/img
const cand = await p.evaluate(() => {
  const links = [...document.querySelectorAll('a[href="https://imagen-ai.com/"], a[href="/"]')];
  for (const a of links) {
    const r = a.getBoundingClientRect();
    if (r.top < 160 && r.width > 40 && r.height > 10) {
      return { x: r.x, y: r.y, w: r.width, h: r.height };
    }
  }
  return null;
});
if (!cand) { console.log('NO LOGO FOUND'); await b.close(); process.exit(2); }
const pad = 24;
await p.screenshot({ path: 'public/logos/imagen.png', clip: { x: Math.max(0,cand.x - pad), y: Math.max(0,cand.y - pad), width: cand.w + pad*2, height: cand.h + pad*2 } });
console.log('ok', JSON.stringify(cand));
await b.close();
