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

function parseNfGeoCountry(header: string | null): string | null {
  if (!header) return null;
  try {
    const geo = JSON.parse(decodeURIComponent(header));
    return geo?.country?.code ?? null;
  } catch {
    return null;
  }
}

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

  // Resolve geo country from platform-specific sources:
  // Vercel → x-vercel-ip-country, Netlify → request.geo / x-nf-geo, Cloudflare → cf-ipcountry
  const geoCountry =
    (request as NextRequest & { geo?: { country?: string } }).geo?.country ??
    request.headers.get('x-vercel-ip-country') ??
    request.headers.get('cf-ipcountry') ??
    parseNfGeoCountry(request.headers.get('x-nf-geo')) ??
    null;

  // Next.js converts response headers prefixed with "x-middleware-request-"
  // into request headers available via headers() in server actions/components.
  function withGeo(response: NextResponse): NextResponse {
    if (geoCountry) {
      response.headers.set('x-middleware-request-x-geo-country', geoCountry);
    }
    return response;
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

      return withGeo(response);
    }

    return withGeo(await handleI18n(request));
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

  // English-translated paths without /en/ prefix (e.g. /articles/sleep/…)
  // Rewrite transparently to /en/… so they resolve without a redirect.
  if (PATH_SEGMENTS.some(([, en]) => pathname === en || pathname.startsWith(en + '/'))) {
    const translatedPath = translateEnglishPathToInternal(pathname);
    const rewriteUrl = request.nextUrl.clone();
    rewriteUrl.pathname = `/en${translatedPath}`;
    return withGeo(NextResponse.rewrite(rewriteUrl));
  }

  // All non-/en paths serve as Italian (default locale) — no redirect.
  // Search engines discover the English version via hreflang alternate links.
  return withGeo(await handleI18n(request));
}

export const config = {
  matcher: ['/((?!api|_next|ingest|.*\\..*).*)']
};
