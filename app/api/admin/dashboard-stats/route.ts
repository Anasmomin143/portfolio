import { auth } from '@/lib/auth/auth';
import { getServiceSupabase } from '@/lib/supabase/client';
import { NextResponse } from 'next/server';

// GET /api/admin/dashboard-stats - Get dashboard statistics for current tenant
export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const tenantId = (session.user as any).tenantId;

    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant context required' }, { status: 400 });
    }

    const supabase = getServiceSupabase();

    // Fetch counts for each entity (filtered by tenant)
    const [projectsResult, experienceResult, skillsResult, certificationsResult, activityResult] = await Promise.all([
      supabase.from('projects').select('*', { count: 'exact', head: true }).eq('tenant_id', tenantId),
      supabase.from('experience').select('*', { count: 'exact', head: true }).eq('tenant_id', tenantId),
      supabase.from('skills').select('*', { count: 'exact', head: true }).eq('tenant_id', tenantId),
      supabase.from('certifications').select('*', { count: 'exact', head: true }).eq('tenant_id', tenantId),
      supabase
        .from('audit_log')
        .select(`
          id,
          action,
          table_name,
          created_at,
          admin_users:admin_user_id (
            email
          )
        `)
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false })
        .limit(10),
    ]);

    // Check for errors
    if (projectsResult.error) throw projectsResult.error;
    if (experienceResult.error) throw experienceResult.error;
    if (skillsResult.error) throw skillsResult.error;
    if (certificationsResult.error) throw certificationsResult.error;
    if (activityResult.error) throw activityResult.error;

    const stats = {
      projectsCount: projectsResult.count || 0,
      experienceCount: experienceResult.count || 0,
      skillsCount: skillsResult.count || 0,
      certificationsCount: certificationsResult.count || 0,
      recentActivity: activityResult.data || [],
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
