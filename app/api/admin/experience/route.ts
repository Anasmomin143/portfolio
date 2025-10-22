import { auth } from '@/lib/auth/auth';
import { getServiceSupabase } from '@/lib/supabase/client';
import { NextResponse } from 'next/server';

// GET /api/admin/experience - List all experience
export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = getServiceSupabase();

    const { data, error } = await supabase
      .from('experience')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching experience:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/admin/experience - Create new experience
export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const supabase = getServiceSupabase();

    // Validate required fields
    const requiredFields = ['company', 'position', 'start_date', 'technologies'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
    }

    const { data, error } = await supabase
      .from('experience')
      .insert(body)
      .select()
      .single();

    if (error) {
      console.error('Error creating experience:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Log to audit trail
    await supabase.from('audit_log').insert({
      admin_user_id: session.user.id,
      table_name: 'experience',
      record_id: data.id,
      action: 'CREATE',
      new_data: data,
    });

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
