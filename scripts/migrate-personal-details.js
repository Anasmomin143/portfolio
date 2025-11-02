#!/usr/bin/env node

/**
 * Run the personal details migration
 */

const fs = require('fs');
const https = require('https');

// Read from .env.local
require('dotenv').config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing environment variables!');
  process.exit(1);
}

// Read the SQL file
const sql = fs.readFileSync('supabase/migrations/add_personal_details.sql', 'utf8');

console.log('\n🔄 Running personal details migration...\n');

const url = new URL('/rest/v1/rpc/exec', SUPABASE_URL);

const options = {
  method: 'POST',
  headers: {
    'apikey': SUPABASE_SERVICE_KEY,
    'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
    'Content-Type': 'application/json',
  }
};

// Note: This is a simplified approach. For production, you should:
// 1. Use Supabase Dashboard SQL Editor
// 2. Use Supabase CLI: supabase db push
// 3. Use a proper database client like psql

console.log('📋 Migration SQL loaded from: supabase/migrations/add_personal_details.sql\n');
console.log('⚠️  To run this migration, please use one of these methods:\n');
console.log('🔵 Option 1 - Supabase Dashboard (RECOMMENDED):');
console.log('  1. Go to https://supabase.com/dashboard');
console.log('  2. Select your project');
console.log('  3. Click "SQL Editor" in the left sidebar');
console.log('  4. Copy the contents of: supabase/migrations/add_personal_details.sql');
console.log('  5. Paste into Supabase SQL Editor');
console.log('  6. Click "RUN"\n');
console.log('🔵 Option 2 - Using psql:');
console.log('  psql -U postgres -h db.xxx.supabase.co -d postgres -f supabase/migrations/add_personal_details.sql\n');
console.log('🔵 Option 3 - Using Supabase CLI:');
console.log('  supabase db push\n');
console.log('✅ The migration file is ready at: supabase/migrations/add_personal_details.sql\n');

process.exit(0);
