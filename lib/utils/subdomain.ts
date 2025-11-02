/**
 * Subdomain Utilities for Multi-Tenant SaaS
 * Handles subdomain extraction, validation, and tenant context
 */

export interface SubdomainInfo {
  subdomain: string | null;
  isMainDomain: boolean;
  hostname: string;
}

/**
 * Extract subdomain from hostname
 * Examples:
 *   - johndoe.example.com -> "johndoe"
 *   - www.example.com -> null (main domain)
 *   - example.com -> null (main domain)
 *   - localhost:3000 -> null (development)
 */
export function getSubdomainInfo(hostname: string): SubdomainInfo {
  // Remove port if present
  const cleanHostname = hostname.split(':')[0];

  // Get main domain from env (e.g., "example.com")
  const mainDomain = process.env.NEXT_PUBLIC_MAIN_DOMAIN || 'localhost';

  // Development: localhost or 127.0.0.1
  if (cleanHostname === 'localhost' || cleanHostname === '127.0.0.1' || cleanHostname.endsWith('.local')) {
    // For development, check for subdomain in format: subdomain.localhost
    const parts = cleanHostname.split('.');
    if (parts.length > 1 && parts[0] !== 'www') {
      return {
        subdomain: parts[0],
        isMainDomain: false,
        hostname: cleanHostname,
      };
    }

    return {
      subdomain: null,
      isMainDomain: true,
      hostname: cleanHostname,
    };
  }

  // Production: check if hostname matches main domain pattern
  if (cleanHostname === mainDomain || cleanHostname === `www.${mainDomain}`) {
    return {
      subdomain: null,
      isMainDomain: true,
      hostname: cleanHostname,
    };
  }

  // Extract subdomain (everything before the main domain)
  // e.g., "johndoe.example.com" -> "johndoe"
  if (cleanHostname.endsWith(`.${mainDomain}`)) {
    const subdomain = cleanHostname.replace(`.${mainDomain}`, '');

    // Ignore www subdomain
    if (subdomain === 'www') {
      return {
        subdomain: null,
        isMainDomain: true,
        hostname: cleanHostname,
      };
    }

    // Handle multi-level subdomains (take the first part)
    // e.g., "app.johndoe.example.com" -> "johndoe"
    const subdomainParts = subdomain.split('.');
    const actualSubdomain = subdomainParts[subdomainParts.length - 1];

    return {
      subdomain: actualSubdomain,
      isMainDomain: false,
      hostname: cleanHostname,
    };
  }

  // If hostname doesn't match expected pattern, treat as main domain
  return {
    subdomain: null,
    isMainDomain: true,
    hostname: cleanHostname,
  };
}

/**
 * Validate subdomain format
 * - Must be 3-63 characters
 * - Lowercase alphanumeric and hyphens only
 * - Cannot start or end with hyphen
 */
export function isValidSubdomain(subdomain: string): boolean {
  if (!subdomain || subdomain.length < 3 || subdomain.length > 63) {
    return false;
  }

  // RFC 1035 compliant subdomain format
  const validFormat = /^[a-z0-9][a-z0-9-]*[a-z0-9]$/;
  return validFormat.test(subdomain);
}

/**
 * Reserved subdomains that cannot be used for tenant creation
 */
export const RESERVED_SUBDOMAINS = new Set([
  'www', 'admin', 'api', 'app', 'mail', 'smtp',
  'ftp', 'webmail', 'cpanel', 'whm', 'ns1', 'ns2',
  'dashboard', 'portal', 'login', 'signup', 'register',
  'blog', 'help', 'support', 'docs', 'status',
]);

/**
 * Check if subdomain is available for tenant creation
 */
export function isSubdomainAvailable(subdomain: string): boolean {
  if (!isValidSubdomain(subdomain)) {
    return false;
  }

  return !RESERVED_SUBDOMAINS.has(subdomain.toLowerCase());
}

/**
 * Get tenant context from request headers (set by middleware)
 */
export function getTenantFromHeaders(headers: Headers): string | null {
  return headers.get('x-tenant-subdomain');
}

/**
 * Create URL for a specific tenant subdomain
 */
export function getTenantUrl(subdomain: string, path: string = ''): string {
  const mainDomain = process.env.NEXT_PUBLIC_MAIN_DOMAIN || 'localhost:3000';
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';

  return `${protocol}://${subdomain}.${mainDomain}${path}`;
}

/**
 * Get main domain URL
 */
export function getMainDomainUrl(path: string = ''): string {
  const mainDomain = process.env.NEXT_PUBLIC_MAIN_DOMAIN || 'localhost:3000';
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';

  return `${protocol}://${mainDomain}${path}`;
}
