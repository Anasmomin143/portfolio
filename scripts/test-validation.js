#!/usr/bin/env node

/**
 * Validation Test Script
 * Tests all critical validation points in the application
 */

const http = require('http');

const tests = [];
let passed = 0;
let failed = 0;

// Test helper
function test(name, fn) {
  tests.push({ name, fn });
}

async function httpRequest(options, body = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            data: data ? JSON.parse(data) : null,
          });
        } catch {
          resolve({ status: res.statusCode, data });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

// =====================================
// VALIDATION TESTS
// =====================================

test('Subdomain check - valid existing subdomain', async () => {
  const res = await httpRequest({
    hostname: 'localhost',
    port: 3000,
    path: '/api/check-subdomain?subdomain=anas111',
    method: 'GET',
  });

  if (res.status === 200 && res.data.exists === true) {
    return { pass: true };
  }
  return { pass: false, message: 'Expected subdomain to exist' };
});

test('Subdomain check - non-existent subdomain', async () => {
  const res = await httpRequest({
    hostname: 'localhost',
    port: 3000,
    path: '/api/check-subdomain?subdomain=nonexistentxyz123',
    method: 'GET',
  });

  if (res.status === 200 && res.data.exists === false) {
    return { pass: true };
  }
  return { pass: false, message: 'Expected subdomain to not exist' };
});

test('Subdomain check - invalid format (too short)', async () => {
  const res = await httpRequest({
    hostname: 'localhost',
    port: 3000,
    path: '/api/check-subdomain?subdomain=ab',
    method: 'GET',
  });

  if (res.status === 200 && res.data.exists === false && res.data.error) {
    return { pass: true };
  }
  return { pass: false, message: 'Expected invalid format error' };
});

test('Subdomain check - missing parameter', async () => {
  const res = await httpRequest({
    hostname: 'localhost',
    port: 3000,
    path: '/api/check-subdomain',
    method: 'GET',
  });

  if (res.status === 400) {
    return { pass: true };
  }
  return { pass: false, message: 'Expected 400 for missing parameter' };
});

test('Register API - check availability of existing subdomain', async () => {
  const res = await httpRequest({
    hostname: 'localhost',
    port: 3000,
    path: '/api/register?subdomain=anas111',
    method: 'GET',
  });

  if (res.status === 200 && res.data.available === false) {
    return { pass: true };
  }
  return { pass: false, message: 'Expected subdomain to be unavailable' };
});

test('Register API - check availability of valid new subdomain', async () => {
  const randomSubdomain = 'test' + Date.now();
  const res = await httpRequest({
    hostname: 'localhost',
    port: 3000,
    path: `/api/register?subdomain=${randomSubdomain}`,
    method: 'GET',
  });

  if (res.status === 200 && res.data.available === true) {
    return { pass: true };
  }
  return { pass: false, message: 'Expected subdomain to be available' };
});

test('Register API - POST with missing fields', async () => {
  const res = await httpRequest(
    {
      hostname: 'localhost',
      port: 3000,
      path: '/api/register',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    {
      name: 'Test User',
      // Missing email, password, subdomain
    }
  );

  if (res.status === 400 && res.data.error) {
    return { pass: true };
  }
  return { pass: false, message: 'Expected 400 for missing fields' };
});

test('Register API - POST with invalid email', async () => {
  const res = await httpRequest(
    {
      hostname: 'localhost',
      port: 3000,
      path: '/api/register',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    {
      name: 'Test User',
      email: 'invalid-email',
      password: 'password123',
      subdomain: 'testuser123',
    }
  );

  if (res.status === 400 && res.data.error.includes('email')) {
    return { pass: true };
  }
  return { pass: false, message: 'Expected 400 for invalid email' };
});

test('Register API - POST with weak password', async () => {
  const res = await httpRequest(
    {
      hostname: 'localhost',
      port: 3000,
      path: '/api/register',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    {
      name: 'Test User',
      email: 'test@example.com',
      password: 'weak',
      subdomain: 'testuser123',
    }
  );

  if (res.status === 400 && res.data.error.includes('8 characters')) {
    return { pass: true };
  }
  return { pass: false, message: 'Expected 400 for weak password' };
});

test('Admin API - unauthorized access (no auth)', async () => {
  const res = await httpRequest({
    hostname: 'localhost',
    port: 3000,
    path: '/api/admin/projects',
    method: 'GET',
  });

  if (res.status === 401) {
    return { pass: true };
  }
  return { pass: false, message: 'Expected 401 for unauthorized access' };
});

test('Public resume API - valid subdomain', async () => {
  const res = await httpRequest({
    hostname: 'anas111.localhost',
    port: 3000,
    path: '/api/resume',
    method: 'GET',
  });

  if (res.status === 200 && res.data) {
    return { pass: true };
  }
  return { pass: false, message: 'Expected 200 with data' };
});

test('Public resume API - missing subdomain', async () => {
  const res = await httpRequest({
    hostname: 'localhost',
    port: 3000,
    path: '/api/resume',
    method: 'GET',
  });

  if (res.status === 400) {
    return { pass: true };
  }
  return { pass: false, message: 'Expected 400 for missing subdomain' };
});

test('Portfolio API - valid subdomain', async () => {
  const res = await httpRequest({
    hostname: 'anas111.localhost',
    port: 3000,
    path: '/api/portfolio',
    method: 'GET',
  });

  if (res.status === 200 && res.data && res.data.tenant) {
    return { pass: true };
  }
  return { pass: false, message: 'Expected 200 with tenant data' };
});

test('Portfolio API - missing subdomain', async () => {
  const res = await httpRequest({
    hostname: 'localhost',
    port: 3000,
    path: '/api/portfolio',
    method: 'GET',
  });

  if (res.status === 400) {
    return { pass: true };
  }
  return { pass: false, message: 'Expected 400 for missing subdomain' };
});

// =====================================
// RUN TESTS
// =====================================

async function runTests() {
  console.log('\n🧪 Running Validation Tests...\n');
  console.log('═'.repeat(70));

  for (const test of tests) {
    try {
      const result = await test.fn();
      if (result.pass) {
        console.log(`✅ PASS: ${test.name}`);
        passed++;
      } else {
        console.log(`❌ FAIL: ${test.name}`);
        if (result.message) console.log(`   → ${result.message}`);
        failed++;
      }
    } catch (error) {
      console.log(`❌ ERROR: ${test.name}`);
      console.log(`   → ${error.message}`);
      failed++;
    }
  }

  console.log('═'.repeat(70));
  console.log(`\n📊 Results: ${passed} passed, ${failed} failed out of ${tests.length} tests`);

  if (failed === 0) {
    console.log('✨ All validation tests passed!\n');
    process.exit(0);
  } else {
    console.log('⚠️  Some tests failed. Please review the output above.\n');
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Fatal error running tests:', err);
  process.exit(1);
});
