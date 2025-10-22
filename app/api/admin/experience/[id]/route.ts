import { auth } from '@/lib/auth/auth';
import { getServiceSupabase } from '@/lib/supabase/client';
import { NextResponse } from 'next/server';

type RouteContext = {
  params: Promise<{ id: string }>;
};

// GET /api/admin/experience/[id] - Get single experience
export async function GET(request: Request, context: RouteContext) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const supabase = getServiceSupabase();

    const { data, error } = await supabase
      .from('experience')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Experience not found' }, { status: 404 });
      }
      console.error('Error fetching experience:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/admin/experience/[id] - Update experience
export async function PUT(request: Request, context: RouteContext) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const body = await request.json();
    const supabase = getServiceSupabase();

    // Get old data for audit log
    const { data: oldData } = await supabase
      .from('experience')
      .select('*')
      .eq('id', id)
      .single();

    const { data, error } = await supabase
      .from('experience')
      .update(body)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating experience:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Log to audit trail
    await supabase.from('audit_log').insert({
      admin_user_id: session.user.id,
      table_name: 'experience',
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

// DELETE /api/admin/experience/[id] - Delete experience
export async function DELETE(request: Request, context: RouteContext) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const supabase = getServiceSupabase();

    // Get data for audit log
    const { data: oldData } = await supabase
      .from('experience')
      .select('*')
      .eq('id', id)
      .single();

    const { error } = await supabase
      .from('experience')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting experience:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Log to audit trail
    await supabase.from('audit_log').insert({
      admin_user_id: session.user.id,
      table_name: 'experience',
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
