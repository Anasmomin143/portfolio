import { auth } from '@/lib/auth/auth';
import { getServiceSupabase } from '@/lib/supabase/client';
import { NextResponse } from 'next/server';

type RouteContext = {
  params: Promise<{ id: string }>;
};

// GET /api/admin/skills/[id]
export async function GET(request: Request, context: RouteContext) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const supabase = getServiceSupabase();

    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .eq('id', id)
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

// PUT /api/admin/skills/[id]
export async function PUT(request: Request, context: RouteContext) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const body = await request.json();
    const supabase = getServiceSupabase();

    const { data: oldData } = await supabase
      .from('skills')
      .select('*')
      .eq('id', id)
      .single();

    const { data, error } = await supabase
      .from('skills')
      .update(body)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating skill:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    await supabase.from('audit_log').insert({
      admin_user_id: session.user.id,
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

// DELETE /api/admin/skills/[id]
export async function DELETE(request: Request, context: RouteContext) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const supabase = getServiceSupabase();

    const { data: oldData } = await supabase
      .from('skills')
      .select('*')
      .eq('id', id)
      .single();

    const { error } = await supabase
      .from('skills')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting skill:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    await supabase.from('audit_log').insert({
      admin_user_id: session.user.id,
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
