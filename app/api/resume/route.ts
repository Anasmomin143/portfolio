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

    // Fetch all data in parallel
    const [projects, experience, skills, certifications] = await Promise.all([
      supabase
        .from('projects')
        .select('*')
        .eq('tenant_id', tenant.id)
        .order('display_order', { ascending: true }),

      supabase
        .from('experience')
        .select('*')
        .eq('tenant_id', tenant.id)
        .order('display_order', { ascending: true }),

      supabase
        .from('skills')
        .select('*')
        .eq('tenant_id', tenant.id)
        .order('display_order', { ascending: true }),

      supabase
        .from('certifications')
        .select('*')
        .eq('tenant_id', tenant.id)
        .order('display_order', { ascending: true }),
    ]);

    return NextResponse.json(
      {
        tenant: {
          subdomain: tenant.subdomain,
          name: tenant.name,
        },
        projects: projects.data || [],
        experience: experience.data || [],
        skills: skills.data || [],
        certifications: certifications.data || [],
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        },
      }
    );
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch resume data' },
      { status: 500 }
    );
  }
}
