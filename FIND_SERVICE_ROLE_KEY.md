# 🔑 How to Find Your Supabase Service Role Key

## Quick Video Guide
**Watch this official Supabase tutorial (30 seconds):**
https://supabase.com/docs/guides/api/api-keys

---

## 📸 Step-by-Step with Screenshots

### Step 1: Login to Supabase
Go to: **https://supabase.com**

Click **"Sign In"** (top right corner)

---

### Step 2: Open Your Project
After logging in, you'll see your projects dashboard.

Click on your project card (the one you created)

---

### Step 3: Click Settings Icon
Look at the **LEFT SIDEBAR** (vertical menu on the left side of the screen)

Scroll down to the bottom

You'll see an icon that looks like a **gear/cog ⚙️**

Click on **"Settings"**

---

### Step 4: Click API
After clicking Settings, a **submenu appears**

In this submenu, click on **"API"**

The full path is: `Settings > API`

---

### Step 5: Scroll to "Project API keys"
On the API page, **scroll down**

You're looking for a section with the heading: **"Project API keys"**

---

### Step 6: Find service_role Key
In the "Project API keys" section, you should see **TWO keys**:

```
┌──────────────────────────────────────────────┐
│  anon                                 public │
│  eyJhbGc... (visible)                        │
│  ✓ Safe to use in browser                   │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│  service_role                         secret │  ← THIS ONE!
│  •••••••••••••••••  [Reveal]  [Copy]         │
│  ⚠️  Never share publicly                    │
└──────────────────────────────────────────────┘
```

---

### Step 7: Reveal and Copy
1. Click the **"Reveal"** button (or eye icon 👁️)
2. The dots will turn into the actual key
3. Click the **"Copy"** button (or copy icon 📋)

---

## 🎯 Direct Links

Try clicking these direct links:

1. **Your Supabase Dashboard:**
   https://supabase.com/dashboard

2. **Your Project Settings (API):**
   https://app.supabase.com/project/cvpmawnnpcflalwvhwdw/settings/api

3. **Alternative URL format:**
   https://supabase.com/dashboard/project/cvpmawnnpcflalwvhwdw/settings/api

---

## 🚨 Troubleshooting

### "I don't see Settings in the sidebar"
- Make sure you clicked on your **project** (not just the dashboard)
- You should be INSIDE the project, not on the projects list page

### "I only see the anon key, not service_role"
- Scroll down more - the service_role key is below the anon key
- Try refreshing the page (Cmd/Ctrl + R)
- Make sure your project is fully initialized (wait 2-3 min if just created)

### "I'm not the project owner"
- Ask the project owner to share the service_role key with you securely
- Or create your own Supabase project

### "The Reveal button doesn't work"
- Try a different browser (Chrome, Firefox, Safari)
- Disable browser extensions temporarily
- Clear browser cache

---

## 🆘 Still Stuck?

If you **absolutely cannot find it**, we have alternatives:

### Option A: Use Browser Console
1. Go to the API settings page
2. Open browser developer tools (F12 or Cmd+Option+I)
3. Go to Console tab
4. Type this and press Enter:
   ```javascript
   document.querySelector('[data-test="service-role-key"]')?.textContent
   ```

### Option B: Contact Me
Tell me what you see:
- Screenshot of the Settings > API page
- What sidebar options do you see?
- Are you the project owner?

### Option C: Skip for Now
We can temporarily use a workaround to get you started:
- Use the anon key for now (limited functionality)
- Set up the service_role key later
- I can help you build the CRUD interfaces without running it first

---

## ✅ What to Do After You Find It

Once you copy the service_role key:

1. Open your project folder
2. Find `.env.local` file (create it if it doesn't exist)
3. Add this line:
   ```
   SUPABASE_SERVICE_ROLE_KEY=paste_your_copied_key_here
   ```
4. Save the file
5. Restart your dev server

---

## 📞 Need More Help?

I'm here to help! Tell me:
1. What URL are you on right now?
2. What do you see on the left sidebar?
3. Can you share a screenshot (with sensitive info blurred)?
