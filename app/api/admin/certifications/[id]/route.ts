import { auth } from '@/lib/auth/auth';
import { getServiceSupabase } from '@/lib/supabase/client';
import { NextResponse } from 'next/server';
import type { Database } from '@/lib/supabase/database.types';

type RouteContext = {
  params: Promise<{ id: string }>;
};

// GET /api/admin/certifications/[id] - Get single certification for current tenant
export async function GET(request: Request, context: RouteContext) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const tenantId = (session.user as any).tenantId;

    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant context required' }, { status: 400 });
    }

    const { id } = await context.params;
    const supabase = getServiceSupabase();

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
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/admin/certifications/[id] - Update certification for current tenant
export async function PUT(request: Request, context: RouteContext) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const tenantId = (session.user as any).tenantId;

    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant context required' }, { status: 400 });
    }

    const { id } = await context.params;
    const body = await request.json() as Database['public']['Tables']['certifications']['Update'];
    const supabase = getServiceSupabase();

    // Get old data for audit log and verify ownership
    const { data: oldData } = await supabase
      .from('certifications')
      .select('*')
      .eq('id', id)
      .eq('tenant_id', tenantId)
      .single();

    if (!oldData) {
      return NextResponse.json({ error: 'Certification not found' }, { status: 404 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('certifications')
      .update(body)
      .eq('id', id)
      .eq('tenant_id', tenantId)
      .select()
      .single();

    if (error) {
      console.error('Error updating certification:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Log to audit trail with tenant context
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any).from('audit_log').insert({
      admin_user_id: session.user.id,
      tenant_id: tenantId,
      table_name: 'certifications',
      record_id: id,
      action: 'UPDATE',
      old_data: oldData,
      new_data: data,
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/admin/certifications/[id] - Delete certification for current tenant
export async function DELETE(request: Request, context: RouteContext) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const tenantId = (session.user as any).tenantId;

    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant context required' }, { status: 400 });
    }

    const { id } = await context.params;
    const supabase = getServiceSupabase();

    // Get data for audit log and verify ownership
    const { data: oldData } = await supabase
      .from('certifications')
      .select('*')
      .eq('id', id)
      .eq('tenant_id', tenantId)
      .single();

    if (!oldData) {
      return NextResponse.json({ error: 'Certification not found' }, { status: 404 });
    }

    const { error } = await supabase
      .from('certifications')
      .delete()
      .eq('id', id)
      .eq('tenant_id', tenantId);

    if (error) {
      console.error('Error deleting certification:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Log to audit trail with tenant context
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any).from('audit_log').insert({
      admin_user_id: session.user.id,
      tenant_id: tenantId,
      table_name: 'certifications',
      record_id: id,
      action: 'DELETE',
      old_data: oldData,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
