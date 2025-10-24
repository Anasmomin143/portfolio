#!/bin/bash
echo "=== Checking for common issues ==="
echo ""

echo "1. Checking for syntax errors in recent changes..."
npx tsc --noEmit 2>&1 | head -20

echo ""
echo "2. Checking environment variables..."
if [ -f .env.local ]; then
    echo "✓ .env.local exists"
    echo "Environment variables present:"
    grep -v "^#" .env.local | grep -v "^$" | cut -d'=' -f1
else
    echo "✗ .env.local not found!"
fi

echo ""
echo "3. Checking for .next cache..."
if [ -d .next ]; then
    echo "✓ .next directory exists (may need cleaning)"
else
    echo "✗ No .next cache"
fi

echo ""
echo "4. Checking for port conflicts..."
lsof -ti:3000 2>/dev/null && echo "⚠ Port 3000 is in use!" || echo "✓ Port 3000 is free"

