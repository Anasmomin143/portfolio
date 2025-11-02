#!/usr/bin/env node

/**
 * Check if personal_details table exists
 */

const https = require('https');

// Read from .env.local
require('dotenv').config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing environment variables!');
  process.exit(1);
}

const apiUrl = `${SUPABASE_URL}/rest/v1/personal_details?select=id&limit=1`;

console.log('\n🔍 Checking if personal_details table exists...\n');

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
      console.log('✅ SUCCESS! The personal_details table exists.');
      console.log('✅ Migration has been run correctly.\n');
      console.log('You can now:');
      console.log('  1. Access the admin panel: http://anas.localhost:3000/admin/personal-details');
      console.log('  2. Fill out your personal details');
      console.log('  3. View it publicly: http://anas.localhost:3000/api/resume/personal-details\n');
      process.exit(0);
    } else if (res.statusCode === 404 || res.statusCode === 400) {
      try {
        const error = JSON.parse(data);
        if (error.message?.includes('personal_details') || error.message?.includes('relation') || error.message?.includes('schema cache')) {
          console.log('❌ MIGRATION NOT RUN');
          console.log('❌ The personal_details table does not exist in your database.\n');
          console.log('📋 Please run the migration using one of these methods:\n');
          console.log('🔵 Option 1 - Using Supabase Dashboard (RECOMMENDED):');
          console.log('  1. Go to https://supabase.com/dashboard');
          console.log('  2. Select your project');
          console.log('  3. Click "SQL Editor" in the left sidebar');
          console.log('  4. Copy the contents of: supabase/migrations/add_personal_details.sql');
          console.log('  5. Paste into Supabase SQL Editor');
          console.log('  6. Click "RUN"\n');
          process.exit(1);
        }
      } catch (e) {
        console.log('❌ Error:', data);
      }
    }
    console.log('❌ Unexpected status code:', res.statusCode);
    console.log('Response:', data);
    process.exit(1);
  });
}).on('error', (err) => {
  console.error('❌ Connection error:', err.message);
  process.exit(1);
});
