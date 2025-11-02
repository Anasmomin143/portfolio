import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase/client';

/**
 * Check if a subdomain exists and is active
 * Used by landing page to redirect existing users to login
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const subdomain = searchParams.get('subdomain');

    if (!subdomain) {
      return NextResponse.json(
        { error: 'Subdomain is required' },
        { status: 400 }
      );
    }

    // Validate subdomain format
    const validFormat = /^[a-z0-9][a-z0-9-]*[a-z0-9]$/;
    if (!validFormat.test(subdomain) || subdomain.length < 3 || subdomain.length > 63) {
      return NextResponse.json(
        { exists: false, error: 'Invalid subdomain format' },
        { status: 200 }
      );
    }

    const supabase = getServiceSupabase();

    // Check if subdomain exists and is active
    const { data, error } = await supabase
      .from('tenants')
      .select('id, subdomain, status')
      .eq('subdomain', subdomain.toLowerCase())
      .eq('status', 'active')
      .single();

    if (error) {
      // If error code is PGRST116, it means no rows found
      if (error.code === 'PGRST116') {
        return NextResponse.json({ exists: false }, { status: 200 });
      }

      console.error('Error checking subdomain:', error);
      return NextResponse.json(
        { error: 'Failed to check subdomain' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      exists: !!data,
      subdomain: data?.subdomain
    }, { status: 200 });

  } catch (error) {
    console.error('Unexpected error checking subdomain:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
