# Quick Start - Multi-Tenant Portfolio

You're seeing a 500 error because **the database migration hasn't been run yet**. Follow these steps to fix it:

## Step 1: Check Database Status

Run this command to see if the migration is needed:

```bash
npm run check:database
```

**If you see ❌**: The migration needs to be run (continue to Step 2)
**If you see ✅**: Migration is done! Skip to Step 3

---

## Step 2: Run the Database Migration

The migration creates the `tenants` table and other multi-tenant features.

### Option A: Using Supabase Dashboard (Easiest)

1. Go to your Supabase project: https://supabase.com/dashboard
2. Click **SQL Editor** in the left sidebar
3. Open this file: `supabase/migrations/add_multi_tenancy.sql`
4. **Copy ALL the contents** (it's a long file, ~280 lines)
5. **Paste into the SQL Editor**
6. Click **RUN** button (bottom right)
7. Wait for "Success. No rows returned"

### Option B: Using Command Line (If you have PostgreSQL tools)

```bash
# Replace with your actual database credentials
psql -U postgres -h your-host -d your-database -f supabase/migrations/add_multi_tenancy.sql
```

### Option C: Using Supabase CLI

```bash
supabase db push
```

---

## Step 3: Verify Migration Success

```bash
npm run check:database
```

You should now see ✅ success messages!

---

## Step 4: Start Development Server

```bash
npm run dev
```

---

## Step 5: Create Your First Portfolio

1. **Visit**: http://localhost:3000/register

2. **Fill in the form**:
   - Name: Your Name
   - Email: your@email.com
   - Password: (minimum 8 characters)
   - Subdomain: `yourname` (3-63 characters, letters/numbers/hyphens only)

3. **Click "Create Portfolio"**

4. **You'll be redirected to**: `yourname.localhost:3000/admin/login`

5. **Login** with your email and password

6. **Start managing your portfolio!**

---

## Step 6: Test Multi-Tenancy

Create a second account to test data isolation:

1. Visit http://localhost:3000/register again
2. Create different credentials with a different subdomain
3. Verify each subdomain shows only its own data

---

## Troubleshooting

### Still getting "Failed to create account"?

1. **Check the terminal** where `npm run dev` is running
2. Look for error messages in red
3. Common issues:
   - Missing environment variables (check `.env.local`)
   - Wrong Supabase credentials
   - Migration didn't run successfully

### Check Environment Variables

Ensure `.env.local` has:

```env
NEXT_PUBLIC_MAIN_DOMAIN=localhost:3000
NEXTAUTH_SECRET=your-secret-here
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key
```

Generate NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

### Browser Console Errors

1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for red error messages
4. Go to Network tab
5. Find the failing `/api/register` request
6. Check the Response to see the actual error

---

## What Happens After Registration?

1. A `tenant` record is created with your subdomain
2. An `admin_user` record is created (you, as the owner)
3. You're redirected to `yourname.localhost:3000/admin/login`
4. After login, you can manage:
   - Projects
   - Experience
   - Skills
   - Certifications
5. Your public portfolio appears at: `yourname.localhost:3000`

---

## Production Deployment

Once working locally:

1. **Configure DNS**: Add wildcard DNS record `* → your-server-ip`
2. **Update .env**: Change `NEXT_PUBLIC_MAIN_DOMAIN` to `yourdomain.com`
3. **SSL Certificate**: Ensure wildcard SSL (`*.yourdomain.com`)
4. **Deploy**: Push to Vercel/Netlify/your hosting
5. **Test**: Visit `yourdomain.com/register`

---

## Need More Help?

- **Full Guide**: See `IMPLEMENTATION_SUMMARY.md`
- **Technical Details**: See `MULTI_TENANT_SETUP.md`
- **Code Examples**: See `EXAMPLE_PORTFOLIO_PAGE.tsx`

**The key is Step 2 - running the migration!** Everything else will work once the database is set up.
