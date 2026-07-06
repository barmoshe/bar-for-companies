import { HomePage } from '../../HomePage';

// Every visit deals a fresh hand, so the page shuffles per request.
export const dynamic = 'force-dynamic';

export default function Page() {
  return <HomePage initialLang="he" />;
}
