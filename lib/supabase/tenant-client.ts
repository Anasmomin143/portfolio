import { auth } from '@/lib/auth/auth';
import { getServiceSupabase } from './client';
import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Tenant context for the current request
 */
export interface TenantContext {
  tenantId: string;
  userId: string;
  userEmail: string;
  tenantSubdomain: string;
}

/**
 * Get tenant context from the current session
 * Throws error if no valid session or tenant context
 */
export async function getTenantContext(): Promise<TenantContext> {
  const session = await auth();

  if (!session?.user) {
    throw new Error('Unauthorized: No active session');
  }

  const tenantId = (session.user as any).tenantId;

  if (!tenantId) {
    throw new Error('Tenant context required: User session missing tenant information');
  }

  return {
    tenantId,
    userId: session.user.id,
    userEmail: session.user.email || '',
    tenantSubdomain: (session.user as any).tenantSubdomain || '',
  };
}

/**
 * Tenant-scoped Supabase client
 * Automatically filters all queries by tenant_id
 */
export class TenantSupabaseClient {
  private supabase: SupabaseClient;
  private tenantId: string;
  private userId: string;

  constructor(supabase: SupabaseClient, tenantId: string, userId: string) {
    this.supabase = supabase;
    this.tenantId = tenantId;
    this.userId = userId;
  }

  /**
   * Query builder that automatically adds tenant_id filter
   */
  from(table: string) {
    const builder = this.supabase.from(table);

    // Return a proxy that intercepts query methods
    return new Proxy(builder, {
      get: (target, prop) => {
        const originalMethod = (target as any)[prop];

        if (typeof originalMethod !== 'function') {
          return originalMethod;
        }

        // For select, insert, update, delete operations, add tenant_id filter
        if (prop === 'select' || prop === 'upsert') {
          return (...args: any[]) => {
            const query = originalMethod.apply(target, args);
            // Add tenant filter for select operations
            return new Proxy(query, {
              get: (q, p) => {
                const method = (q as any)[p];
                if (typeof method !== 'function') return method;

                // Automatically add tenant_id filter before executing
                if (p === 'single' || p === 'maybeSingle' || p === 'then' || p === 'catch') {
                  return (...queryArgs: any[]) => {
                    // Add tenant_id filter if not already added
                    const filteredQuery = this.hasTable(table)
                      ? (q as any).eq('tenant_id', this.tenantId)
                      : q;
                    return method.apply(filteredQuery, queryArgs);
                  };
                }

                return method.bind(q);
              }
            });
          };
        }

        if (prop === 'insert') {
          return (data: any, options?: any) => {
            // Automatically add tenant_id to inserts
            const processData = (item: any) => {
              if (this.hasTable(table)) {
                return { ...item, tenant_id: this.tenantId };
              }
              return item;
            };

            const dataWithTenant = Array.isArray(data)
              ? data.map(processData)
              : processData(data);

            return originalMethod.call(target, dataWithTenant, options);
          };
        }

        if (prop === 'update') {
          return (data: any, options?: any) => {
            const query = originalMethod.call(target, data, options);
            // Add tenant_id filter for updates
            return this.hasTable(table)
              ? query.eq('tenant_id', this.tenantId)
              : query;
          };
        }

        if (prop === 'delete') {
          return (options?: any) => {
            const query = originalMethod.call(target, options);
            // Add tenant_id filter for deletes
            return this.hasTable(table)
              ? query.eq('tenant_id', this.tenantId)
              : query;
          };
        }

        return originalMethod.bind(target);
      }
    });
  }

  /**
   * Check if table should have tenant_id filtering
   * Add tables that don't have tenant_id to the exclusion list
   */
  private hasTable(table: string): boolean {
    const excludedTables = ['tenants', 'admin_users']; // Tables without tenant_id
    return !excludedTables.includes(table);
  }

  /**
   * Insert audit log entry with tenant context
   */
  async logAudit(params: {
    table_name: string;
    record_id: string;
    action: 'CREATE' | 'UPDATE' | 'DELETE';
    old_data?: any;
    new_data?: any;
  }) {
    return this.supabase.from('audit_log').insert({
      admin_user_id: this.userId,
      tenant_id: this.tenantId,
      table_name: params.table_name,
      record_id: params.record_id,
      action: params.action,
      old_data: params.old_data || null,
      new_data: params.new_data || null,
    });
  }

  /**
   * Get the raw Supabase client (use with caution - no automatic tenant filtering)
   */
  getRawClient() {
    return this.supabase;
  }

  /**
   * Get tenant ID
   */
  getTenantId() {
    return this.tenantId;
  }
}

/**
 * Get a tenant-scoped Supabase client for the current request
 * Automatically filters all queries by tenant_id
 *
 * @example
 * const { supabase } = await getTenantSupabase();
 *
 * // Automatically filtered by tenant_id
 * const { data } = await supabase.from('projects').select('*');
 *
 * // Automatically adds tenant_id to inserts
 * await supabase.from('projects').insert({ name: 'Test' });
 */
export async function getTenantSupabase() {
  const context = await getTenantContext();
  const supabase = getServiceSupabase();

  return {
    supabase: new TenantSupabaseClient(supabase, context.tenantId, context.userId),
    context,
  };
}
