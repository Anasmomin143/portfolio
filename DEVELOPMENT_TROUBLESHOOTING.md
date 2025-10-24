# Development Server Troubleshooting Guide

## Problem: 500 Errors or "Internal Server Not Found" During Development

### Quick Solutions (Try in order)

#### 1. **Clean Cache and Restart** (Fastest)
```bash
npm run dev:clean
```
This removes the `.next` cache and starts fresh.

#### 2. **Try Turbo Mode** (Faster rebuilds)
```bash
npm run dev:turbo
```
Uses Next.js Turbo mode for faster development.

#### 3. **Full Clean**
```bash
# Clean everything
npm run clean

# Reinstall dependencies (if needed)
rm -rf node_modules package-lock.json
npm install

# Start dev server
npm run dev
```

#### 4. **Kill Existing Processes**
```bash
# Kill any process using port 3000
lsof -ti:3000 | xargs kill -9

# Or use npx
npx kill-port 3000

# Then restart
npm run dev
```

---

## Common Causes & Solutions

### 1. **Cache Corruption**
**Symptoms:** Random 500 errors, module not found errors

**Solution:**
```bash
rm -rf .next
npm run dev
```

### 2. **Port Already in Use**
**Symptoms:** "Port 3000 is already in use"

**Solution:**
```bash
# Find and kill the process
lsof -ti:3000 | xargs kill -9

# Or change port
PORT=3001 npm run dev
```

### 3. **Memory Issues**
**Symptoms:** Slow builds, crashes, 500 errors

**Solution:**
```bash
# Increase Node memory
NODE_OPTIONS="--max-old-space-size=4096" npm run dev
```

### 4. **File Watching Issues (WSL/Docker)**
**Symptoms:** Changes not detected, stale code

**Solution:**
- Already configured in `next.config.ts` with `watchOptions`
- If still issues, try `npm run dev:turbo`

### 5. **TypeScript Errors**
**Symptoms:** Red errors in terminal, type errors

**Solution:**
```bash
# Check types
npx tsc --noEmit

# Or ignore during dev (not recommended)
# Add to next.config.ts:
# typescript: { ignoreBuildErrors: true }
```

---

## Best Practices for Development

1. **Always use `npm run dev:clean` after:**
   - Pulling new code from Git
   - Switching branches
   - Installing new packages
   - Major code refactoring

2. **Restart dev server regularly:**
   - After adding new environment variables
   - After modifying `next.config.ts`
   - After updating dependencies

3. **Monitor your terminal:**
   - Look for build errors
   - Check for deprecation warnings
   - Watch for memory warnings

4. **Use the right script:**
   - `npm run dev` - Normal development
   - `npm run dev:clean` - Clean start
   - `npm run dev:turbo` - Faster rebuilds

---

## Still Having Issues?

### Check Browser Console
1. Open DevTools (F12)
2. Look for errors in Console tab
3. Check Network tab for failed requests

### Check Server Logs
- Look at terminal output
- Check for stack traces
- Note the specific error messages

### Nuclear Option
```bash
# Complete reset
rm -rf .next node_modules package-lock.json
npm install
npm run dev
```

### Create a Clean Test
```bash
# Create new page to test
# If it works, issue is in specific component
# If it fails, issue is in config/setup
```

---

## Environment Variables

If using `.env` files:

```bash
# After changing .env files, restart:
# Stop server (Ctrl+C)
npm run dev:clean
```

Common env issues:
- Missing required variables
- Wrong variable names
- Values with spaces (use quotes)
- `.env.local` not loaded (should be)

---

## Need More Help?

1. Check Next.js docs: https://nextjs.org/docs
2. Check error in browser console
3. Check server terminal output
4. Search error on GitHub issues
5. Try `npm run dev:turbo` for better error messages
