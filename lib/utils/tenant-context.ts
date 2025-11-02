/**
 * Tenant Context Utilities
 * Helper functions to get and validate tenant context in API routes and server components
 */

import { headers } from 'next/headers';
import { getServiceSupabase } from '@/lib/supabase/client';

export interface TenantInfo {
  id: string;
  subdomain: string;
  name: string;
  status: string;
  settings?: Record<string, unknown>;
}

/**
 * Get tenant subdomain from request headers (set by middleware)
 * Use this in API routes and server components
 */
export async function getTenantSubdomain(): Promise<string | null> {
  const headersList = await headers();
  return headersList.get('x-tenant-subdomain');
}

/**
 * Get full tenant information from database by subdomain
 * Returns null if tenant not found or inactive
 */
export async function getTenantBySubdomain(subdomain: string): Promise<TenantInfo | null> {
  try {
    const supabase = getServiceSupabase();

    const { data, error } = await supabase
      .from('tenants')
      .select('id, subdomain, name, status, settings')
      .eq('subdomain', subdomain)
      .eq('status', 'active')
      .single();

    if (error || !data) {
      return null;
    }

    return {
      id: data.id,
      subdomain: data.subdomain,
      name: data.name,
      status: data.status,
      settings: data.settings as Record<string, unknown> | undefined,
    };
  } catch (error) {
    console.error('Error fetching tenant:', error);
    return null;
  }
}

/**
 * Get current tenant context (from headers + database lookup)
 * Use this in API routes that need tenant information
 *
 * @example
 * ```ts
 * export async function GET(request: Request) {
 *   const tenant = await getCurrentTenant();
 *   if (!tenant) {
 *     return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
 *   }
 *   // Use tenant.id to filter data
 * }
 * ```
 */
export async function getCurrentTenant(): Promise<TenantInfo | null> {
  const subdomain = await getTenantSubdomain();

  if (!subdomain) {
    return null;
  }

  return getTenantBySubdomain(subdomain);
}

/**
 * Require tenant context - throws error if not found
 * Use this when tenant is required for the operation
 *
 * @throws Error if tenant not found or inactive
 */
export async function requireTenant(): Promise<TenantInfo> {
  const tenant = await getCurrentTenant();

  if (!tenant) {
    throw new Error('Tenant context required but not found');
  }

  return tenant;
}

/**
 * Check if current request is on main domain (no tenant)
 */
export async function isMainDomain(): Promise<boolean> {
  const headersList = await headers();
  const isMain = headersList.get('x-is-main-domain');
  return isMain === 'true';
}

/**
 * Get tenant ID for database queries
 * Returns null if no tenant context
 */
export async function getTenantId(): Promise<string | null> {
  const tenant = await getCurrentTenant();
  return tenant?.id || null;
}

/**
 * Validate that user has access to the current tenant
 * Used in admin API routes to ensure user can only modify their own tenant's data
 */
export async function validateUserTenantAccess(userId: string, tenantId: string): Promise<boolean> {
  try {
    const supabase = getServiceSupabase();

    const { data, error } = await supabase
      .from('admin_users')
      .select('id')
      .eq('id', userId)
      .eq('tenant_id', tenantId)
      .single();

    return !error && !!data;
  } catch (error) {
    console.error('Error validating tenant access:', error);
    return false;
  }
}
