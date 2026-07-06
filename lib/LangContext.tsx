'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { type Dict, type Lang, DIR, getDict } from './i18n';

/**
 * Stateful language provider, ported from the bar_builds site. Cooperates
 * with the inline pre-paint script (lib/prepaint.ts), which resolves bm:lang
 * before first paint and exposes the result on window.__bmLang so React
 * mounts in the correct locale with no FOUC.
 *
 * The fallbacks in readClientLang only fire if the pre-paint script itself
 * failed (e.g., localStorage blocked by an extension) - they keep the page
 * bilingual even in that degraded state.
 */

const STORAGE_KEY = 'bm:lang';

type LangContextValue = {
  t: Dict;
  lang: Lang;
  setLang: (next: Lang) => void;
};

const Ctx = createContext<LangContextValue | null>(null);

function readClientLang(fallback: Lang): Lang {
  if (typeof window === 'undefined') return fallback;
  const seeded = window.__bmLang;
  if (seeded === 'en' || seeded === 'he') return seeded;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === 'en' || stored === 'he') return stored;
  } catch {
    /* ignore */
  }
  return fallback;
}

function persist(lang: Lang): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    /* ignore */
  }
}

function applyToDocument(lang: Lang, dict: Dict): void {
  const html = document.documentElement;
  html.lang = lang;
  html.dir = DIR[lang];
  document.title = dict.meta.title;
  const meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
  if (meta) meta.content = dict.meta.description;
}

export function LangProvider({
  initialLang,
  children,
}: {
  initialLang: Lang;
  children: ReactNode;
}) {
  // Start from the SSR-supplied canonical language so server and first client
  // render agree, then reconcile with the pre-paint-resolved language.
  const [lang, setLang] = useState<Lang>(initialLang);
  const dict = getDict(lang);

  useEffect(() => {
    const resolved = readClientLang(initialLang);
    // The client language is seeded by the pre-paint script and only readable
    // post-mount (not during SSR), so this in-effect setState is intentional.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLang((cur) => (cur === resolved ? cur : resolved));
  }, [initialLang]);

  useEffect(() => {
    applyToDocument(lang, dict);
  }, [lang, dict]);

  const setLangAndPersist = useCallback((next: Lang) => {
    setLang(next);
    persist(next);
  }, []);

  const value = useMemo<LangContextValue>(
    () => ({ t: dict, lang, setLang: setLangAndPersist }),
    [dict, lang, setLangAndPersist],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useLang(): LangContextValue {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useLang must be used inside <LangProvider>');
  return ctx;
}
