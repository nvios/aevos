import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import Negotiator from 'negotiator';
import { match } from '@formatjs/intl-localematcher';

const locales = ['it', 'en'];
const defaultLocale = 'it'; // This configures next-intl to treat / as Italian

const handleI18n = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed'
});

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip internal paths
  if (
    pathname.startsWith('/_next') ||
    pathname.includes('.') ||
    pathname.startsWith('/api')
  ) {
    return;
  }

  // If the path already starts with /en, let next-intl handle it
  if (pathname.startsWith('/en')) {
    return handleI18n(request);
  }

  // For paths without locale prefix (which default to Italian in next-intl),
  // we check if the user should actually be served English.
  // We use 'en' as the fallback for match(), so non-Italian users get English.
  const headers = { 'accept-language': request.headers.get('accept-language') || '' };
  const languages = new Negotiator({ headers }).languages();
  
  try {
    // If user is 'fr', match returns 'en' (our fallback).
    // If user is 'it', match returns 'it'.
    const preferredLocale = match(languages, locales, 'en');

    // If preferred is English but we are at a path that implies Italian (no prefix),
    // redirect to the English version.
    if (preferredLocale === 'en') {
      const url = request.nextUrl.clone();
      url.pathname = `/en${pathname}`;
      return NextResponse.redirect(url);
    }
  } catch (error) {
    console.error('Locale matching error:', error);
  }

  return handleI18n(request);
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
};
