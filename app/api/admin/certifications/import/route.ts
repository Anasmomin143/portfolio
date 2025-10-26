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

// POST /api/admin/certifications/import - Bulk import certifications from JSON
export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const supabase = getServiceSupabase();

    // Validate that we have an array of certifications
    if (!body.certifications || !Array.isArray(body.certifications)) {
      return NextResponse.json(
        { error: 'Invalid format: expected { certifications: [...] }' },
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
    const requiredFields = ['id', 'name', 'issuer', 'issue_date'];

    // Check for existing certification IDs to avoid duplicates
    const certIds = body.certifications.map((c: { id?: string }) => c.id).filter(Boolean);
    const { data: existingCerts } = await supabase
      .from('certifications')
      .select('id')
      .in('id', certIds);

    const existingIds = new Set(existingCerts?.map((c) => c.id) || []);

    // Helper function to normalize field names (camelCase to snake_case)
    const normalizeCertification = (cert: Record<string, unknown>) => {
      return {
        id: cert.id,
        name: cert.name,
        issuer: cert.issuer,
        issue_date: cert.issue_date || cert.issueDate,
        expiry_date: cert.expiry_date || cert.expiryDate,
        credential_id: cert.credential_id || cert.credentialId,
        credential_url: cert.credential_url || cert.credentialUrl,
        description: cert.description,
        display_order: cert.display_order || cert.displayOrder || 0,
      };
    };

    // Process each certification
    for (let i = 0; i < body.certifications.length; i++) {
      const rawCert = body.certifications[i];
      const cert = normalizeCertification(rawCert);

      try {
        // Validate required fields
        const missingFields = requiredFields.filter((field) => !cert[field]);
        if (missingFields.length > 0) {
          result.failed++;
          result.errors.push({
            index: i,
            error: `Missing required fields: ${missingFields.join(', ')}`,
            data: rawCert,
          });
          continue;
        }

        // Check for duplicate
        if (existingIds.has(cert.id as string)) {
          result.duplicates.push(cert.id as string);
          if (body.skipDuplicates !== false) {
            result.failed++;
            result.errors.push({
              index: i,
              error: `Certification with ID '${cert.id}' already exists`,
              data: rawCert,
            });
            continue;
          }
        }

        // Insert the certification
        const { data, error } = await supabase
          .from('certifications')
          .insert({
            id: cert.id,
            name: cert.name,
            issuer: cert.issuer,
            issue_date: cert.issue_date,
            expiry_date: cert.expiry_date || null,
            credential_id: cert.credential_id || null,
            credential_url: cert.credential_url || null,
            description: cert.description || null,
            display_order: cert.display_order || 0,
          })
          .select()
          .single();

        if (error) {
          result.failed++;
          result.errors.push({
            index: i,
            error: error.message,
            data: rawCert,
          });
          continue;
        }

        // Log to audit trail
        await supabase.from('audit_log').insert({
          admin_user_id: session.user.id,
          table_name: 'certifications',
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
          data: rawCert,
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
