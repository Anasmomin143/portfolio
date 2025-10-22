# Quick Guide: Import Your Existing Projects

## ✅ Good News!

Your existing `data/resume.json` file can now be imported directly! The import feature now supports **both camelCase and snake_case** field names.

---

## 🚀 How to Import Your Projects

### Step 1: Extract Your Projects
Your current projects are in `data/resume.json` starting at line 72. Here's the structure:

```json
{
  "projects": [
    {
      "id": "proj-1",
      "name": "Capture Product",
      "company": "Elemica",
      "startDate": "2025-07-01",  ✅ camelCase works!
      "endDate": null,
      "current": true,
      ...
    }
  ]
}
```

### Step 2: Go to Import Page
1. Login to admin: `/admin/login`
2. Navigate to: `/admin/projects/import`

### Step 3: Import Your Data

**Option A: Copy from resume.json**
1. Open `data/resume.json`
2. Copy the entire `projects` array (with the wrapper)
3. Paste into the import text area
4. Click "Import Projects"

**Option B: Create a separate file**
1. Copy your projects from `data/resume.json`
2. Save as `my-projects.json`
3. Upload the file in the import interface

---

## 📋 Field Mapping

Your existing JSON uses **camelCase** which is now fully supported:

| Your Field | Database Field | Status |
|------------|----------------|--------|
| `startDate` | `start_date` | ✅ Auto-converted |
| `endDate` | `end_date` | ✅ Auto-converted |
| `demoUrl` | `demo_url` | ✅ Auto-converted |
| `githubUrl` | `github_url` | ✅ Auto-converted |
| `imageUrl` | `image_url` | ✅ Auto-converted |
| `displayOrder` | `display_order` | ✅ Auto-converted |

All other fields remain the same: `id`, `name`, `company`, `description`, `current`, `technologies`, `highlights`

---

## 🎯 Your Current Projects (Ready to Import)

Based on what I can see, you have **5 projects** ready to import:

1. **Capture Product** (Elemica) - Current
2. **Curacao Travel Edge** (Webvillee Technology)
3. **Axis Bank Travel Edge** (Webvillee Technology)
4. **SBI Cards Travel Edge** (Webvillee Technology)
5. **Indigo Hotel Booking** (Webvillee Technology)

---

## ⚠️ Before You Import

### Check These Fields

Your data looks good, but verify these required fields are present:
- ✅ `id` - Unique identifier
- ✅ `name` - Project name
- ✅ `company` - Company/client
- ✅ `description` - Description
- ✅ `startDate` - Start date (YYYY-MM-DD)
- ✅ `technologies` - Array of technologies

### Optional But Recommended
- `highlights` - Key achievements (you have these ✅)
- `current` - Set to `true` for ongoing projects ✅
- `endDate` - Set to `null` for current projects ✅

---

## 🔧 Quick Fix: Image URLs

I noticed your projects have `imageUrl` fields like:
```json
"imageUrl": "/images/projects/capture.jpg"
```

The import will save these to the `image_url` column in the database. Make sure these image files exist in your `public/images/projects/` folder, or you can:
- Set to `null` if images don't exist yet
- Update the paths after import
- Add the images to the public folder

---

## 📝 Sample Import (Your First Project)

Here's how your first project will look when imported:

```json
{
  "projects": [
    {
      "id": "proj-1",
      "name": "Capture Product",
      "company": "Elemica",
      "startDate": "2025-07-01",
      "endDate": null,
      "current": true,
      "description": "Order management and data capture dashboard automating supply chain digitalization across enterprise clients",
      "highlights": [
        "Built responsive interfaces with advanced form validation, real-time processing, and workflow management",
        "Developed data visualization components for supply chain analytics and reporting dashboards"
      ],
      "technologies": ["Angular", "TypeScript", "RxJS", "Tailwind CSS", "REST APIs"],
      "imageUrl": "/images/projects/capture.jpg",
      "demoUrl": null,
      "githubUrl": null
    }
  ]
}
```

This will import perfectly! ✅

---

## 🎉 Import Process

1. **Navigate**: Go to `/admin/projects/import`
2. **Paste/Upload**: Your JSON from `data/resume.json`
3. **Review**: Check the example if needed
4. **Import**: Click "Import Projects"
5. **Results**: You'll see:
   - ✅ 5 projects imported
   - ❌ 0 failed
   - ⚠️ 0 duplicates

6. **Redirect**: Automatically redirected to `/admin/projects`

---

## 🚨 Common Issues

### Issue: "Missing required field: start_date"
**Solution**: Make sure you're using `startDate` (camelCase) - it will be auto-converted!

### Issue: Duplicate IDs
**Solution**:
- First time import? Shouldn't happen
- Re-importing? Uncheck "Skip duplicates" or change IDs

### Issue: Invalid JSON
**Solution**:
- Make sure to copy the entire `projects` array with its wrapper
- Check for trailing commas
- Validate at [jsonlint.com](https://jsonlint.com)

---

## 🔄 After Import

Once imported, you can:
- ✅ View all projects at `/admin/projects`
- ✅ Edit individual projects
- ✅ Delete projects
- ✅ Add new projects
- ✅ Re-order with `display_order`

---

## 💡 Pro Tips

### Tip 1: Test with One Project First
Copy just the first project and test the import to verify everything works.

### Tip 2: Keep a Backup
Before importing, save a copy of your `data/resume.json` file.

### Tip 3: Display Order
Your projects don't have `displayOrder` set, so they'll default to `0`. After import, you can edit them to set custom ordering (1, 2, 3, etc.).

### Tip 4: Batch Import
You can import all 5 projects at once - no need to do them one by one!

---

## 📊 Expected Result

After importing your 5 projects, your admin panel will show:

```
Projects Dashboard
├─ Capture Product (Current) ⚡
├─ Curacao Travel Edge
├─ Axis Bank Travel Edge
├─ SBI Cards Travel Edge
└─ Indigo Hotel Booking

Total: 5 projects
```

---

## 🎯 Next Steps

1. **Import Now**: Use the guide above to import your projects
2. **Verify**: Check `/admin/projects` to see your imported data
3. **Edit**: Update any fields as needed
4. **Add Images**: Upload project images to `/public/images/projects/`
5. **Display**: Your portfolio will automatically show these projects!

---

## 🆘 Need Help?

If you encounter issues:
1. Check the error message in the import results
2. Verify your JSON format at [jsonlint.com](https://jsonlint.com)
3. Review `JSON_IMPORT_GUIDE.md` for detailed field requirements
4. Look at `sample-import.json` for a working example

---

**Ready to import? Let's go! 🚀**

Your projects are already in the perfect format - just copy and paste them into the import interface!
