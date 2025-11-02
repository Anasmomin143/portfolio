import { NextResponse } from 'next/server';
import { withTenant, logAudit } from '@/lib/api/with-tenant';
import type { Database } from '@/lib/supabase/database.types';

type RouteContext = {
  params: Promise<{ id: string }>;
};

// GET /api/admin/certifications/[id] - Get single certification for current tenant
export const GET = withTenant<RouteContext>(async ({ tenantId, supabase }, request, context) => {
  const { id } = await context!.params;

  const { data, error } = await supabase
    .from('certifications')
    .select('*')
    .eq('id', id)
    .eq('tenant_id', tenantId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return NextResponse.json({ error: 'Certification not found' }, { status: 404 });
    }
    console.error('Error fetching certification:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
});

// PUT /api/admin/certifications/[id] - Update certification for current tenant
export const PUT = withTenant<RouteContext>(async (ctx, request, context) => {
  const { id } = await context!.params;
  const body = await request.json() as Database['public']['Tables']['certifications']['Update'];

  // Get old data for audit log and verify ownership
  const { data: oldData } = await ctx.supabase
    .from('certifications')
    .select('*')
    .eq('id', id)
    .eq('tenant_id', ctx.tenantId)
    .single();

  if (!oldData) {
    return NextResponse.json({ error: 'Certification not found' }, { status: 404 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (ctx.supabase as any)
    .from('certifications')
    .update(body)
    .eq('id', id)
    .eq('tenant_id', ctx.tenantId)
    .select()
    .single();

  if (error) {
    console.error('Error updating certification:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Log to audit trail
  await logAudit(ctx, {
    table_name: 'certifications',
    record_id: id,
    action: 'UPDATE',
    old_data: oldData,
    new_data: data,
  });

  return NextResponse.json(data);
});

// DELETE /api/admin/certifications/[id] - Delete certification for current tenant
export const DELETE = withTenant<RouteContext>(async (ctx, request, context) => {
  const { id } = await context!.params;

  // Get data for audit log and verify ownership
  const { data: oldData } = await ctx.supabase
    .from('certifications')
    .select('*')
    .eq('id', id)
    .eq('tenant_id', ctx.tenantId)
    .single();

  if (!oldData) {
    return NextResponse.json({ error: 'Certification not found' }, { status: 404 });
  }

  const { error } = await ctx.supabase
    .from('certifications')
    .delete()
    .eq('id', id)
    .eq('tenant_id', ctx.tenantId);

  if (error) {
    console.error('Error deleting certification:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Log to audit trail
  await logAudit(ctx, {
    table_name: 'certifications',
    record_id: id,
    action: 'DELETE',
    old_data: oldData,
  });

  return NextResponse.json({ success: true });
});
