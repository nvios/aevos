import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import Negotiator from 'negotiator';
import { match } from '@formatjs/intl-localematcher';

const locales = ['it', 'en'];
const defaultLocale = 'it';

const handleI18n = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed'
});

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (
    pathname.startsWith('/_next') ||
    pathname.includes('.') ||
    pathname.startsWith('/api')
  ) {
    return;
  }

  // If the path already starts with /en, let next-intl handle it.
  if (pathname.startsWith('/en')) {
    return handleI18n(request);
  }

  // Skip auto-redirect for /login to preserve OAuth callback hash fragments.
  if (pathname === '/login') {
    return handleI18n(request);
  }

  // For root-level paths (no /en prefix):
  // If user has explicitly chosen a locale via cookie, respect it.
  const explicitLocale = request.cookies.get('AEVOS_LOCALE')?.value;
  if (explicitLocale === 'it') {
    return handleI18n(request);
  }
  if (explicitLocale === 'en') {
    const url = request.nextUrl.clone();
    url.pathname = `/en${pathname}`;
    return NextResponse.redirect(url);
  }

  // No explicit choice — auto-detect from Accept-Language.
  const headers = { 'accept-language': request.headers.get('accept-language') || '' };
  const languages = new Negotiator({ headers }).languages();

  try {
    const preferredLocale = match(languages, locales, 'en');
    if (preferredLocale === 'en') {
      const url = request.nextUrl.clone();
      url.pathname = `/en${pathname}`;
      return NextResponse.redirect(url);
    }
  } catch {
    // fallthrough to default
  }

  return handleI18n(request);
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
};
