# JSON Import Feature Guide

## Overview

The admin panel now supports bulk importing of projects through JSON data. You can import projects either by:
1. **Pasting JSON directly** into a text area
2. **Uploading a JSON file** from your computer

This feature is perfect for:
- Migrating existing project data
- Bulk adding multiple projects at once
- Backing up and restoring project data
- Sharing project configurations across environments

---

## How to Access

1. Navigate to `/admin/projects` in your admin panel
2. Click the **"Import JSON"** button in the top right
3. Or go directly to `/admin/projects/import`

---

## Import Methods

### Method 1: Paste JSON Text

1. Select the **"Paste JSON"** option
2. Copy your JSON data
3. Paste it into the text area
4. Click **"Import Projects"**

### Method 2: Upload JSON File

1. Select the **"Upload File"** option
2. Click the upload area or drag & drop a `.json` file
3. The file contents will be loaded automatically
4. Click **"Import Projects"**

---

## JSON Format

### Basic Structure

Your JSON must follow this structure. **Both snake_case and camelCase field names are supported:**

```json
{
  "projects": [
    {
      "id": "unique-project-id",
      "name": "Project Name",
      "company": "Company Name",
      "description": "Project description...",
      "start_date": "2024-01-01",
      "end_date": "2024-06-30",
      "current": false,
      "technologies": ["Tech1", "Tech2"],
      "highlights": ["Achievement 1", "Achievement 2"],
      "demo_url": "https://demo.example.com",
      "github_url": "https://github.com/user/repo",
      "display_order": 1
    }
  ]
}
```

**Or using camelCase (also supported):**

```json
{
  "projects": [
    {
      "id": "unique-project-id",
      "name": "Project Name",
      "company": "Company Name",
      "description": "Project description...",
      "startDate": "2024-01-01",
      "endDate": "2024-06-30",
      "current": false,
      "technologies": ["Tech1", "Tech2"],
      "highlights": ["Achievement 1", "Achievement 2"],
      "demoUrl": "https://demo.example.com",
      "githubUrl": "https://github.com/user/repo",
      "displayOrder": 1
    }
  ]
}
```

### Alternative Format

You can also use a simple array (without the `projects` wrapper):

```json
[
  {
    "id": "project-1",
    "name": "My Project",
    ...
  },
  {
    "id": "project-2",
    "name": "Another Project",
    ...
  }
]
```

---

## Field Reference

### Field Naming Convention

**Both naming conventions are supported:**
- **snake_case**: `start_date`, `end_date`, `demo_url`, `github_url`, `display_order`
- **camelCase**: `startDate`, `endDate`, `demoUrl`, `githubUrl`, `displayOrder`

You can use either convention in your JSON - the import will automatically convert them.

### Required Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `id` | string | Unique project identifier (lowercase, hyphens allowed) | `"my-awesome-project"` |
| `name` | string | Display name of the project | `"E-commerce Platform"` |
| `company` | string | Company or client name | `"Acme Corp"` |
| `description` | string | Full project description | `"Built a scalable..."` |
| `start_date` or `startDate` | string | Project start date (YYYY-MM-DD) | `"2024-01-15"` |
| `technologies` | array | List of technologies used (must have at least 1) | `["React", "Node.js"]` |

### Optional Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `end_date` or `endDate` | string\|null | Project end date (YYYY-MM-DD) | `"2024-06-30"` or `null` |
| `current` | boolean | Is this an ongoing project? | `true` or `false` |
| `highlights` | array | Key achievements/highlights | `["Reduced load time by 60%"]` |
| `demo_url` or `demoUrl` | string\|null | Live demo URL | `"https://demo.com"` |
| `github_url` or `githubUrl` | string\|null | GitHub repository URL | `"https://github.com/user/repo"` |
| `display_order` or `displayOrder` | number | Custom sort order | `1`, `2`, `3`, etc. |
| `image_url` or `imageUrl` | string\|null | Project image URL | `"/images/project.jpg"` |

---

## Field Validation Rules

### ID (`id`)
- Must be unique across all projects
- Lowercase letters, numbers, and hyphens only
- Cannot be empty

### Dates (`start_date`, `end_date`)
- Format: `YYYY-MM-DD`
- Example: `"2024-01-15"`
- `end_date` is automatically set to `null` if `current` is `true`

### Current Project (`current`)
- `true` = ongoing project (no end date)
- `false` = completed project (can have end date)

### Technologies (`technologies`)
- Must be a non-empty array
- Each technology should be a string
- Minimum 1 technology required

### Highlights (`highlights`)
- Optional array of strings
- Can be empty `[]`

### URLs (`demo_url`, `github_url`)
- Must be valid URLs if provided
- Can be `null` or empty string `""`
- Example: `"https://example.com"`

### Display Order (`display_order`)
- Number (integer)
- Lower numbers appear first
- Defaults to `0` if not provided

---

## Import Options

### Skip Duplicates

- **Checked (default)**: Projects with existing IDs will be skipped and reported as errors
- **Unchecked**: Attempts to import all projects (may cause database errors for duplicates)

**Recommendation**: Keep this enabled to prevent accidental overwrites.

---

## Import Results

After importing, you'll see a detailed report showing:

### Statistics
- ✅ **Successfully Imported**: Number of projects added
- ❌ **Failed**: Number of projects that encountered errors
- ⚠️ **Duplicates Skipped**: Number of projects with existing IDs

### Error Details
For each failed import, you'll see:
- Row number in the JSON
- Error message (missing field, invalid format, etc.)
- The actual data that failed (for debugging)

### Success Actions
- If all imports succeed, you'll be automatically redirected to the projects list after 2 seconds
- If some fail, review the errors and fix the JSON before re-importing

---

## Example Import Files

### Example 1: Single Project

```json
{
  "projects": [
    {
      "id": "portfolio-website",
      "name": "Personal Portfolio Website",
      "company": "Freelance",
      "description": "Built a modern portfolio website with Next.js and TypeScript",
      "start_date": "2024-01-01",
      "current": true,
      "technologies": ["Next.js", "TypeScript", "Tailwind CSS", "Vercel"],
      "highlights": [
        "Achieved 95+ Lighthouse score",
        "Implemented dark mode support",
        "Built with accessibility in mind (WCAG 2.1 AA)"
      ],
      "demo_url": "https://myportfolio.com",
      "github_url": "https://github.com/username/portfolio",
      "display_order": 1
    }
  ]
}
```

### Example 2: Multiple Projects

A sample file with 3 projects is included in `sample-import.json` at the root of your project.

**To use it:**
1. Go to `/admin/projects/import`
2. Select "Upload File"
3. Upload `sample-import.json`
4. Review the data and click "Import Projects"

Or copy the contents and paste them into the text area.

---

## Common Errors & Solutions

### Error: "Missing required field: X"
**Solution**: Ensure all required fields are present:
- `id`, `name`, `company`, `description`, `start_date`, `technologies`

### Error: "Technologies must be a non-empty array"
**Solution**: Add at least one technology:
```json
"technologies": ["React"]
```

### Error: "Project with ID 'X' already exists"
**Solution**:
- Change the `id` to a unique value, or
- Delete the existing project first, or
- Uncheck "Skip duplicates" (not recommended)

### Error: "Invalid JSON format"
**Solution**:
- Check for missing commas, brackets, or quotes
- Use a JSON validator like [jsonlint.com](https://jsonlint.com)
- Ensure proper escaping of special characters

### Error: "Invalid format: expected { projects: [...] }"
**Solution**: Wrap your array in a `projects` key:
```json
{
  "projects": [ ... ]
}
```

---

## Best Practices

### 1. **Validate Before Import**
- Use a JSON validator to check syntax
- Test with a small subset first (1-2 projects)
- Review all required fields

### 2. **Use Unique IDs**
- Make IDs descriptive: `ecommerce-platform` not `project-1`
- Use kebab-case: lowercase with hyphens
- Keep them short but meaningful

### 3. **Backup Existing Data**
- Export current projects before bulk imports
- Keep a copy of your JSON import files

### 4. **Organize by Date**
- Use `display_order` for custom sorting
- Start dates help with chronological ordering

### 5. **Complete Information**
- Add highlights to showcase achievements
- Include demo and GitHub URLs when available
- Write clear, concise descriptions

---

## API Endpoint

The import feature uses the following API endpoint:

**POST** `/api/admin/projects/import`

### Request Body
```json
{
  "projects": [...],
  "skipDuplicates": true
}
```

### Response Format
```json
{
  "success": true,
  "imported": 3,
  "failed": 0,
  "errors": [],
  "duplicates": []
}
```

---

## Security

- ✅ **Authentication Required**: Only authenticated admin users can import
- ✅ **Input Validation**: All fields are validated before insertion
- ✅ **Duplicate Protection**: Prevents accidental data overwrites
- ✅ **Audit Logging**: All imports are logged in the audit trail
- ✅ **Error Handling**: Comprehensive error reporting for debugging

---

## Troubleshooting

### Import Button Disabled
**Cause**: No JSON data entered
**Solution**: Paste JSON or upload a file first

### No Results After Import
**Check**:
1. Look for errors in the results section
2. Verify JSON format is correct
3. Check browser console for any errors
4. Ensure you're logged in as admin

### File Upload Not Working
**Try**:
1. Ensure file has `.json` extension
2. Check file size (should be reasonable, < 1MB)
3. Verify JSON is valid
4. Try pasting the content manually instead

---

## Future Enhancements

Possible improvements for future versions:
- [ ] Export existing projects to JSON
- [ ] CSV import support
- [ ] Drag & drop file upload
- [ ] Preview before import
- [ ] Update existing projects (not just create)
- [ ] Bulk delete by ID
- [ ] Import validation warnings (not just errors)

---

## Support

If you encounter issues:
1. Check the error messages carefully
2. Validate your JSON format
3. Review this guide for field requirements
4. Check the sample file for reference

---

**Happy Importing! 🚀**
