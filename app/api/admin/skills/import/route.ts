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

// POST /api/admin/skills/import - Bulk import skills from JSON
export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const supabase = getServiceSupabase();

    // Validate that we have an array of skills
    if (!body.skills || !Array.isArray(body.skills)) {
      return NextResponse.json(
        { error: 'Invalid format: expected { skills: [...] }' },
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
    const requiredFields = ['id', 'name', 'category', 'proficiency'];

    // Check for existing skill IDs to avoid duplicates
    const skillIds = body.skills.map((s: { id?: string }) => s.id).filter(Boolean);
    const { data: existingSkills } = await supabase
      .from('skills')
      .select('id')
      .in('id', skillIds);

    const existingIds = new Set(existingSkills?.map((s) => s.id) || []);

    // Helper function to normalize field names (camelCase to snake_case)
    const normalizeSkill = (skill: Record<string, unknown>) => {
      return {
        id: skill.id,
        name: skill.name,
        category: skill.category,
        proficiency: skill.proficiency,
        years_of_experience: skill.years_of_experience || skill.yearsOfExperience,
        description: skill.description,
        display_order: skill.display_order || skill.displayOrder || 0,
      };
    };

    // Process each skill
    for (let i = 0; i < body.skills.length; i++) {
      const rawSkill = body.skills[i];
      const skill = normalizeSkill(rawSkill);

      try {
        // Validate required fields
        const missingFields = requiredFields.filter((field) => !skill[field]);
        if (missingFields.length > 0) {
          result.failed++;
          result.errors.push({
            index: i,
            error: `Missing required fields: ${missingFields.join(', ')}`,
            data: rawSkill,
          });
          continue;
        }

        // Validate proficiency range
        if (typeof skill.proficiency !== 'number' || skill.proficiency < 0 || skill.proficiency > 100) {
          result.failed++;
          result.errors.push({
            index: i,
            error: 'Proficiency must be a number between 0 and 100',
            data: rawSkill,
          });
          continue;
        }

        // Check for duplicate
        if (existingIds.has(skill.id as string)) {
          result.duplicates.push(skill.id as string);
          if (body.skipDuplicates !== false) {
            result.failed++;
            result.errors.push({
              index: i,
              error: `Skill with ID '${skill.id}' already exists`,
              data: rawSkill,
            });
            continue;
          }
        }

        // Insert the skill
        const { data, error } = await supabase
          .from('skills')
          .insert({
            id: skill.id,
            name: skill.name,
            category: skill.category,
            proficiency: skill.proficiency,
            years_of_experience: skill.years_of_experience || null,
            description: skill.description || null,
            display_order: skill.display_order || 0,
          })
          .select()
          .single();

        if (error) {
          result.failed++;
          result.errors.push({
            index: i,
            error: error.message,
            data: rawSkill,
          });
          continue;
        }

        // Log to audit trail
        await supabase.from('audit_log').insert({
          admin_user_id: session.user.id,
          table_name: 'skills',
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
          data: rawSkill,
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
