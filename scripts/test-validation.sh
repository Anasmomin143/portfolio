#!/bin/bash

# Validation Test Script
# Tests all critical validation points in the application

echo ""
echo "🧪 Running Validation Tests..."
echo ""
echo "═══════════════════════════════════════════════════════════════════════"

PASSED=0
FAILED=0

# Test helper function
test_endpoint() {
  local test_name="$1"
  local url="$2"
  local expected_status="$3"
  local expected_content="$4"
  local method="${5:-GET}"
  local data="$6"

  if [ "$method" = "POST" ]; then
    response=$(curl -s -w "\n%{http_code}" -X POST -H "Content-Type: application/json" -d "$data" "$url")
  else
    response=$(curl -s -w "\n%{http_code}" "$url")
  fi

  status_code=$(echo "$response" | tail -n1)
  body=$(echo "$response" | sed '$d')

  if [ "$status_code" = "$expected_status" ]; then
    if [ -z "$expected_content" ] || echo "$body" | grep -q "$expected_content"; then
      echo "✅ PASS: $test_name"
      ((PASSED++))
      return 0
    fi
  fi

  echo "❌ FAIL: $test_name"
  echo "   Expected status: $expected_status, Got: $status_code"
  [ -n "$expected_content" ] && echo "   Expected content: $expected_content"
  echo "   Response: ${body:0:100}..."
  ((FAILED++))
  return 1
}

# =====================================
# TESTS
# =====================================

echo ""
echo "📋 Testing Subdomain Validation..."
echo "───────────────────────────────────────────────────────────────────────"

test_endpoint \
  "Subdomain check - valid existing subdomain" \
  "http://localhost:3000/api/check-subdomain?subdomain=anas111" \
  "200" \
  '"exists":true'

test_endpoint \
  "Subdomain check - non-existent subdomain" \
  "http://localhost:3000/api/check-subdomain?subdomain=nonexistentxyz123" \
  "200" \
  '"exists":false'

test_endpoint \
  "Subdomain check - invalid format (too short)" \
  "http://localhost:3000/api/check-subdomain?subdomain=ab" \
  "200" \
  '"error"'

test_endpoint \
  "Subdomain check - missing parameter" \
  "http://localhost:3000/api/check-subdomain" \
  "400" \
  "required"

echo ""
echo "📋 Testing Registration API Validation..."
echo "───────────────────────────────────────────────────────────────────────"

test_endpoint \
  "Register - check existing subdomain availability" \
  "http://localhost:3000/api/register?subdomain=anas111" \
  "200" \
  '"available":false'

test_endpoint \
  "Register - check new subdomain availability" \
  "http://localhost:3000/api/register?subdomain=testuser$(date +%s)" \
  "200" \
  '"available":true'

test_endpoint \
  "Register - POST with missing fields" \
  "http://localhost:3000/api/register" \
  "400" \
  "required" \
  "POST" \
  '{"name":"Test User"}'

test_endpoint \
  "Register - POST with invalid email" \
  "http://localhost:3000/api/register" \
  "400" \
  "email" \
  "POST" \
  '{"name":"Test","email":"invalid","password":"password123","subdomain":"test123"}'

test_endpoint \
  "Register - POST with weak password" \
  "http://localhost:3000/api/register" \
  "400" \
  "8 characters" \
  "POST" \
  '{"name":"Test","email":"test@example.com","password":"weak","subdomain":"test123"}'

echo ""
echo "📋 Testing Admin API Authorization..."
echo "───────────────────────────────────────────────────────────────────────"

test_endpoint \
  "Admin API - unauthorized access" \
  "http://localhost:3000/api/admin/projects" \
  "401" \
  "Unauthorized"

echo ""
echo "📋 Testing Public Resume APIs..."
echo "───────────────────────────────────────────────────────────────────────"

test_endpoint \
  "Resume API - valid subdomain" \
  "http://anas111.localhost:3000/api/resume" \
  "200" \
  "tenant"

test_endpoint \
  "Resume API - missing subdomain" \
  "http://localhost:3000/api/resume" \
  "400" \
  "subdomain"

test_endpoint \
  "Portfolio API - valid subdomain" \
  "http://anas111.localhost:3000/api/portfolio" \
  "200" \
  "tenant"

test_endpoint \
  "Portfolio API - missing subdomain" \
  "http://localhost:3000/api/portfolio" \
  "400" \
  "subdomain"

test_endpoint \
  "Personal Details API - valid subdomain" \
  "http://anas111.localhost:3000/api/resume/personal-details" \
  "200"

# =====================================
# SUMMARY
# =====================================

TOTAL=$((PASSED + FAILED))

echo "═══════════════════════════════════════════════════════════════════════"
echo ""
echo "📊 Results: $PASSED passed, $FAILED failed out of $TOTAL tests"
echo ""

if [ $FAILED -eq 0 ]; then
  echo "✨ All validation tests passed!"
  echo ""
  exit 0
else
  echo "⚠️  Some tests failed. Please review the output above."
  echo ""
  exit 1
fi
