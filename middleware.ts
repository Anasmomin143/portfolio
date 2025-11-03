import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n/request';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getSubdomainInfo } from './lib/utils/subdomain';
import { verifyTenantSubdomain } from './lib/utils/verify-tenant';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always'
});

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hostname = request.headers.get('host') || '';

  // Extract subdomain information
  const subdomainInfo = getSubdomainInfo(hostname);

  // Get or create response
  let response: NextResponse;

  // Skip ALL API routes from i18n (must be before domain-specific logic)
  if (pathname.startsWith('/api')) {
    response = NextResponse.next();

    // Still add tenant context headers for subdomain API calls
    if (subdomainInfo.subdomain) {
      response.headers.set('x-tenant-subdomain', subdomainInfo.subdomain);
    }
  }
  // Handle main domain (landing page, registration, etc.)
  else if (subdomainInfo.isMainDomain) {
    // Main domain routes - ONLY landing page and registration allowed
    // Landing page: /
    // Registration: /register

    // Skip admin routes on main domain - redirect to landing page
    if (pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    // Only allow landing page and registration on main domain
    // All other routes (portfolio pages) should redirect to landing page
    if (pathname === '/' || pathname === '/register' || pathname === '/login') {
      response = NextResponse.next();
    }
    // Redirect any i18n routes (like /en/contact, /en/about) to landing page
    else {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }
  // Handle tenant subdomain
  else if (subdomainInfo.subdomain) {
    // Verify subdomain exists in database
    const tenantVerification = await verifyTenantSubdomain(subdomainInfo.subdomain);

    // If subdomain doesn't exist or is inactive, show error page
    if (!tenantVerification.exists) {
      // Create error response with helpful message
      const errorUrl = new URL('/', request.url);
      errorUrl.searchParams.set('error', 'invalid_subdomain');
      errorUrl.searchParams.set('subdomain', subdomainInfo.subdomain);
      return NextResponse.redirect(errorUrl);
    }

    // Subdomain routes
    // Portfolio: subdomain.domain.com/ (public portfolio)
    // Admin: subdomain.domain.com/admin (tenant admin panel)

    // Admin routes - let them through (NextAuth will handle auth)
    if (pathname.startsWith('/admin')) {
      response = NextResponse.next();
      response.headers.set('x-tenant-subdomain', subdomainInfo.subdomain);
      if (tenantVerification.tenantId) {
        response.headers.set('x-tenant-id', tenantVerification.tenantId);
      }
    }
    // Public portfolio pages - handle internationalization
    else {
      response = intlMiddleware(request) || NextResponse.next();
      response.headers.set('x-tenant-subdomain', subdomainInfo.subdomain);
      if (tenantVerification.tenantId) {
        response.headers.set('x-tenant-id', tenantVerification.tenantId);
      }
    }
  }
  // Unknown domain pattern
  else {
    response = NextResponse.next();
  }

  // Add hostname info to headers for debugging
  response.headers.set('x-hostname', hostname);
  response.headers.set('x-is-main-domain', String(subdomainInfo.isMainDomain));

  return response;
}

export const config = {
  // Match all routes except static files and Next.js internals
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|api/webhook).*)',
  ]
};