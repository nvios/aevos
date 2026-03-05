export const locales = ['it', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'it';

// Top-level path segment translations (longest first for prefix matching)
const PATH_SEGMENTS: [string, string][] = [
  ['/servizi/protocolli', '/services/protocols'],
  ['/servizi/assessment-online', '/services/assessment-online'],
  ['/servizi/lab-tests', '/services/lab-tests'],
  ['/servizi/lombardia', '/services/lombardia'],
  ['/articoli', '/articles'],
  ['/ricette', '/recipes'],
  ['/servizi', '/services'],
  ['/calcolo-longevita', '/longevity-calculator'],
  ['/eta-biologica', '/biological-age'],
  ['/aspettativa-di-vita', '/life-expectancy'],
  ['/glossario', '/glossary'],
  ['/sedi', '/locations'],
];

// Category slug translations (Italian → English)
const CATEGORY_SLUGS: Record<string, string> = {
  'sonno': 'sleep',
  'esercizio': 'exercise',
  'nutrizione': 'nutrition',
  'capelli': 'hair',
  'longevita': 'longevity',
  'tecnologie': 'technology',
  // skin-care stays the same
};

const CATEGORY_SLUGS_REVERSE: Record<string, string> = Object.fromEntries(
  Object.entries(CATEGORY_SLUGS).map(([it, en]) => [en, it])
);

function translateCategorySlugs(path: string, toEnglish: boolean): string {
  const map = toEnglish ? CATEGORY_SLUGS : CATEGORY_SLUGS_REVERSE;
  const parts = path.split('/');
  return parts.map(p => map[p] || p).join('/');
}

/**
 * Converts an internal (Italian) path to the locale-appropriate public path.
 */
export function localePath(internalPath: string, locale: string): string {
  if (locale === 'it') return internalPath;

  let result = internalPath;
  for (const [it, en] of PATH_SEGMENTS) {
    if (result === it || result.startsWith(it + '/')) {
      result = result.replace(it, en);
      break;
    }
  }

  // Also translate category slugs in the path
  result = translateCategorySlugs(result, true);
  return result;
}

/**
 * Converts a public English path back to the internal (Italian) path.
 */
export function internalPath(publicPath: string): string {
  let result = publicPath;

  // First translate category slugs back to Italian
  result = translateCategorySlugs(result, false);

  for (const [it, en] of PATH_SEGMENTS) {
    if (result === en || result.startsWith(en + '/')) {
      result = result.replace(en, it);
      break;
    }
  }
  return result;
}
