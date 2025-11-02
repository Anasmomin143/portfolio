import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase/client';
import { getTenantSubdomain, getTenantBySubdomain } from '@/lib/utils/tenant-context';

export async function GET() {
  try {
    // Get subdomain from middleware headers
    const subdomain = await getTenantSubdomain();

    if (!subdomain) {
      return NextResponse.json(
        { error: 'No subdomain provided' },
        { status: 400 }
      );
    }

    // Get tenant information
    const tenant = await getTenantBySubdomain(subdomain);

    if (!tenant) {
      return NextResponse.json(
        { error: 'Portfolio not found' },
        { status: 404 }
      );
    }

    const supabase = getServiceSupabase();

    // Fetch personal details for this tenant
    const { data, error } = await supabase
      .from('personal_details')
      .select('*')
      .eq('tenant_id', tenant.id)
      .single();

    if (error) {
      // If no record exists, return null instead of error
      if (error.code === 'PGRST116') {
        return NextResponse.json(null, {
          status: 200,
          headers: {
            'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
          },
        });
      }
      console.error('Error fetching personal details:', error);
      return NextResponse.json(
        { error: 'Failed to fetch personal details' },
        { status: 500 }
      );
    }

    return NextResponse.json(data, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch personal details' },
      { status: 500 }
    );
  }
}
