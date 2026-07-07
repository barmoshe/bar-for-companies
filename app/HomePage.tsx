import { AppShell } from '@/components/AppShell';
import { getAllHits } from '@/lib/hits';
import type { Lang } from '@/lib/i18n';
import { SITES, type Site } from '@/lib/sites';

// Household names that can carry the opening slot.
const GIANTS = new Set([
  'facebook',
  'apple',
  'google',
  'monday',
  'jfrog',
  'datadog',
  'tenable',
  'deloitte',
]);

function shuffle(sites: Site[]): Site[] {
  const deck = [...sites];
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

/**
 * The one gallery page, shared by both locale routes. Server component so
 * the per-request shuffle keeps dealing a fresh hand; everything below the
 * shuffle is the client AppShell, which owns the language state.
 */
export async function HomePage({ initialLang }: { initialLang: Lang }) {
  const sites = shuffle(SITES);
  // Lead with a random giant; the rest of the wall stays shuffled.
  const lead = sites.findIndex((s) => GIANTS.has(s.id));
  if (lead > 0) {
    const [giant] = sites.splice(lead, 1);
    sites.unshift(giant);
  }
  // Per-card click counts, read server-side so the badges paint with no flash.
  const counts = await getAllHits();
  return <AppShell sites={sites} initialLang={initialLang} counts={counts} />;
}
