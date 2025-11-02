import { auth } from '@/lib/auth/auth';
import { getServiceSupabase } from '@/lib/supabase/client';
import { NextResponse } from 'next/server';

// GET /api/admin/personal-details - Get personal details for current tenant
export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const tenantId = session.user.tenantId;

    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant context required' }, { status: 400 });
    }

    const supabase = getServiceSupabase();

    const { data, error } = await supabase
      .from('personal_details')
      .select('*')
      .eq('tenant_id', tenantId)
      .single();

    if (error) {
      // If no record exists yet, return null instead of error
      if (error.code === 'PGRST116') {
        return NextResponse.json(null);
      }
      console.error('Error fetching personal details:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/admin/personal-details - Update or create personal details for current tenant
export async function PUT(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const tenantId = session.user.tenantId;

    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant context required' }, { status: 400 });
    }

    const body = await request.json();
    const supabase = getServiceSupabase();

    // Check if personal details already exist
    const { data: existing } = await supabase
      .from('personal_details')
      .select('id')
      .eq('tenant_id', tenantId)
      .single();

    let data, error;

    if (existing) {
      // Update existing record
      const result = await supabase
        .from('personal_details')
        .update({
          full_name: body.full_name,
          title: body.title,
          email: body.email,
          phone: body.phone,
          location: body.location,
          bio: body.bio,
          summary: body.summary,
          linkedin_url: body.linkedin_url,
          github_url: body.github_url,
          twitter_url: body.twitter_url,
          portfolio_url: body.portfolio_url,
          website_url: body.website_url,
          profile_photo_url: body.profile_photo_url,
          resume_url: body.resume_url,
          custom_fields: body.custom_fields || {},
        })
        .eq('tenant_id', tenantId)
        .select()
        .single();

      data = result.data;
      error = result.error;

      if (!error) {
        // Log to audit trail
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase.from('audit_log') as any).insert({
          admin_user_id: session.user.id,
          tenant_id: tenantId,
          table_name: 'personal_details',
          record_id: data.id,
          action: 'UPDATE',
          new_data: data,
        });
      }
    } else {
      // Create new record
      const result = await supabase
        .from('personal_details')
        .insert({
          tenant_id: tenantId,
          full_name: body.full_name,
          title: body.title,
          email: body.email,
          phone: body.phone,
          location: body.location,
          bio: body.bio,
          summary: body.summary,
          linkedin_url: body.linkedin_url,
          github_url: body.github_url,
          twitter_url: body.twitter_url,
          portfolio_url: body.portfolio_url,
          website_url: body.website_url,
          profile_photo_url: body.profile_photo_url,
          resume_url: body.resume_url,
          custom_fields: body.custom_fields || {},
        })
        .select()
        .single();

      data = result.data;
      error = result.error;

      if (!error) {
        // Log to audit trail
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase.from('audit_log') as any).insert({
          admin_user_id: session.user.id,
          tenant_id: tenantId,
          table_name: 'personal_details',
          record_id: data.id,
          action: 'CREATE',
          new_data: data,
        });
      }
    }

    if (error) {
      console.error('Error saving personal details:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
