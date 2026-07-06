/**
 * The gallery's two-language dictionary. English is the canonical default
 * (served at /); Hebrew lives at /he and behind the in-page toggle. Count-
 * bearing strings are functions so pluralization stays in the dict and no
 * site count is ever hardcoded in prose.
 */

export type Lang = 'en' | 'he';

export const DEFAULT_LANG: Lang = 'en';

export const DIR: Record<Lang, 'ltr' | 'rtl'> = { en: 'ltr', he: 'rtl' };

/** The studio site's canonical per-locale entry points. */
export const STUDIO_URL: Record<Lang, string> = {
  en: 'https://bar-builds.vercel.app/en',
  he: 'https://bar-builds.vercel.app/',
};

declare global {
  interface Window {
    __bmLang?: string;
  }
}

export type Dict = {
  meta: { title: string; description: string };
  skip: string;
  hero: {
    wordmarkName: string;
    wordmarkRole: string;
    stampWorks: (n: number) => string;
    stampLive: string;
    titleLine1: string;
    titleLine2: string;
    titleEm: string;
    lead: string;
    kicker: string;
    ctaBuild: string;
    ctaBrowse: string;
    scroll: string;
  };
  marquee: { label: (names: string) => string };
  gallery: {
    sectionLabel: string;
    count: (n: number) => string;
    countFiltered: (visible: number, total: number) => string;
    searchPlaceholder: string;
    clearLabel: string;
    emptyKicker: string;
    emptyLead: (q: string) => string;
    emptyNote: string;
    emptyBuild: string;
    emptyShowAll: string;
    asidePre: string;
    asideLink: string;
    asidePost: string;
  };
  card: {
    aria: (company: string) => string;
    shotAlt: (id: string) => string;
    visit: string;
    go: string;
  };
  missing: {
    mark: string;
    title: string;
    note: string;
    cta: string;
    mailSubject: (company?: string) => string;
  };
  sticky: { regionLabel: string; text: string; cta: string; dismiss: string };
  footer: {
    colophon: string;
    note: string;
    studioLabel: string;
    elsewhereLabel: string;
  };
  toggle: { label: string };
};

const en: Dict = {
  meta: {
    title: 'bar for companies',
    description:
      'When I apply somewhere, I build the company a site first. This is the gallery of those sites, all live.',
  },
  skip: 'Skip to the gallery',
  hero: {
    wordmarkName: 'Bar Moshe',
    wordmarkRole: 'Application Gallery',
    stampWorks: (n) => `Cat. ${n} works`,
    stampLive: 'all live',
    titleLine1: 'When I apply somewhere,',
    titleLine2: 'I build the company ',
    titleEm: 'a site first.',
    lead: "Each plate below is a real application: a one-page site rebuilt in that company's own visual language, with my work inside it. Hover or tap a plate to see the site, then open it live.",
    kicker: 'Your company not here yet?',
    ctaBuild: 'Ask me to build it',
    ctaBrowse: 'Browse the gallery',
    scroll: 'Scroll',
  },
  marquee: { label: (names) => `In the catalogue: ${names}` },
  gallery: {
    sectionLabel: 'Application sites',
    count: (n) => `${n} ${n === 1 ? 'site' : 'sites'}`,
    countFiltered: (visible, total) =>
      `${visible} of ${total} ${total === 1 ? 'site' : 'sites'}`,
    searchPlaceholder: 'Search your company',
    clearLabel: 'Clear search',
    emptyKicker: 'Not in the catalogue yet',
    emptyLead: (q) => `No site for "${q}" yet. That could change quickly.`,
    emptyNote:
      "Tell me where you work and I'll build yours next, usually within a day or two.",
    emptyBuild: 'Ask me to build it',
    emptyShowAll: 'Show all sites',
    asidePre: 'Or see how I work on my ',
    asideLink: 'studio site',
    asidePost: '.',
  },
  card: {
    aria: (company) => `bar for ${company}, opens the live site`,
    shotAlt: (id) => `Screenshot of the bar-for-${id} site`,
    visit: 'visit live',
    go: 'Visit the live site',
  },
  missing: {
    mark: 'this frame is reserved',
    title: 'Your company missing?',
    note: "Tell me where you work and I'll build yours next, usually within a day or two.",
    cta: 'Email me',
    mailSubject: (company) =>
      company ? `A bar-for site for ${company}` : 'A bar-for site for my company',
  },
  sticky: {
    regionLabel: 'Get a site built',
    text: 'Your company missing?',
    cta: 'Email me',
    dismiss: 'Dismiss',
  },
  footer: {
    colophon: 'Every site built by hand, for the company it names',
    note: "I'm Bar. I build working software fast, and I'd rather show it than describe it. If one of these landed with you, let's talk.",
    studioLabel: 'My studio site',
    elsewhereLabel: 'Elsewhere',
  },
  toggle: { label: 'Language' },
};

const he: Dict = {
  meta: {
    title: 'bar for companies',
    description:
      'כשאני מגיש מועמדות לחברה, קודם כול אני בונה לה אתר. זו הגלריה של האתרים האלה, וכולם חיים.',
  },
  skip: 'דילוג לגלריה',
  hero: {
    wordmarkName: 'בר משה',
    wordmarkRole: 'גלריית מועמדויות',
    stampWorks: (n) => `קטלוג ${n} עבודות`,
    stampLive: 'הכול חי',
    titleLine1: 'כשאני מגיש מועמדות לחברה,',
    titleLine2: 'קודם כול אני בונה לה ',
    titleEm: 'אתר.',
    lead: 'כל לוח כאן הוא מועמדות אמיתית: אתר של עמוד אחד שבניתי מחדש בשפה הוויזואלית של החברה, עם העבודה שלי בפנים. עברו עם הסמן על לוח או געו בו כדי לראות את האתר, ואז פתחו אותו חי.',
    kicker: 'החברה שלכם עוד לא כאן?',
    ctaBuild: 'בקשו ממני לבנות אחד',
    ctaBrowse: 'לעיון בגלריה',
    scroll: 'גלילה',
  },
  marquee: { label: (names) => `בקטלוג: ${names}` },
  gallery: {
    sectionLabel: 'אתרי מועמדות',
    count: (n) => (n === 1 ? 'אתר אחד' : `${n} אתרים`),
    countFiltered: (visible, total) => `${visible} מתוך ${total} אתרים`,
    searchPlaceholder: 'חפשו את החברה שלכם',
    clearLabel: 'ניקוי חיפוש',
    emptyKicker: 'עוד לא בקטלוג',
    emptyLead: (q) => `עוד אין אתר עבור "${q}". זה יכול להשתנות מהר.`,
    emptyNote:
      'ספרו לי איפה אתם עובדים, ואבנה את האתר שלכם הבא בתור, בדרך כלל תוך יום או יומיים.',
    emptyBuild: 'בקשו ממני לבנות אותו',
    emptyShowAll: 'הצגת כל האתרים',
    asidePre: 'או ראו איך אני עובד ב',
    asideLink: 'אתר הסטודיו שלי',
    asidePost: '.',
  },
  card: {
    aria: (company) => `bar for ${company}, פותח את האתר החי`,
    shotAlt: (id) => `צילום מסך של האתר bar-for-${id}`,
    visit: 'לאתר החי',
    go: 'לביקור באתר החי',
  },
  missing: {
    mark: 'המסגרת הזאת שמורה',
    title: 'החברה שלכם חסרה?',
    note: 'ספרו לי איפה אתם עובדים, ואבנה את האתר שלכם הבא בתור, בדרך כלל תוך יום או יומיים.',
    cta: 'שלחו לי מייל',
    mailSubject: (company) =>
      company ? `אתר bar-for עבור ${company}` : 'אתר bar-for עבור החברה שלי',
  },
  sticky: {
    regionLabel: 'הזמנת אתר',
    text: 'החברה שלכם חסרה?',
    cta: 'שלחו לי מייל',
    dismiss: 'סגירה',
  },
  footer: {
    colophon: 'כל אתר נבנה ביד, לחברה שעל שמה הוא נקרא',
    note: 'אני בר. אני בונה תוכנה עובדת מהר, ומעדיף להראות אותה מאשר לתאר אותה. אם אחד מהאתרים האלה קלע אצלכם, בואו נדבר.',
    studioLabel: 'אתר הסטודיו שלי',
    elsewhereLabel: 'עוד מקומות',
  },
  toggle: { label: 'שפה' },
};

const DICTS: Record<Lang, Dict> = { en, he };

export function getDict(lang: Lang): Dict {
  return DICTS[lang];
}
