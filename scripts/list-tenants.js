#!/usr/bin/env node

/**
 * List all tenants in the database
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

const apiUrl = `${SUPABASE_URL}/rest/v1/tenants?select=id,subdomain,name,status`;

const options = {
  headers: {
    'apikey': SUPABASE_SERVICE_KEY,
    'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
  }
};

console.log('\n📋 Listing all tenants...\n');

https.get(apiUrl, options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    if (res.statusCode === 200) {
      const tenants = JSON.parse(data);

      if (tenants.length === 0) {
        console.log('⚠️  No tenants found in database!\n');
        console.log('To create a tenant:');
        console.log('  1. Visit: http://localhost:3000/register');
        console.log('  2. Fill out the registration form');
        console.log('  3. After registration, access your portfolio at: http://<subdomain>.localhost:3000\n');
      } else {
        console.log(`Found ${tenants.length} tenant(s):\n`);
        tenants.forEach((tenant, i) => {
          console.log(`${i + 1}. Subdomain: ${tenant.subdomain}`);
          console.log(`   Name: ${tenant.name}`);
          console.log(`   Status: ${tenant.status}`);
          console.log(`   URL: http://${tenant.subdomain}.localhost:3000`);
          console.log(`   API: http://${tenant.subdomain}.localhost:3000/api/resume/projects\n`);
        });
      }
      process.exit(0);
    } else {
      console.log('❌ Error:', res.statusCode);
      console.log('Response:', data);
      process.exit(1);
    }
  });
}).on('error', (err) => {
  console.error('❌ Connection error:', err.message);
  process.exit(1);
});
