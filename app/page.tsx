import { Footer } from '@/components/Footer';
import { Gallery } from '@/components/Gallery';
import { Hero } from '@/components/Hero';
import { StickyCta } from '@/components/StickyCta';
import { SITES, type Site } from '@/lib/sites';

// Every visit deals a fresh hand, so the page shuffles per request.
export const dynamic = 'force-dynamic';

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

export default function Page() {
  const sites = shuffle(SITES);
  // Lead with a random giant; the rest of the wall stays shuffled.
  const lead = sites.findIndex((s) => GIANTS.has(s.id));
  if (lead > 0) {
    const [giant] = sites.splice(lead, 1);
    sites.unshift(giant);
  }
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to the gallery
      </a>
      <Hero count={sites.length} names={sites.map((s) => s.company)} />
      <main id="main" tabIndex={-1}>
        <Gallery sites={sites} />
      </main>
      <Footer />
      <StickyCta />
    </>
  );
}
