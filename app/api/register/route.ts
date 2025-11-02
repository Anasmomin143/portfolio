import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase/client';
import { hash } from 'bcryptjs';
import { isSubdomainAvailable } from '@/lib/utils/subdomain';

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  subdomain: string;
}

// POST /api/register - Create new tenant and owner account
export async function POST(request: Request) {
  try {
    console.log('=== Registration Request Started ===');
    const body: RegisterRequest = await request.json();
    const { name, email, password, subdomain } = body;
    console.log('Registration data:', { name, email, subdomain });

    // Validation
    if (!name || !email || !password || !subdomain) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Validate subdomain format and availability
    const normalizedSubdomain = subdomain.toLowerCase().trim();
    if (!isSubdomainAvailable(normalizedSubdomain)) {
      return NextResponse.json(
        { error: 'Subdomain is not available or invalid. Must be 3-63 characters, alphanumeric and hyphens only.' },
        { status: 400 }
      );
    }

    const supabase = getServiceSupabase();

    console.log('Checking for existing tenant with subdomain:', normalizedSubdomain);

    // Check if subdomain already exists
    const { data: existingTenant, error: tenantCheckError } = await supabase
      .from('tenants')
      .select('subdomain')
      .eq('subdomain', normalizedSubdomain)
      .single();

    if (tenantCheckError && tenantCheckError.code !== 'PGRST116') {
      // PGRST116 = not found (expected), any other error is a problem
      console.error('Error checking tenant:', tenantCheckError);
      console.error('ERROR DETAILS:', JSON.stringify(tenantCheckError, null, 2));

      if (tenantCheckError.message?.includes('relation "tenants" does not exist')) {
        return NextResponse.json(
          {
            error: 'Database not initialized. Please run the migration first.',
            details: 'Run: psql -U postgres -d your_db -f supabase/migrations/add_multi_tenancy.sql'
          },
          { status: 500 }
        );
      }

      throw tenantCheckError;
    }

    if (existingTenant) {
      return NextResponse.json(
        { error: 'Subdomain already taken' },
        { status: 409 }
      );
    }

    // Check if email already exists
    const { data: existingUser } = await supabase
      .from('admin_users')
      .select('email')
      .eq('email', email)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await hash(password, 12);

    // Create tenant
    const { data: tenant, error: tenantError } = await supabase
      .from('tenants')
      .insert({
        subdomain: normalizedSubdomain,
        name: name,
        owner_email: email,
        status: 'active',
        plan: 'free',
        settings: {},
      })
      .select()
      .single();

    if (tenantError || !tenant) {
      console.error('Error creating tenant:', tenantError);
      return NextResponse.json(
        { error: 'Failed to create account. Please try again.' },
        { status: 500 }
      );
    }

    // Create owner user
    const { data: user, error: userError } = await supabase
      .from('admin_users')
      .insert({
        email: email,
        password_hash: passwordHash,
        name: name,
        tenant_id: tenant.id,
        role: 'owner',
      })
      .select()
      .single();

    if (userError || !user) {
      console.error('Error creating user:', userError);

      // Rollback: delete tenant
      await supabase.from('tenants').delete().eq('id', tenant.id);

      return NextResponse.json(
        { error: 'Failed to create user account. Please try again.' },
        { status: 500 }
      );
    }

    // Success! Return tenant info
    return NextResponse.json(
      {
        success: true,
        tenant: {
          subdomain: tenant.subdomain,
          name: tenant.name,
        },
        message: 'Account created successfully! Redirecting to your portfolio...',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      {
        error: 'An unexpected error occurred. Please try again.',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// GET /api/register?subdomain=xxx - Check if subdomain is available
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const subdomain = searchParams.get('subdomain');

    if (!subdomain) {
      return NextResponse.json(
        { error: 'Subdomain parameter required' },
        { status: 400 }
      );
    }

    const normalizedSubdomain = subdomain.toLowerCase().trim();

    // Check format
    if (!isSubdomainAvailable(normalizedSubdomain)) {
      return NextResponse.json({
        available: false,
        error: 'Invalid subdomain format. Must be 3-63 characters, alphanumeric and hyphens only.',
      });
    }

    // Check database
    const supabase = getServiceSupabase();
    const { data, error: checkError } = await supabase
      .from('tenants')
      .select('subdomain')
      .eq('subdomain', normalizedSubdomain)
      .single();

    // Handle database errors (like table not existing)
    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Database error checking subdomain:', checkError);

      if (checkError.message?.includes('relation "tenants" does not exist')) {
        return NextResponse.json({
          available: false,
          error: 'Database not initialized. Please run the migration first.',
        });
      }

      throw checkError;
    }

    const available = !data;

    return NextResponse.json({
      available,
      subdomain: normalizedSubdomain,
      ...(available ? { message: 'Subdomain is available!' } : { error: 'Subdomain already taken' }),
    });
  } catch (error) {
    console.error('Subdomain check error:', error);
    return NextResponse.json(
      { error: 'Failed to check subdomain availability', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
