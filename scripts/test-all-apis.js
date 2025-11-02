#!/usr/bin/env node

/**
 * Test all resume API endpoints for all tenants
 */

const http = require('http');

// Read from .env.local
require('dotenv').config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing environment variables!');
  process.exit(1);
}

// First, get all tenants
const https = require('https');
const tenantsUrl = `${SUPABASE_URL}/rest/v1/tenants?select=id,subdomain,name,status&status=eq.active`;

const options = {
  headers: {
    'apikey': SUPABASE_SERVICE_KEY,
    'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
  }
};

console.log('\n🔍 Fetching tenants...\n');

https.get(tenantsUrl, options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    if (res.statusCode === 200) {
      const tenants = JSON.parse(data);

      if (tenants.length === 0) {
        console.log('⚠️  No active tenants found!\n');
        process.exit(0);
      }

      console.log(`Found ${tenants.length} active tenant(s)\n`);
      testAllEndpoints(tenants);
    } else {
      console.log('❌ Error fetching tenants:', res.statusCode);
      process.exit(1);
    }
  });
}).on('error', (err) => {
  console.error('❌ Connection error:', err.message);
  process.exit(1);
});

// API endpoints to test
const endpoints = [
  '/api/resume',
  '/api/resume/personal-details',
  '/api/resume/projects',
  '/api/resume/skills',
  '/api/resume/experience',
  '/api/resume/certifications',
  '/api/portfolio',
];

async function testEndpoint(subdomain, endpoint) {
  return new Promise((resolve) => {
    const url = `http://${subdomain}.localhost:3000${endpoint}`;

    const req = http.get(url, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        const statusIcon = res.statusCode === 200 ? '✅' : '❌';
        let dataPreview = '';

        try {
          const json = JSON.parse(responseData);
          if (Array.isArray(json)) {
            dataPreview = `(${json.length} items)`;
          } else if (json.error) {
            dataPreview = `Error: ${json.error}`;
          } else {
            dataPreview = '(object)';
          }
        } catch (e) {
          dataPreview = responseData.substring(0, 50);
        }

        console.log(`  ${statusIcon} ${res.statusCode} ${endpoint} ${dataPreview}`);
        resolve({ endpoint, status: res.statusCode, subdomain });
      });
    });

    req.on('error', (err) => {
      console.log(`  ❌ ERROR ${endpoint} - ${err.message}`);
      resolve({ endpoint, status: 'ERROR', error: err.message, subdomain });
    });

    req.setTimeout(5000, () => {
      req.destroy();
      console.log(`  ⏱️  TIMEOUT ${endpoint}`);
      resolve({ endpoint, status: 'TIMEOUT', subdomain });
    });
  });
}

async function testAllEndpoints(tenants) {
  const results = [];

  for (const tenant of tenants) {
    console.log(`\n📦 Testing tenant: ${tenant.name} (${tenant.subdomain})`);
    console.log(`   URL: http://${tenant.subdomain}.localhost:3000`);
    console.log('─'.repeat(60));

    for (const endpoint of endpoints) {
      const result = await testEndpoint(tenant.subdomain, endpoint);
      results.push(result);
    }
  }

  // Summary
  console.log('\n' + '═'.repeat(60));
  console.log('📊 SUMMARY');
  console.log('═'.repeat(60));

  const successCount = results.filter(r => r.status === 200).length;
  const failCount = results.filter(r => r.status !== 200).length;
  const totalTests = results.length;

  console.log(`\n✅ Successful: ${successCount}/${totalTests}`);
  console.log(`❌ Failed: ${failCount}/${totalTests}`);

  if (failCount > 0) {
    console.log('\n❌ Failed endpoints:');
    results
      .filter(r => r.status !== 200)
      .forEach(r => {
        console.log(`   - ${r.subdomain}: ${r.endpoint} (${r.status})`);
      });
  }

  console.log('\n✨ Testing complete!\n');
}
