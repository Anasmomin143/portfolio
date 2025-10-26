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

// POST /api/admin/experience/import - Bulk import experience from JSON
export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const supabase = getServiceSupabase();

    // Validate that we have an array of experience
    if (!body.experience || !Array.isArray(body.experience)) {
      return NextResponse.json(
        { error: 'Invalid format: expected { experience: [...] }' },
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
    const requiredFields = ['id', 'company', 'position', 'start_date', 'description'];

    // Check for existing experience IDs to avoid duplicates
    const experienceIds = body.experience.map((e: { id?: string }) => e.id).filter(Boolean);
    const { data: existingExperience } = await supabase
      .from('experience')
      .select('id')
      .in('id', experienceIds);

    const existingIds = new Set(existingExperience?.map((e) => e.id) || []);

    // Helper function to normalize field names (camelCase to snake_case)
    const normalizeExperience = (exp: Record<string, unknown>) => {
      return {
        id: exp.id,
        company: exp.company,
        position: exp.position,
        start_date: exp.start_date || exp.startDate,
        end_date: exp.end_date || exp.endDate,
        current: exp.current,
        description: exp.description,
        responsibilities: exp.responsibilities,
        technologies: exp.technologies,
        location: exp.location,
        display_order: exp.display_order || exp.displayOrder || 0,
      };
    };

    // Process each experience
    for (let i = 0; i < body.experience.length; i++) {
      const rawExperience = body.experience[i];
      const experience = normalizeExperience(rawExperience);

      try {
        // Validate required fields
        const missingFields = requiredFields.filter((field) => !experience[field]);
        if (missingFields.length > 0) {
          result.failed++;
          result.errors.push({
            index: i,
            error: `Missing required fields: ${missingFields.join(', ')}`,
            data: rawExperience,
          });
          continue;
        }

        // Check for duplicate
        if (existingIds.has(experience.id as string)) {
          result.duplicates.push(experience.id as string);
          if (body.skipDuplicates !== false) {
            result.failed++;
            result.errors.push({
              index: i,
              error: `Experience with ID '${experience.id}' already exists`,
              data: rawExperience,
            });
            continue;
          }
        }

        // Insert the experience
        const { data, error } = await supabase
          .from('experience')
          .insert({
            id: experience.id,
            company: experience.company,
            position: experience.position,
            start_date: experience.start_date,
            end_date: experience.current ? null : (experience.end_date || null),
            current: experience.current || false,
            description: experience.description,
            responsibilities: experience.responsibilities || [],
            technologies: experience.technologies || [],
            location: experience.location || null,
            display_order: experience.display_order || 0,
          })
          .select()
          .single();

        if (error) {
          result.failed++;
          result.errors.push({
            index: i,
            error: error.message,
            data: rawExperience,
          });
          continue;
        }

        // Log to audit trail
        await supabase.from('audit_log').insert({
          admin_user_id: session.user.id,
          table_name: 'experience',
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
          data: rawExperience,
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
