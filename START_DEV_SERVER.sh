#!/bin/bash

echo "🚀 Starting Next.js Development Server"
echo "======================================="
echo ""

# Kill any existing processes on port 3000
echo "1. Checking for processes on port 3000..."
if lsof -ti:3000 > /dev/null 2>&1; then
    echo "   ⚠️  Killing existing processes on port 3000..."
    lsof -ti:3000 | xargs kill -9
    sleep 1
fi

# Clean .next cache
echo "2. Cleaning .next cache..."
rm -rf .next
echo "   ✓ Cache cleaned"

# Start dev server
echo ""
echo "3. Starting development server..."
echo "   → http://localhost:3000"
echo "   → Admin: http://localhost:3000/admin"
echo ""
echo "Press Ctrl+C to stop"
echo "======================================="
echo ""

npm run dev
