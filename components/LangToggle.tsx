'use client';

import { useLang } from '@/lib/LangContext';

export function LangToggle() {
  const { lang, setLang, t } = useLang();
  return (
    <div className="lang-toggle" role="group" aria-label={t.toggle.label}>
      <button
        type="button"
        lang="en"
        aria-pressed={lang === 'en'}
        onClick={() => setLang('en')}
      >
        EN
      </button>
      <button
        type="button"
        lang="he"
        aria-pressed={lang === 'he'}
        onClick={() => setLang('he')}
      >
        עב
      </button>
    </div>
  );
}
