#!/usr/bin/env node

/**
 * Database Migration Check Script
 * Verifies that the multi-tenant migration has been run
 */

const https = require('https');

// Read from .env.local
require('dotenv').config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing environment variables!');
  console.error('Please ensure .env.local has:');
  console.error('  - NEXT_PUBLIC_SUPABASE_URL');
  console.error('  - SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const apiUrl = `${SUPABASE_URL}/rest/v1/tenants?select=id&limit=1`;

console.log('\n🔍 Checking database migration status...\n');

const options = {
  headers: {
    'apikey': SUPABASE_SERVICE_KEY,
    'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
  }
};

https.get(apiUrl, options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    if (res.statusCode === 200) {
      console.log('✅ SUCCESS! The tenants table exists.');
      console.log('✅ Multi-tenant migration has been run correctly.\n');
      console.log('You can now:');
      console.log('  1. Start the dev server: npm run dev');
      console.log('  2. Visit: http://localhost:3000/register');
      console.log('  3. Create your first portfolio!\n');
      process.exit(0);
    } else if (res.statusCode === 404 || res.statusCode === 400) {
      try {
        const error = JSON.parse(data);
        if (error.message?.includes('tenants') || error.message?.includes('relation') || error.message?.includes('schema cache')) {
          console.log('❌ MIGRATION NOT RUN');
          console.log('❌ The tenants table does not exist in your database.\n');
          console.log('📋 To fix this, run the migration:\n');
          console.log('🔵 Option 1 - Using Supabase Dashboard (RECOMMENDED):');
          console.log('  1. Go to https://supabase.com/dashboard');
          console.log('  2. Select your project');
          console.log('  3. Click "SQL Editor" in the left sidebar');
          console.log('  4. Open: supabase/migrations/add_multi_tenancy.sql in your editor');
          console.log('  5. Copy ALL contents (280+ lines)');
          console.log('  6. Paste into Supabase SQL Editor');
          console.log('  7. Click "RUN" (bottom right)\n');
          console.log('🔵 Option 2 - Using psql:');
          console.log('  psql -U postgres -h db.xxx.supabase.co -d postgres -f supabase/migrations/add_multi_tenancy.sql\n');
          console.log('🔵 Option 3 - Using Supabase CLI:');
          console.log('  supabase db push\n');
          console.log('After running, test again with: npm run check:database\n');
          process.exit(1);
        } else {
          console.log('❌ Unexpected error:', error.message || error);
          console.log('Full response:', data);
          process.exit(1);
        }
      } catch (e) {
        console.log('❌ Error parsing response:', data);
        process.exit(1);
      }
    } else {
      console.log('❌ Unexpected status code:', res.statusCode);
      console.log('Response:', data);
      process.exit(1);
    }
  });
}).on('error', (err) => {
  console.error('❌ Connection error:', err.message);
  console.error('\nPlease check:');
  console.error('  - Is your Supabase URL correct?');
  console.error('  - Is your service role key correct?');
  console.error('  - Can you access Supabase from this network?');
  process.exit(1);
});
