import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { getServiceSupabase } from '@/lib/supabase/client';
import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Tenant context for API routes
 */
export interface TenantContext {
  tenantId: string;
  userId: string;
  userEmail: string;
  tenantSubdomain: string;
  supabase: SupabaseClient;
}

/**
 * Type for tenant-scoped route handler
 */
type TenantRouteHandler<T = any> = (
  context: TenantContext,
  request: Request,
  params?: T
) => Promise<NextResponse>;

/**
 * Higher-order function that wraps API routes with tenant authentication and context
 *
 * @example
 * // Before:
 * export async function GET() {
 *   const session = await auth();
 *   if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
 *   const tenantId = session.user.tenantId;
 *   if (!tenantId) return NextResponse.json({ error: 'Tenant context required' }, { status: 400 });
 *   const supabase = getServiceSupabase();
 *   const { data } = await supabase.from('projects').select('*').eq('tenant_id', tenantId);
 *   return NextResponse.json(data);
 * }
 *
 * // After:
 * export const GET = withTenant(async ({ tenantId, supabase }) => {
 *   const { data } = await supabase.from('projects').select('*').eq('tenant_id', tenantId);
 *   return NextResponse.json(data);
 * });
 */
export function withTenant<T = any>(handler: TenantRouteHandler<T>) {
  return async (request: Request, routeContext?: T): Promise<NextResponse> => {
    try {
      // 1. Authenticate user
      const session = await auth();

      if (!session?.user) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }

      // 2. Extract tenant context
      const tenantId = (session.user as any).tenantId;

      if (!tenantId) {
        return NextResponse.json(
          { error: 'Tenant context required' },
          { status: 400 }
        );
      }

      // 3. Create context object
      const context: TenantContext = {
        tenantId,
        userId: session.user.id,
        userEmail: session.user.email || '',
        tenantSubdomain: (session.user as any).tenantSubdomain || '',
        supabase: getServiceSupabase(),
      };

      // 4. Call the handler with context
      return await handler(context, request, routeContext);
    } catch (error) {
      console.error('Error in tenant route handler:', error);
      return NextResponse.json(
        {
          error: 'Internal server error',
          details: error instanceof Error ? error.message : 'Unknown error'
        },
        { status: 500 }
      );
    }
  };
}

/**
 * Helper to log audit trail with tenant context
 */
export async function logAudit(
  context: TenantContext,
  params: {
    table_name: string;
    record_id: string;
    action: 'CREATE' | 'UPDATE' | 'DELETE';
    old_data?: any;
    new_data?: any;
  }
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (context.supabase.from('audit_log') as any).insert({
    admin_user_id: context.userId,
    tenant_id: context.tenantId,
    table_name: params.table_name,
    record_id: params.record_id,
    action: params.action,
    old_data: params.old_data || null,
    new_data: params.new_data || null,
  });
}

/**
 * Helper to build tenant-scoped query
 * Automatically adds .eq('tenant_id', tenantId) to the query
 */
export function tenantQuery(context: TenantContext, table: string) {
  return context.supabase.from(table).select('*').eq('tenant_id', context.tenantId);
}
