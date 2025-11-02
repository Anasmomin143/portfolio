# Tenant Isolation Middleware

This directory contains utilities to simplify tenant isolation in API routes.

## Problem

Without middleware, every API route needs repetitive boilerplate:

```typescript
export async function GET() {
  // 1. Authenticate
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 2. Extract tenant
  const tenantId = (session.user as any).tenantId;
  if (!tenantId) {
    return NextResponse.json({ error: 'Tenant context required' }, { status: 400 });
  }

  // 3. Get supabase client
  const supabase = getServiceSupabase();

  // 4. Query with tenant filter
  const { data } = await supabase
    .from('projects')
    .select('*')
    .eq('tenant_id', tenantId);  // Must remember this!

  return NextResponse.json(data);
}
```

**Problems with this approach:**
- 10+ lines of boilerplate per route
- Easy to forget `.eq('tenant_id', tenantId)` filter
- Security risk if filter is missed
- Hard to maintain across many routes

## Solution: `withTenant()` Higher-Order Function

The `withTenant()` function handles authentication, tenant extraction, and error handling automatically.

### Basic Usage

```typescript
import { withTenant } from '@/lib/api/with-tenant';

// Simple GET - just 5 lines!
export const GET = withTenant(async ({ tenantId, supabase }) => {
  const { data } = await supabase
    .from('projects')
    .select('*')
    .eq('tenant_id', tenantId);

  return NextResponse.json(data);
});
```

### Context Properties

The `withTenant()` function provides a context object with:

```typescript
interface TenantContext {
  tenantId: string;          // Current tenant's ID
  userId: string;            // Current user's ID
  userEmail: string;         // Current user's email
  tenantSubdomain: string;   // Current tenant's subdomain
  supabase: SupabaseClient;  // Supabase client instance
}
```

### Complete Examples

#### 1. List Route (GET)

```typescript
import { withTenant } from '@/lib/api/with-tenant';

export const GET = withTenant(async ({ tenantId, supabase }) => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('tenant_id', tenantId)
    .order('display_order', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
});
```

#### 2. Create Route (POST)

```typescript
import { withTenant, logAudit } from '@/lib/api/with-tenant';

export const POST = withTenant(async (context, request) => {
  const body = await request.json();

  // Validate
  if (!body.name) {
    return NextResponse.json(
      { error: 'Missing required field: name' },
      { status: 400 }
    );
  }

  // Insert with tenant_id
  const { data, error } = await context.supabase
    .from('projects')
    .insert({
      ...body,
      tenant_id: context.tenantId,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Log to audit trail
  await logAudit(context, {
    table_name: 'projects',
    record_id: data.id,
    action: 'CREATE',
    new_data: data,
  });

  return NextResponse.json(data, { status: 201 });
});
```

#### 3. Update Route with Params (PUT)

```typescript
import { withTenant, logAudit } from '@/lib/api/with-tenant';

type RouteContext = {
  params: Promise<{ id: string }>;
};

export const PUT = withTenant<RouteContext>(async (ctx, request, routeContext) => {
  const { id } = await routeContext!.params;
  const body = await request.json();

  // Verify ownership
  const { data: oldData } = await ctx.supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .eq('tenant_id', ctx.tenantId)
    .single();

  if (!oldData) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  // Update
  const { data, error } = await ctx.supabase
    .from('projects')
    .update(body)
    .eq('id', id)
    .eq('tenant_id', ctx.tenantId)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Audit log
  await logAudit(ctx, {
    table_name: 'projects',
    record_id: id,
    action: 'UPDATE',
    old_data: oldData,
    new_data: data,
  });

  return NextResponse.json(data);
});
```

#### 4. Delete Route (DELETE)

```typescript
import { withTenant, logAudit } from '@/lib/api/with-tenant';

type RouteContext = {
  params: Promise<{ id: string }>;
};

export const DELETE = withTenant<RouteContext>(async (ctx, request, routeContext) => {
  const { id } = await routeContext!.params;

  // Verify ownership
  const { data: oldData } = await ctx.supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .eq('tenant_id', ctx.tenantId)
    .single();

  if (!oldData) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  // Delete
  const { error } = await ctx.supabase
    .from('projects')
    .delete()
    .eq('id', id)
    .eq('tenant_id', ctx.tenantId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Audit log
  await logAudit(ctx, {
    table_name: 'projects',
    record_id: id,
    action: 'DELETE',
    old_data: oldData,
  });

  return NextResponse.json({ success: true });
});
```

## Helper Functions

### `logAudit()`

Automatically logs to audit trail with tenant context:

```typescript
await logAudit(context, {
  table_name: 'projects',
  record_id: data.id,
  action: 'CREATE',  // 'CREATE' | 'UPDATE' | 'DELETE'
  new_data: data,
  old_data: oldData,  // optional
});
```

## Migration Guide

### Before (48 lines):

```typescript
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

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching projects:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

### After (10 lines):

```typescript
export const GET = withTenant(async ({ tenantId, supabase }) => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('tenant_id', tenantId)
    .order('display_order', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
});
```

**Benefits:**
- ✅ 80% less boilerplate code
- ✅ Automatic authentication
- ✅ Automatic tenant context extraction
- ✅ Automatic error handling
- ✅ Type-safe context object
- ✅ Works with route params
- ✅ Consistent error responses

## Converting Existing Routes

You can convert routes incrementally. The old and new patterns work side-by-side.

**Steps:**
1. Import `withTenant` and `logAudit`
2. Change `export async function GET()` to `export const GET = withTenant(async (context) => {`
3. Remove auth/tenant boilerplate
4. Use `context.tenantId`, `context.supabase`, etc.
5. Replace audit log calls with `logAudit(context, ...)`

**Example files:**
- `app/api/admin/certifications/route.refactored.ts` - List/Create routes
- `app/api/admin/certifications/[id]/route.refactored.ts` - Get/Update/Delete routes

These show the refactored pattern. You can copy this pattern to all other routes.
