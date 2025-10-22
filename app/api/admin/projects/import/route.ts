import { auth } from '@/lib/auth/auth';
import { getServiceSupabase } from '@/lib/supabase/client';
import { NextResponse } from 'next/server';

interface ImportResult {
  success: boolean;
  imported: number;
  failed: number;
  errors: Array<{ index: number; error: string; data?: unknown }>;
  duplicates: string[];
}

// POST /api/admin/projects/import - Bulk import projects from JSON
export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const supabase = getServiceSupabase();

    // Validate that we have an array of projects
    if (!body.projects || !Array.isArray(body.projects)) {
      return NextResponse.json(
        { error: 'Invalid format: expected { projects: [...] }' },
        { status: 400 }
      );
    }

    const result: ImportResult = {
      success: true,
      imported: 0,
      failed: 0,
      errors: [],
      duplicates: [],
    };

    // Required fields for validation
    const requiredFields = ['id', 'name', 'company', 'description', 'start_date', 'technologies'];

    // Check for existing project IDs to avoid duplicates
    const projectIds = body.projects.map((p: { id?: string }) => p.id).filter(Boolean);
    const { data: existingProjects } = await supabase
      .from('projects')
      .select('id')
      .in('id', projectIds);

    const existingIds = new Set(existingProjects?.map((p) => p.id) || []);

    // Helper function to normalize field names (camelCase to snake_case)
    const normalizeProject = (proj: Record<string, unknown>) => {
      return {
        id: proj.id,
        name: proj.name,
        company: proj.company,
        description: proj.description,
        start_date: proj.start_date || proj.startDate,
        end_date: proj.end_date || proj.endDate,
        current: proj.current,
        technologies: proj.technologies,
        highlights: proj.highlights,
        demo_url: proj.demo_url || proj.demoUrl,
        github_url: proj.github_url || proj.githubUrl,
        display_order: proj.display_order || proj.displayOrder || 0,
        image_url: proj.image_url || proj.imageUrl,
      };
    };

    // Process each project
    for (let i = 0; i < body.projects.length; i++) {
      const rawProject = body.projects[i];
      const project = normalizeProject(rawProject);

      try {
        // Validate required fields
        const missingFields = requiredFields.filter((field) => !project[field]);
        if (missingFields.length > 0) {
          result.failed++;
          result.errors.push({
            index: i,
            error: `Missing required fields: ${missingFields.join(', ')}`,
            data: rawProject,
          });
          continue;
        }

        // Check for duplicate
        if (existingIds.has(project.id as string)) {
          result.duplicates.push(project.id as string);
          if (body.skipDuplicates !== false) {
            result.failed++;
            result.errors.push({
              index: i,
              error: `Project with ID '${project.id}' already exists`,
              data: rawProject,
            });
            continue;
          }
        }

        // Validate technologies array
        if (!Array.isArray(project.technologies) || project.technologies.length === 0) {
          result.failed++;
          result.errors.push({
            index: i,
            error: 'Technologies must be a non-empty array',
            data: rawProject,
          });
          continue;
        }

        // Insert the project
        const { data, error } = await supabase
          .from('projects')
          .insert({
            id: project.id,
            name: project.name,
            company: project.company,
            description: project.description,
            start_date: project.start_date,
            end_date: project.current ? null : (project.end_date || null),
            current: project.current || false,
            technologies: project.technologies,
            highlights: project.highlights || [],
            demo_url: project.demo_url || null,
            github_url: project.github_url || null,
            display_order: project.display_order || 0,
          })
          .select()
          .single();

        if (error) {
          result.failed++;
          result.errors.push({
            index: i,
            error: error.message,
            data: rawProject,
          });
          continue;
        }

        // Log to audit trail
        await supabase.from('audit_log').insert({
          admin_user_id: session.user.id,
          table_name: 'projects',
          record_id: data.id,
          action: 'CREATE',
          new_data: data,
        });

        result.imported++;
      } catch (error) {
        result.failed++;
        result.errors.push({
          index: i,
          error: error instanceof Error ? error.message : 'Unknown error',
          data: rawProject,
        });
      }
    }

    // Set overall success flag
    result.success = result.failed === 0;

    return NextResponse.json(result, { status: result.success ? 201 : 207 });
  } catch (error) {
    console.error('Unexpected error during import:', error);
    return NextResponse.json(
      {
        error: 'Failed to parse import data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 400 }
    );
  }
}
