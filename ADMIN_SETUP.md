# Admin Panel Setup Guide

This guide will help you set up the admin panel for your portfolio.

## Prerequisites

1. **Supabase Account**: Sign up at [supabase.com](https://supabase.com)
2. **Node.js**: Ensure you have Node.js 18+ installed

## Step 1: Create Supabase Project

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Fill in the details:
   - **Name**: `portfolio-admin` (or your preferred name)
   - **Database Password**: Save this securely
   - **Region**: Choose closest to you
4. Wait for the project to be created (~2 minutes)

## Step 2: Get Supabase Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` (keep this secret!)

## Step 3: Run Database Migration

1. In Supabase dashboard, go to **SQL Editor**
2. Copy the entire contents of `supabase/schema.sql` from this project
3. Paste into the SQL Editor
4. Click **Run** to create all tables

## Step 4: Configure Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` with your values:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

   NEXTAUTH_SECRET=$(openssl rand -base64 32)
   NEXTAUTH_URL=http://localhost:3000

   ADMIN_EMAIL=your-email@example.com
   ADMIN_PASSWORD=your-secure-password
   ```

3. Generate `NEXTAUTH_SECRET`:
   ```bash
   openssl rand -base64 32
   ```

## Step 5: Create Admin User

Run the seed script to create your admin user:

```bash
npm run seed:admin
```

This will create an admin user with the credentials from your `.env.local` file.

## Step 6: Start the Application

```bash
npm run dev
```

## Step 7: Access Admin Panel

1. Navigate to: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
2. Login with your admin credentials
3. You should see the admin dashboard

## Admin Panel Features

- **Projects Management**: Add, edit, delete projects
- **Experience Management**: Manage work experience entries
- **Skills Management**: Update technical skills
- **Certifications Management**: Add/remove certifications
- **Secure Authentication**: Protected routes with NextAuth.js

## Changing Admin Password

1. Go to **Admin Panel** → **Settings**
2. Click "Change Password"
3. Enter current and new password
4. Recommended: Remove `ADMIN_EMAIL` and `ADMIN_PASSWORD` from `.env.local` after first login

## Troubleshooting

### "Invalid credentials" error
- Verify your `.env.local` file has correct Supabase credentials
- Check that you ran the database migration
- Ensure admin user was created by running `npm run seed:admin`

### Database connection errors
- Verify `NEXT_PUBLIC_SUPABASE_URL` is correct
- Check that your IP is not blocked in Supabase dashboard
- Ensure database is active (not paused)

### NextAuth errors
- Regenerate `NEXTAUTH_SECRET` if needed
- Verify `NEXTAUTH_URL` matches your domain
- Check that NextAuth API route is accessible at `/api/auth`

## Security Notes

⚠️ **Important Security Practices**:

1. **Never commit `.env.local`** - It's in `.gitignore` by default
2. **Use strong passwords** - Minimum 12 characters with mixed case, numbers, symbols
3. **Change default credentials** - If you used the example values, change them immediately
4. **Keep service role key secret** - This has admin access to your database
5. **Enable RLS in Supabase** - The migration script enables Row Level Security
6. **Use HTTPS in production** - Update `NEXTAUTH_URL` to your production domain

## Production Deployment

When deploying to production (Vercel, etc.):

1. Add all environment variables to your hosting platform
2. Update `NEXTAUTH_URL` to your production domain
3. Enable Supabase connection pooling if needed
4. Consider setting up database backups in Supabase

## Support

If you encounter issues:
1. Check the console for error messages
2. Verify all environment variables are set
3. Check Supabase logs in the dashboard
4. Review Next.js server logs
