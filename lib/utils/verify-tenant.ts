/**
 * Server-side tenant verification utilities
 * Used in middleware and API routes to validate tenant existence
 */

import { getServiceSupabase } from '@/lib/supabase/client';

export interface TenantVerification {
  exists: boolean;
  tenantId?: string;
  subdomain?: string;
  status?: string;
}

/**
 * Verify if a subdomain exists and is active in the database
 * This is a server-side only function (uses service role)
 */
export async function verifyTenantSubdomain(subdomain: string): Promise<TenantVerification> {
  if (!subdomain) {
    return { exists: false };
  }

  try {
    const supabase = getServiceSupabase();

    // Check if subdomain exists and is active
    const { data, error } = await supabase
      .from('tenants')
      .select('id, subdomain, status')
      .eq('subdomain', subdomain.toLowerCase())
      .eq('status', 'active')
      .maybeSingle();

    if (error) {
      // PGRST116 = no rows found
      if (error.code === 'PGRST116') {
        return { exists: false };
      }

      console.error('Error verifying tenant subdomain:', error);
      return { exists: false };
    }

    if (!data) {
      return { exists: false };
    }

    return {
      exists: true,
      tenantId: data.id as string,
      subdomain: data.subdomain as string,
      status: data.status as string,
    };
  } catch (error) {
    console.error('Unexpected error verifying tenant:', error);
    return { exists: false };
  }
}

/**
 * Get tenant ID by subdomain (returns null if not found)
 */
export async function getTenantIdBySubdomain(subdomain: string): Promise<string | null> {
  const result = await verifyTenantSubdomain(subdomain);
  return result.exists ? result.tenantId || null : null;
}
