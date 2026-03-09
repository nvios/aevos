import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';

const locales = ['it', 'en'];
const defaultLocale = 'it';

const handleI18n = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed',
  localeDetection: false,
});

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

const CATEGORY_SLUGS_EN_TO_IT: Record<string, string> = {
  'sleep': 'sonno',
  'exercise': 'esercizio',
  'nutrition': 'nutrizione',
  'hair': 'capelli',
  'longevity': 'longevita',
  'technology': 'tecnologie',
};

function translateEnglishPathToInternal(enPath: string): string {
  let result = enPath;

  for (const [it, en] of PATH_SEGMENTS) {
    if (result === en || result.startsWith(en + '/')) {
      result = result.replace(en, it);
      break;
    }
  }

  const parts = result.split('/');
  return parts.map(p => CATEGORY_SLUGS_EN_TO_IT[p] || p).join('/');
}

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (
    pathname.startsWith('/_next') ||
    pathname.includes('.') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/ingest') ||
    pathname.startsWith('/en/ingest')
  ) {
    return;
  }

  // English paths: rewrite translated slugs to internal Italian paths
  if (pathname.startsWith('/en')) {
    const pathWithoutLocale = pathname.slice(3) || '/';
    const translatedPath = translateEnglishPathToInternal(pathWithoutLocale);

    if (translatedPath !== pathWithoutLocale) {
      const rewrittenUrl = new URL(request.url);
      rewrittenUrl.pathname = `/en${translatedPath}`;
      const modifiedRequest = new NextRequest(rewrittenUrl, request);
      const i18nResponse = await handleI18n(modifiedRequest);

      const rewriteUrl = request.nextUrl.clone();
      rewriteUrl.pathname = `/en${translatedPath}`;
      const response = NextResponse.rewrite(rewriteUrl);

      for (const cookie of i18nResponse.cookies.getAll()) {
        response.cookies.set(cookie);
      }
      i18nResponse.headers.forEach((value, key) => {
        if (key.startsWith('x-')) {
          response.headers.set(key, value);
        }
      });

      return response;
    }

    return handleI18n(request);
  }

  // Explicit user choice via language switcher cookie — redirect to /en
  // (Skip for bots to avoid redirect errors in Search Console)
  if (pathname !== '/login') {
    const explicitLocale = request.cookies.get('AEVOS_LOCALE')?.value;
    if (explicitLocale === 'en') {
      const ua = request.headers.get('user-agent') || '';
      const isBot = /googlebot|bingbot|yandex|baiduspider|duckduckbot|slurp|facebookexternalhit|twitterbot|linkedinbot|embedly|quora|pinterest|semrush|ahref|mj12bot|dotbot/i.test(ua);

      if (!isBot) {
        const url = request.nextUrl.clone();
        url.pathname = `/en${pathname}`;
        return NextResponse.redirect(url);
      }
    }
  }

  // All non-/en paths serve as Italian (default locale) — no redirect.
  // Search engines discover the English version via hreflang alternate links.
  return handleI18n(request);
}

export const config = {
  matcher: ['/((?!api|_next|ingest|.*\\..*).*)']
};
