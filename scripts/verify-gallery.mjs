#!/usr/bin/env node
// Verify the gallery wall: column ramp, breakout width, hover/keyboard wipe
// parity, RTL, the develop-in scroll reveal, the search-filter handoff, and
// the mobile feed. Assumes `npm run build` ran; spawns its own `next start`.
// Usage: node scripts/verify-gallery.mjs [port]
import { spawn } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const PORT = Number(process.argv[2] ?? 4310);
const BASE = `http://localhost:${PORT}`;

let failures = 0;
const ok = (name) => console.log(`  ok  ${name}`);
const fail = (name, detail) => {
  failures += 1;
  console.error(`FAIL  ${name}${detail ? ` — ${detail}` : ''}`);
};
const assert = (cond, name, detail) => (cond ? ok(name) : fail(name, detail));

// --- boot the built app ---
const server = spawn('npx', ['next', 'start', '-p', String(PORT)], {
  cwd: root,
  stdio: 'ignore',
});
try {
  let up = false;
  for (let i = 0; i < 60 && !up; i++) {
    try {
      const res = await fetch(BASE);
      up = res.ok;
    } catch {
      await new Promise((r) => setTimeout(r, 500));
    }
  }
  if (!up) throw new Error(`server never came up on :${PORT}`);

  const browser = await chromium.launch();

  async function withPage(opts, fn) {
    const context = await browser.newContext(opts);
    const page = await context.newPage();
    try {
      await fn(page);
    } finally {
      await context.close();
    }
  }

  const openGallery = async (page, path = '/') => {
    await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle', timeout: 45000 });
    await page.locator('.gallery-grid').scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
  };

  // --- column ramp + breakout + overflow ---
  for (const [width, expected] of [
    [900, [2, 3]],
    [1100, [4]],
    [1400, [5]],
    [1700, [6]],
    [1920, [7]],
  ]) {
    await withPage({ viewport: { width, height: 900 } }, async (page) => {
      await openGallery(page);
      const { cols, wall, scrollW, innerW } = await page.evaluate(() => ({
        cols: getComputedStyle(document.querySelector('.gallery-grid'))
          .gridTemplateColumns.split(' ').length,
        wall: document.querySelector('.gallery').getBoundingClientRect().width,
        scrollW: document.scrollingElement.scrollWidth,
        innerW: window.innerWidth,
      }));
      assert(expected.includes(cols), `${width}px: ${expected.join('/')} cols`, `got ${cols}`);
      const expectedWall = Math.min(0.96 * width, 1760);
      if (width >= 1100) {
        assert(
          Math.abs(wall - expectedWall) < 2,
          `${width}px: wall ≈ ${Math.round(expectedWall)}px`,
          `got ${Math.round(wall)}px`,
        );
      }
      assert(scrollW <= innerW, `${width}px: no horizontal overflow`, `${scrollW} > ${innerW}`);
    });
  }

  // --- hover wipe + wall dim + develop-in + filter handoff (one page) ---
  await withPage({ viewport: { width: 1400, height: 900 } }, async (page) => {
    await openGallery(page);

    const animation = await page.evaluate(
      () => getComputedStyle(document.querySelector('.gallery-grid > li')).animationName,
    );
    const supports = await page.evaluate(() => CSS.supports('animation-timeline: view()'));
    if (supports) {
      assert(animation === 'develop-in', 'develop-in applied on li', animation);
    } else {
      console.log('  --  no animation-timeline support, skipping reveal check');
    }

    const firstCard = page.locator('.card').first();
    await firstCard.hover();
    await page.waitForTimeout(700);
    const { clip, siblingOpacity } = await page.evaluate(() => {
      const cards = [...document.querySelectorAll('.card')];
      return {
        clip: getComputedStyle(cards[0].querySelector('.card-shot')).clipPath,
        siblingOpacity: Number(getComputedStyle(cards[2]).opacity),
      };
    });
    assert(clip === 'inset(0px)' || clip === 'inset(0)', 'hover: shot wipes open', clip);
    assert(Math.abs(siblingOpacity - 0.55) < 0.05, 'hover: wall dims around the lit plate', String(siblingOpacity));

    // keyboard parity: drive real Tab presses until a card holds focus
    // (focus-visible needs real keyboard input, not element.focus()).
    let focusedClip = null;
    for (let i = 0; i < 40; i++) {
      await page.keyboard.press('Tab');
      focusedClip = await page.evaluate(() => {
        const el = document.activeElement;
        if (el && el.classList.contains('card')) {
          return getComputedStyle(el.querySelector('.card-shot')).clipPath;
        }
        return null;
      });
      if (focusedClip) break;
    }
    await page.waitForTimeout(700);
    if (focusedClip !== null) {
      const settled = await page.evaluate(
        () => getComputedStyle(document.activeElement.querySelector('.card-shot')).clipPath,
      );
      assert(
        settled === 'inset(0px)' || settled === 'inset(0)',
        'keyboard: shot wipes open on focus-visible',
        settled,
      );
    } else {
      fail('keyboard: could not reach a card via Tab');
    }

    // search filter handoff
    const total = await page.locator('.gallery-grid > li').count();
    await page.fill('.gallery-search', 'honeybook');
    await page.waitForTimeout(900);
    const { filteredCount, hasAttr } = await page.evaluate(() => ({
      filteredCount: document.querySelectorAll('.gallery-grid > li').length,
      hasAttr: document.querySelector('.gallery-grid').hasAttribute('data-filtered'),
    }));
    assert(filteredCount < total, 'filter: card count drops', `${filteredCount} vs ${total}`);
    assert(hasAttr, 'filter: data-filtered handoff set');
    await page.fill('.gallery-search', '');
    await page.waitForTimeout(900);
    const restored = await page.locator('.gallery-grid > li').count();
    assert(restored === total, 'filter: full wall restored', `${restored} vs ${total}`);
  });

  // --- RTL /he ---
  await withPage({ viewport: { width: 1400, height: 900 } }, async (page) => {
    await openGallery(page, '/he');
    const { dir, clip } = await page.evaluate(() => ({
      dir: document.documentElement.dir,
      clip: getComputedStyle(document.querySelector('.card-shot')).clipPath,
    }));
    assert(dir === 'rtl', '/he: dir=rtl', dir);
    assert(/inset\(0(px)? 0(px)? 0(px)? 100%\)/.test(clip), '/he: shot clip flipped', clip);
  });

  // --- reduced motion ---
  await withPage(
    { viewport: { width: 1400, height: 900 }, reducedMotion: 'reduce' },
    async (page) => {
      await openGallery(page);
      const { animation, opacity } = await page.evaluate(() => {
        const li = document.querySelector('.gallery-grid > li');
        return {
          animation: getComputedStyle(li).animationName,
          opacity: Number(getComputedStyle(li).opacity),
        };
      });
      assert(animation === 'none', 'reduced motion: no develop animation', animation);
      assert(opacity === 1, 'reduced motion: wall fully visible', String(opacity));
    },
  );

  // --- mobile feed intact ---
  await withPage({ viewport: { width: 375, height: 812 } }, async (page) => {
    await openGallery(page);
    const { display, shotPos, toolbar } = await page.evaluate(() => ({
      display: getComputedStyle(document.querySelector('.gallery-grid')).display,
      shotPos: getComputedStyle(document.querySelector('.card-shot')).position,
      toolbar: getComputedStyle(document.querySelector('.gallery-toolbar')).position,
    }));
    assert(display === 'block', '375px: feed layout', display);
    assert(shotPos === 'static', '375px: shots always visible', shotPos);
    assert(toolbar === 'sticky', '375px: sticky toolbar', toolbar);
  });

  await browser.close();
} finally {
  server.kill();
}

if (failures > 0) {
  console.error(`\n${failures} check(s) failed`);
  process.exit(1);
}
console.log('\nall checks passed');
