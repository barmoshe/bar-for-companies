import { Footer } from '@/components/Footer';
import { Gallery } from '@/components/Gallery';
import { Hero } from '@/components/Hero';
import { StickyCta } from '@/components/StickyCta';
import { SITES } from '@/lib/sites';

export default function Page() {
  const sites = [...SITES].sort((a, b) =>
    b.appliedOn.localeCompare(a.appliedOn)
  );
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
