import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase/client';
import { getTenantSubdomain, getTenantBySubdomain } from '@/lib/utils/tenant-context';

/**
 * Public API endpoint to fetch complete portfolio data for a tenant
 * Used by public portfolio pages on subdomains
 * No authentication required - this is public data
 */
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

    // Fetch all portfolio data for this tenant
    const [personalDetails, projects, experience, skills, certifications] = await Promise.all([
      supabase
        .from('personal_details')
        .select('*')
        .eq('tenant_id', tenant.id)
        .single(),

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

    // Check for errors
    if (personalDetails.error && personalDetails.error.code !== 'PGRST116') {
      console.error('Error fetching personal details:', personalDetails.error);
    }
    if (projects.error) {
      console.error('Error fetching projects:', projects.error);
    }
    if (experience.error) {
      console.error('Error fetching experience:', experience.error);
    }
    if (skills.error) {
      console.error('Error fetching skills:', skills.error);
    }
    if (certifications.error) {
      console.error('Error fetching certifications:', certifications.error);
    }

    return NextResponse.json({
      tenant: {
        subdomain: tenant.subdomain,
        name: tenant.name,
        settings: tenant.settings || {},
      },
      personalDetails: personalDetails.data || null,
      projects: projects.data || [],
      experience: experience.data || [],
      skills: skills.data || [],
      certifications: certifications.data || [],
    });
  } catch (error) {
    console.error('Error fetching portfolio data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch portfolio data' },
      { status: 500 }
    );
  }
}
