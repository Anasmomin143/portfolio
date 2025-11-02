import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase/client';
import { getTenantSubdomain, getTenantBySubdomain } from '@/lib/utils/tenant-context';

export async function GET() {
  try {
    const subdomain = await getTenantSubdomain();

    if (!subdomain) {
      return NextResponse.json(
        { error: 'No subdomain provided' },
        { status: 400 }
      );
    }

    const tenant = await getTenantBySubdomain(subdomain);

    if (!tenant) {
      return NextResponse.json(
        { error: 'Portfolio not found' },
        { status: 404 }
      );
    }

    const supabase = getServiceSupabase();

    const { data, error } = await supabase
      .from('experience')
      .select('*')
      .eq('tenant_id', tenant.id)
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching experience:', error);
      return NextResponse.json(
        { error: 'Failed to fetch experience data' },
        { status: 500 }
      );
    }

    return NextResponse.json(data || [], {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch experience data' },
      { status: 500 }
    );
  }
}
