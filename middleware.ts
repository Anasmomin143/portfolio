import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n/request';
import type { NextRequest } from 'next/server';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always'
});

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip admin routes - let NextAuth handle them via API routes
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/auth')) {
    return;
  }

  // Handle internationalized routes
  return intlMiddleware(request);
}

export const config = {
  matcher: ['/', '/(en|fr)/:path*']
};