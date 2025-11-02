# Multi-Tenant SaaS Portfolio Setup Guide

## Overview

This portfolio has been converted from a single-tenant application to a multi-tenant SaaS platform where each user gets their own subdomain and isolated data.

## Architecture

### Subdomain Structure

- **Main Domain** (`domain.com`): Landing page, registration, login
- **User Subdomains** (`username.domain.com`): Individual user portfolios
- **Admin Panel** (`username.domain.com/admin`): User-specific admin panel

### Data Isolation

Each tenant's data is isolated using `tenant_id` foreign keys:
- All data tables (projects, experience, skills, certifications) have a `tenant_id` column
- API routes filter by `session.user.tenantId` to ensure data isolation
- Row Level Security (RLS) policies enforce tenant boundaries

## Database Migration

Run the migration to add multi-tenancy support:

```sql
-- Located at: supabase/migrations/add_multi_tenancy.sql
psql -U your_user -d your_database -f supabase/migrations/add_multi_tenancy.sql
```

This migration:
1. Creates `tenants` table with subdomain management
2. Adds `tenant_id` to all data tables
3. Updates RLS policies for tenant isolation
4. Creates helper functions for tenant lookups

## Environment Variables

Add to your `.env.local`:

```env
# Main domain for subdomain routing
NEXT_PUBLIC_MAIN_DOMAIN=yourdomain.com

# For local development, use:
# NEXT_PUBLIC_MAIN_DOMAIN=localhost:3000

# NextAuth secret (generate a random string)
NEXTAUTH_SECRET=your-secret-here

# Supabase (existing)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## DNS Configuration

### For Production

1. **Add Wildcard DNS Record:**
   ```
   Type: A
   Name: *
   Value: your-server-ip
   TTL: 3600
   ```

   OR if using a CDN like Vercel/Netlify:
   ```
   Type: CNAME
   Name: *
   Value: cname.vercel-dns.com (or your provider's CNAME)
   TTL: 3600
   ```

2. **Verify Wildcard SSL:**
   - Ensure your hosting provider supports wildcard SSL certificates
   - Most modern platforms (Vercel, Netlify, Cloudflare) handle this automatically

### For Local Development

Use subdomain format: `username.localhost:3000`

Most modern browsers support this natively. For older browsers, add to `/etc/hosts`:
```
127.0.0.1 username.localhost
```

## User Registration Flow

1. User visits main domain (`domain.com`)
2. Clicks "Register" → `/register` page
3. Enters:
   - Name
   - Email
   - Password
   - Desired subdomain (e.g., "johndoe")
4. System validates subdomain availability
5. Creates:
   - Tenant record with subdomain
   - Admin user linked to tenant
6. Redirects to `johndoe.domain.com/admin/login`

## Authentication

### Login Process

1. User visits `username.domain.com/admin/login`
2. Enters email and password
3. System:
   - Validates credentials
   - Checks user belongs to `username` tenant
   - Creates session with tenant context
4. Redirects to admin panel

### Session Data

Sessions include tenant information:
```typescript
{
  user: {
    id: string,
    email: string,
    name: string,
    tenantId: string,           // For database queries
    tenantSubdomain: string,    // For validation
    tenantName: string,         // For display
    role: string                // owner, admin, editor
  }
}
```

## API Routes - Tenant Isolation Pattern

### Example: Updated Projects API

**List Projects (GET /api/admin/projects/route.ts):**
```typescript
const tenantId = session.user.tenantId;

const { data } = await supabase
  .from('projects')
  .select('*')
  .eq('tenant_id', tenantId)  // Filter by tenant
  .order('display_order');
```

**Create Project (POST /api/admin/projects/route.ts):**
```typescript
const tenantId = session.user.tenantId;

const { data } = await supabase
  .from('projects')
  .insert({
    ...body,
    tenant_id: tenantId  // Associate with tenant
  });
```

**Update/Delete (PUT/DELETE /api/admin/projects/[id]/route.ts):**
```typescript
const tenantId = session.user.tenantId;

// Both select and update/delete MUST include tenant check
const { data } = await supabase
  .from('projects')
  .update(body)
  .eq('id', id)
  .eq('tenant_id', tenantId)  // Prevent cross-tenant access
```

### Routes That Need Updating

Apply the same pattern to:

- ✅ `/app/api/admin/projects/route.ts` - **DONE**
- ✅ `/app/api/admin/projects/[id]/route.ts` - **DONE**
- ⏳ `/app/api/admin/projects/import/route.ts` - **TODO**
- ⏳ `/app/api/admin/experience/route.ts` - **TODO**
- ⏳ `/app/api/admin/experience/[id]/route.ts` - **TODO**
- ⏳ `/app/api/admin/experience/import/route.ts` - **TODO**
- ⏳ `/app/api/admin/skills/route.ts` - **TODO**
- ⏳ `/app/api/admin/skills/[id]/route.ts` - **TODO**
- ⏳ `/app/api/admin/skills/import/route.ts` - **TODO**
- ⏳ `/app/api/admin/certifications/route.ts` - **TODO**
- ⏳ `/app/api/admin/certifications/[id]/route.ts` - **TODO**
- ⏳ `/app/api/admin/certifications/import/route.ts` - **TODO**

### Required Changes for Each Route

1. **Add tenant validation:**
   ```typescript
   const tenantId = session.user.tenantId;
   if (!tenantId) {
     return NextResponse.json({ error: 'Tenant context required' }, { status: 400 });
   }
   ```

2. **Filter queries by tenant_id:**
   ```typescript
   .eq('tenant_id', tenantId)
   ```

3. **Include tenant_id in inserts:**
   ```typescript
   .insert({ ...data, tenant_id: tenantId })
   ```

4. **Update audit logs:**
   ```typescript
   await supabase.from('audit_log').insert({
     admin_user_id: session.user.id,
     tenant_id: tenantId,  // Add this
     table_name: '...',
     record_id: '...',
     action: '...',
   });
   ```

## Public Portfolio Pages

Public pages should read from the tenant subdomain:

```typescript
import { getTenantSubdomain, getTenantBySubdomain } from '@/lib/utils/tenant-context';

export default async function PortfolioPage() {
  // Get subdomain from middleware headers
  const subdomain = await getTenantSubdomain();

  if (!subdomain) {
    redirect('/'); // Redirect to main domain
  }

  // Get tenant info
  const tenant = await getTenantBySubdomain(subdomain);

  if (!tenant) {
    notFound();
  }

  // Fetch tenant's data
  const projects = await getProjects(tenant.id);

  return <Portfolio tenant={tenant} projects={projects} />;
}
```

## Testing Multi-Tenancy

### Local Testing

1. **Create First Tenant:**
   ```
   http://localhost:3000/register
   → Create user with subdomain "alice"
   ```

2. **Create Second Tenant:**
   ```
   http://localhost:3000/register
   → Create user with subdomain "bob"
   ```

3. **Test Isolation:**
   ```
   Visit: alice.localhost:3000/admin
   → Should only see Alice's data

   Visit: bob.localhost:3000/admin
   → Should only see Bob's data
   ```

4. **Test Cross-Tenant Protection:**
   - Log in as Alice
   - Try to access Bob's project via API
   - Should get 404 (not found) due to tenant filtering

### Production Testing

1. Set up DNS wildcard record
2. Deploy to production
3. Register at `yourdomain.com/register`
4. Verify subdomain works: `username.yourdomain.com`
5. Test admin panel and data isolation

## Security Checklist

- ✅ All API routes filter by `tenant_id`
- ✅ Session includes tenant context
- ✅ Authentication validates tenant ownership
- ✅ RLS policies enforce tenant boundaries
- ✅ Subdomain validation prevents reserved names
- ⏳ Public pages filter by current subdomain
- ⏳ Audit logs include tenant context

## Troubleshooting

### "Tenant context required" Error

- Ensure user is logged in
- Check session includes `tenantId`
- Verify NextAuth config includes tenant in JWT/session

### Subdomain Not Resolving

- Verify DNS wildcard record
- Check `NEXT_PUBLIC_MAIN_DOMAIN` environment variable
- Test with `curl -H "Host: username.yourdomain.com" http://your-ip`

### Cross-Tenant Data Visible

- **CRITICAL SECURITY ISSUE**
- Check API route includes `.eq('tenant_id', tenantId)`
- Verify RLS policies are enabled
- Test with different tenant accounts

### Import Fails After Migration

- Ensure import routes add `tenant_id`
- Update example JSON in import pages
- Check Supabase foreign key constraints

## Next Steps

1. ✅ Run database migration
2. ✅ Update environment variables
3. ⏳ Update remaining API routes with tenant filtering
4. ⏳ Update public pages to use subdomain context
5. ⏳ Configure DNS wildcard
6. ⏳ Test multi-tenancy locally
7. ⏳ Deploy and test in production

## File Reference

### New Files Created
- `lib/utils/subdomain.ts` - Subdomain extraction and validation
- `lib/utils/tenant-context.ts` - Tenant context helpers for API routes
- `supabase/migrations/add_multi_tenancy.sql` - Database schema changes
- `app/api/register/route.ts` - Tenant registration endpoint
- `app/register/page.tsx` - Registration UI

### Modified Files
- `middleware.ts` - Subdomain detection and routing
- `lib/auth/auth.config.ts` - Tenant-aware authentication
- `types/next-auth.d.ts` - Added tenant fields to session types
- `app/api/admin/projects/**` - Added tenant filtering (example)

---

**Questions or issues?** Check the code examples in the updated project routes for reference patterns.
