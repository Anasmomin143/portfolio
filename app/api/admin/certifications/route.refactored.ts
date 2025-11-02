import { NextResponse } from 'next/server';
import { withTenant, logAudit } from '@/lib/api/with-tenant';

// GET /api/admin/certifications - List all certifications for current tenant
export const GET = withTenant(async ({ tenantId, supabase }) => {
  const { data, error } = await supabase
    .from('certifications')
    .select('*')
    .eq('tenant_id', tenantId)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching certifications:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
});

// POST /api/admin/certifications - Create new certification for current tenant
export const POST = withTenant(async (context, request) => {
  const body = await request.json();

  // Validate required fields
  const requiredFields = ['name', 'issuer', 'issue_date'];
  for (const field of requiredFields) {
    if (!body[field]) {
      return NextResponse.json(
        { error: `Missing required field: ${field}` },
        { status: 400 }
      );
    }
  }

  // Insert with tenant_id for data isolation
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (context.supabase as any)
    .from('certifications')
    .insert({
      ...body,
      tenant_id: context.tenantId,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating certification:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Log to audit trail
  await logAudit(context, {
    table_name: 'certifications',
    record_id: data.id,
    action: 'CREATE',
    new_data: data,
  });

  return NextResponse.json(data, { status: 201 });
});
