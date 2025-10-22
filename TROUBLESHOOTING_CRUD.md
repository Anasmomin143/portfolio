# Troubleshooting Edit & Delete for Projects

## Quick Fixes Applied

### 1. Fixed useEffect Warning in Edit Page
- ✅ Moved `fetchProject` function inside `useEffect`
- ✅ Fixed React Hook dependency warning

### 2. Added Missing `image_url` Column
- ✅ Updated schema to include `image_url VARCHAR(500)`
- ✅ Created migration file to add column to existing database

---

## Database Migration Required

If you already created the `projects` table, you need to add the `image_url` column:

### Option 1: Via Supabase Dashboard
1. Go to your Supabase project
2. Click "SQL Editor"
3. Run this SQL:
   ```sql
   ALTER TABLE projects ADD COLUMN IF NOT EXISTS image_url VARCHAR(500);
   ```

### Option 2: Drop and Recreate (if no data yet)
1. Go to Supabase → SQL Editor
2. Run:
   ```sql
   DROP TABLE IF EXISTS projects CASCADE;
   ```
3. Then run the full schema from `supabase/schema.sql`

---

## Testing Steps

### Test 1: Check if Server is Running
```bash
# From terminal
lsof -ti:3000
```
- **Expected**: Should show process IDs
- **If empty**: Run `npm run dev`

### Test 2: Check Database Connection
1. Open browser console (F12)
2. Go to `/admin/projects`
3. Look for any errors in console
4. Common errors:
   - "Unauthorized" → Not logged in
   - "Failed to fetch" → Server not running
   - "Column does not exist" → Need to run migration

### Test 3: Test Delete Functionality

#### From Browser Console:
```javascript
// 1. Make sure you're logged in to /admin/login first
// 2. Open browser console on /admin/projects
// 3. Try deleting a test project (replace 'test-id' with actual ID)

fetch('/api/admin/projects/test-id', {
  method: 'DELETE',
  credentials: 'include'
})
.then(r => r.json())
.then(console.log)
.catch(console.error);
```

**Expected responses:**
- ✅ Success: `{ success: true }`
- ❌ Error: `{ error: "..." }`

### Test 4: Test Edit Functionality

#### From Browser:
1. Go to `/admin/projects`
2. Click "Edit" on any project
3. **Check console for errors**
4. Modify a field (e.g., change name)
5. Click "Save Changes"
6. **Check console again**

#### From Browser Console:
```javascript
// Test fetching a single project
fetch('/api/admin/projects/test-id', {
  credentials: 'include'
})
.then(r => r.json())
.then(console.log)
.catch(console.error);
```

**Expected response:**
```json
{
  "id": "test-id",
  "name": "Project Name",
  "company": "Company",
  ...
}
```

---

## Common Issues & Solutions

### Issue 1: "Unauthorized" Error
**Symptoms:**
- API returns `{ error: "Unauthorized" }`
- Redirected to login page

**Solution:**
1. Make sure you're logged in: `/admin/login`
2. Email: `anasmomin064@gmail.com`
3. Password: `Admin@123`
4. Check if session is working:
   ```javascript
   // In browser console
   fetch('/api/admin/projects', {
     credentials: 'include'
   })
   .then(r => r.json())
   .then(console.log);
   ```

### Issue 2: "Column 'image_url' does not exist"
**Symptoms:**
- Error when importing projects
- Database error in console

**Solution:**
Run the migration:
```sql
ALTER TABLE projects ADD COLUMN IF NOT EXISTS image_url VARCHAR(500);
```

### Issue 3: Delete Button Not Responding
**Symptoms:**
- Click delete, nothing happens
- No confirmation dialog

**Solution:**
1. Check browser console for JavaScript errors
2. Make sure `handleDelete` function exists in `/admin/projects/page.tsx`
3. Verify the delete button onClick is bound:
   ```tsx
   onClick={() => handleDelete(project.id, project.name)}
   ```

### Issue 4: Edit Page Won't Load
**Symptoms:**
- Spinner keeps spinning
- Error message appears

**Solutions:**

**A. Check if project exists:**
```sql
SELECT * FROM projects WHERE id = 'your-project-id';
```

**B. Check browser console for:**
- Network errors (404, 500)
- CORS errors
- JavaScript errors

**C. Verify API route:**
```bash
# Should exist
ls app/api/admin/projects/[id]/route.ts
```

### Issue 5: Save Changes Not Working
**Symptoms:**
- Click "Save Changes", nothing happens
- Error message appears

**Solution:**
1. Open browser console
2. Check for validation errors:
   - Are all required fields filled?
   - At least 1 technology added?
3. Check network tab:
   - Is PUT request being sent?
   - What's the response?

---

## Step-by-Step Debugging

### Step 1: Verify Database Setup
```sql
-- Run in Supabase SQL Editor
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'projects';
```

**Expected columns:**
- id
- name
- company
- description
- start_date
- end_date
- current
- highlights
- technologies
- demo_url
- github_url
- image_url ← Should be here now
- display_order
- created_at
- updated_at

### Step 2: Check Admin User
```sql
SELECT id, email FROM admin_users;
```

**Expected:**
- At least one row with your admin email

### Step 3: Test API Manually

#### Test GET /api/admin/projects
```bash
# Won't work from terminal (needs auth), but try in browser console:
fetch('/api/admin/projects', { credentials: 'include' })
  .then(r => r.json())
  .then(console.log);
```

#### Test GET /api/admin/projects/[id]
```javascript
fetch('/api/admin/projects/proj-1', { credentials: 'include' })
  .then(r => r.json())
  .then(console.log);
```

#### Test PUT /api/admin/projects/[id]
```javascript
fetch('/api/admin/projects/proj-1', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({
    id: 'proj-1',
    name: 'Updated Name',
    company: 'Test Company',
    description: 'Test description',
    start_date: '2024-01-01',
    technologies: ['React'],
    highlights: [],
    current: false,
    display_order: 0
  })
})
.then(r => r.json())
.then(console.log);
```

#### Test DELETE /api/admin/projects/[id]
```javascript
fetch('/api/admin/projects/proj-1', {
  method: 'DELETE',
  credentials: 'include'
})
.then(r => r.json())
.then(console.log);
```

---

## Checklist Before Reporting Issue

- [ ] Dev server is running (`npm run dev`)
- [ ] Logged into admin panel
- [ ] Database migration applied (`image_url` column exists)
- [ ] Browser console checked for errors
- [ ] Network tab checked for failed requests
- [ ] Projects exist in database
- [ ] Service role key is set in `.env.local`

---

## Environment Variables Check

Verify your `.env.local` has these:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key  # ← CRITICAL for edit/delete

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret

# Admin credentials (optional, for seeding)
ADMIN_EMAIL=anasmomin064@gmail.com
ADMIN_PASSWORD=Admin@123
```

---

## Getting Detailed Error Info

### In Browser Console:
```javascript
// Enable detailed fetch logging
const originalFetch = window.fetch;
window.fetch = function(...args) {
  console.log('Fetch:', args);
  return originalFetch.apply(this, arguments)
    .then(response => {
      console.log('Response:', response.status, response.statusText);
      return response;
    })
    .catch(error => {
      console.error('Fetch error:', error);
      throw error;
    });
};
```

Then try edit/delete operations and watch the console.

---

## What To Check If Edit Still Not Working

1. **Is the edit page loading?**
   - Go to `/admin/projects/proj-1` (replace with actual ID)
   - Does it show the form with data?
   - Or does it show an error/spinner forever?

2. **Can you change values in the form?**
   - Type in the name field
   - Does it update?

3. **What happens when you click Save?**
   - Any console errors?
   - Does it say "Saving..."?
   - Does it redirect or show error?

4. **Check Network tab (F12 → Network)**
   - Click Save Changes
   - See a PUT request to `/api/admin/projects/[id]`?
   - What status code? (200, 401, 500?)
   - What's the response body?

---

## What To Check If Delete Still Not Working

1. **Does confirmation dialog appear?**
   - Click Delete button
   - See "Are you sure you want to delete...?"
   - If NO: JavaScript error in console

2. **After confirming, what happens?**
   - Does project disappear from list?
   - Or does nothing happen?
   - Any error messages?

3. **Check Network tab**
   - See DELETE request to `/api/admin/projects/[id]`?
   - Status code?
   - Response?

---

## Next Steps

1. **Run the database migration** (add `image_url` column)
2. **Restart dev server**: `Ctrl+C` then `npm run dev`
3. **Clear browser cache** and reload
4. **Test delete on one project**
5. **Test edit on one project**
6. **Check browser console** for any errors
7. **Report specific error messages** you see

---

## Quick Test Script

Paste this in browser console (on `/admin/projects` page while logged in):

```javascript
async function testCRUD() {
  console.log('=== Testing CRUD Operations ===');

  // Test 1: List projects
  console.log('\n1. Testing LIST:');
  const listRes = await fetch('/api/admin/projects', { credentials: 'include' });
  const projects = await listRes.json();
  console.log('Status:', listRes.status);
  console.log('Projects:', projects);

  if (projects.length === 0) {
    console.log('⚠️ No projects to test edit/delete. Create one first.');
    return;
  }

  const testProject = projects[0];
  console.log('\n📝 Using project:', testProject.id);

  // Test 2: Get single project
  console.log('\n2. Testing GET SINGLE:');
  const getRes = await fetch(`/api/admin/projects/${testProject.id}`, { credentials: 'include' });
  const project = await getRes.json();
  console.log('Status:', getRes.status);
  console.log('Project:', project);

  // Test 3: Update project
  console.log('\n3. Testing UPDATE:');
  const updateRes = await fetch(`/api/admin/projects/${testProject.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      ...project,
      name: project.name + ' (Updated)'
    })
  });
  const updated = await updateRes.json();
  console.log('Status:', updateRes.status);
  console.log('Updated:', updated);

  // Test 4: Delete (commented out for safety)
  console.log('\n4. Testing DELETE (skipped - uncomment to test):');
  console.log('// Uncomment next 3 lines to test delete');
  // const deleteRes = await fetch(`/api/admin/projects/${testProject.id}`, { method: 'DELETE', credentials: 'include' });
  // const deleteResult = await deleteRes.json();
  // console.log('Delete result:', deleteResult);

  console.log('\n=== Test Complete ===');
}

testCRUD();
```

---

**After running these tests, you should have specific error messages or success confirmations that will help identify the exact issue!**
