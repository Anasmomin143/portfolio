import { auth } from '@/lib/auth/auth';
import { getServiceSupabase } from '@/lib/supabase/client';
import { NextResponse } from 'next/server';

type RouteContext = {
  params: Promise<{ id: string }>;
};

// GET /api/admin/skills/[id] - Get single skill for current tenant
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
      .from('skills')
      .select('*')
      .eq('id', id)
      .eq('tenant_id', tenantId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
      }
      console.error('Error fetching skill:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/admin/skills/[id] - Update skill for current tenant
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
    const body = await request.json();
    const supabase = getServiceSupabase();

    // Get old data for audit log and verify ownership
    const { data: oldData } = await supabase
      .from('skills')
      .select('*')
      .eq('id', id)
      .eq('tenant_id', tenantId)
      .single();

    if (!oldData) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
    }

    const { data, error } = await supabase
      .from('skills')
      .update(body)
      .eq('id', id)
      .eq('tenant_id', tenantId)
      .select()
      .single();

    if (error) {
      console.error('Error updating skill:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Log to audit trail with tenant context
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from('audit_log') as any).insert({
      admin_user_id: session.user.id,
      tenant_id: tenantId,
      table_name: 'skills',
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

// DELETE /api/admin/skills/[id] - Delete skill for current tenant
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
      .from('skills')
      .select('*')
      .eq('id', id)
      .eq('tenant_id', tenantId)
      .single();

    if (!oldData) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
    }

    const { error } = await supabase
      .from('skills')
      .delete()
      .eq('id', id)
      .eq('tenant_id', tenantId);

    if (error) {
      console.error('Error deleting skill:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Log to audit trail with tenant context
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from('audit_log') as any).insert({
      admin_user_id: session.user.id,
      tenant_id: tenantId,
      table_name: 'skills',
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
