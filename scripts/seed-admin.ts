#!/usr/bin/env tsx

/**
 * Admin User Seed Script
 *
 * This script creates an initial admin user in the Supabase database.
 * It reads credentials from environment variables.
 *
 * Usage: npm run seed:admin
 */

import { hash } from 'bcryptjs';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../lib/supabase/database.types';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env.local file
config({ path: resolve(process.cwd(), '.env.local') });

async function seedAdmin() {
  // Validate environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!supabaseUrl || !serviceRoleKey) {
    console.error('❌ Missing Supabase configuration.');
    console.error('Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local');
    process.exit(1);
  }

  if (!adminEmail || !adminPassword) {
    console.error('❌ Missing admin credentials.');
    console.error('Please ensure ADMIN_EMAIL and ADMIN_PASSWORD are set in .env.local');
    process.exit(1);
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(adminEmail)) {
    console.error('❌ Invalid email format:', adminEmail);
    process.exit(1);
  }

  // Validate password strength
  if (adminPassword.length < 8) {
    console.error('❌ Password must be at least 8 characters long.');
    process.exit(1);
  }

  console.log('🔧 Connecting to Supabase...');
  const supabase = createClient<Database>(supabaseUrl, serviceRoleKey);

  try {
    // Check if admin user already exists
    console.log('🔍 Checking for existing admin user...');
    const { data: existingUser } = await supabase
      .from('admin_users')
      .select('email')
      .eq('email', adminEmail)
      .single();

    if (existingUser) {
      console.log('⚠️  Admin user already exists with email:', adminEmail);
      console.log('To update the password, delete the existing user first in Supabase dashboard.');
      process.exit(0);
    }

    // Hash the password
    console.log('🔐 Hashing password...');
    const passwordHash = await hash(adminPassword, 12);

    // Create admin user
    console.log('👤 Creating admin user...');
    const { data: newUser, error } = await supabase
      .from('admin_users')
      .insert({
        email: adminEmail,
        password_hash: passwordHash,
        name: 'Admin',
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Failed to create admin user:', error.message);
      process.exit(1);
    }

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email:', newUser.email);
    console.log('🔑 User ID:', newUser.id);
    console.log('');
    console.log('🚀 You can now login at: http://localhost:3000/admin/login');
    console.log('');
    console.log('⚠️  IMPORTANT: For security, consider removing ADMIN_EMAIL and ADMIN_PASSWORD');
    console.log('   from your .env.local file after first login.');

  } catch (error) {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  }
}

// Run the seed function
seedAdmin();
