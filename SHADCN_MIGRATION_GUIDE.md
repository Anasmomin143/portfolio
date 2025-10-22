# Shadcn UI Migration Guide

## ✅ What's Been Set Up

### 1. Shadcn UI Installed
- ✅ Core configuration done
- ✅ 8 essential components added:
  - Button, Input, Label, Textarea
  - Select, Dialog, Alert, Table, Badge
  - Card

### 2. Reusable Admin Components Created

All located in `components/admin/`:

#### Form Components
- ✅ `FormInput` - Input fields with labels, validation, hints
- ✅ `FormTextarea` - Textarea with labels
- ✅ `FormSelect` - Dropdown select
- ✅ `ArrayInput` - Add/remove items (chips or list view)

#### Layout Components
- ✅ `PageHeader` - Page title with back button and actions
- ✅ `FormLayout` - Form wrapper with error handling
- ✅ `FormGrid` - Responsive grid for form fields
- ✅ `DataCard` - Card for displaying data with actions
- ✅ `EmptyState` - No data placeholder

---

## 📖 Component Usage Guide

### PageHeader

```tsx
import { PageHeader } from '@/components/admin';

<PageHeader
  title="Add New Experience"
  description="Create a new work experience entry"
  backHref="/admin/experience"
  backLabel="Back to Experience"
  action={{
    href: "/admin/experience/new",
    label: "Add Experience"
  }}
/>
```

### FormLayout

```tsx
import { FormLayout } from '@/components/admin';

<FormLayout
  onSubmit={handleSubmit}
  error={error}
  isLoading={loading}
  submitLabel="Create"
  cancelHref="/admin/experience"
>
  {/* Form fields here */}
</FormLayout>
```

### FormInput

```tsx
import { FormInput } from '@/components/admin';

<FormInput
  label="Company"
  value={formData.company}
  onChange={(value) => setFormData({ ...formData, company: value })}
  placeholder="e.g., Acme Corp"
  required
  hint="Enter the company name"
  error={errors.company}
/>
```

### FormTextarea

```tsx
import { FormTextarea } from '@/components/admin';

<FormTextarea
  label="Description"
  value={formData.description}
  onChange={(value) => setFormData({ ...formData, description: value })}
  rows={4}
  placeholder="Brief description..."
/>
```

### ArrayInput

```tsx
import { ArrayInput } from '@/components/admin';

// Chips variant (for tags/technologies)
<ArrayInput
  label="Technologies"
  value={formData.technologies}
  onChange={(value) => setFormData({ ...formData, technologies: value })}
  placeholder="e.g., React, TypeScript"
  variant="chips"
  required
/>

// List variant (for responsibilities/achievements)
<ArrayInput
  label="Responsibilities"
  value={formData.responsibilities}
  onChange={(value) => setFormData({ ...formData, responsibilities: value })}
  placeholder="Add a responsibility"
  variant="list"
/>
```

### FormGrid

```tsx
import { FormGrid } from '@/components/admin';

<FormGrid cols={2}>
  <FormInput label="First Name" {...} />
  <FormInput label="Last Name" {...} />
</FormGrid>
```

### DataCard

```tsx
import { DataCard, EditAction, DeleteAction } from '@/components/admin';

<DataCard
  actions={[
    EditAction({ href: `/admin/experience/${id}` }),
    DeleteAction({ onDelete: () => handleDelete(id) })
  ]}
>
  {/* Card content */}
  <h3>Title</h3>
  <p>Description</p>
</DataCard>
```

### EmptyState

```tsx
import { EmptyState } from '@/components/admin';

<EmptyState
  title="No experiences yet"
  description="Get started by adding your first work experience"
  action={{
    label: "Add Experience",
    href: "/admin/experience/new"
  }}
  icon={<Briefcase className="h-16 w-16" />}
/>
```

---

## 🔄 Migration Example

### Before (Old Way)

```tsx
// 400+ lines of repetitive code
<div className="min-h-screen flex" style={{ background: 'var(--color-background)' }}>
  <AdminSidebar user={{ email: '', name: 'Admin' }} />
  <div className="flex-1 lg:ml-64">
    <main className="p-6 lg:p-8">
      <div className="mb-8">
        <Link href="/admin/experience">
          <ArrowLeft className="w-4 h-4" />
          Back to Experience
        </Link>
        <h1 className="text-3xl font-bold">Add New Experience</h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl">
        <div className="rounded-xl p-6 mb-6" style={{ background: THEME_GRADIENTS.card }}>
          {error && (
            <div className="mb-6 p-4 rounded-lg" style={{ background: 'rgba(239, 68, 68, 0.1)' }}>
              <p style={{ color: '#ef4444' }}>{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Company *
              </label>
              <input
                type="text"
                required
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="e.g., Acme Corp"
                className="w-full px-4 py-3 rounded-lg outline-none"
                style={{ background: 'var(--color-background)', border: '1px solid var(--card-border)' }}
              />
            </div>
            {/* Repeat 50+ times... */}
          </div>
        </div>
      </form>
    </main>
  </div>
</div>
```

### After (New Way with Shadcn)

```tsx
// Clean, readable ~100 lines
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminSidebar, PageHeader, FormLayout, FormGrid, FormInput, ArrayInput } from '@/components/admin';

export default function NewExperiencePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    technologies: [] as string[],
    // ... other fields
  });

  const handleSubmit = async (e: React.FormEvent) => {
    // API call logic
  };

  return (
    <div className="min-h-screen flex bg-background">
      <AdminSidebar user={{ email: '', name: 'Admin' }} />
      <div className="flex-1 lg:ml-64">
        <main className="p-6 lg:p-8">
          <PageHeader
            title="Add New Experience"
            backHref="/admin/experience"
          />

          <FormLayout
            onSubmit={handleSubmit}
            error={error}
            isLoading={loading}
            cancelHref="/admin/experience"
          >
            <FormGrid>
              <FormInput
                label="Company"
                value={formData.company}
                onChange={(value) => setFormData({ ...formData, company: value })}
                required
              />

              <FormInput
                label="Position"
                value={formData.position}
                onChange={(value) => setFormData({ ...formData, position: value })}
                required
              />
            </FormGrid>

            <ArrayInput
              label="Technologies"
              value={formData.technologies}
              onChange={(value) => setFormData({ ...formData, technologies: value })}
              variant="chips"
              required
            />
          </FormLayout>
        </main>
      </div>
    </div>
  );
}
```

---

## 📊 Benefits

### Code Reduction
- **Before**: 400-500 lines per page
- **After**: 100-150 lines per page
- **Reduction**: 70% less code!

### Consistency
- All forms look the same
- Validation handled consistently
- Error messages styled uniformly

### Maintainability
- Change one component, update everywhere
- Easy to add new features
- Less duplication

### Accessibility
- Shadcn components are accessible by default
- Proper ARIA labels
- Keyboard navigation

---

## 🚀 Next Steps

### Option 1: Replace Existing Page
Replace `app/admin/experience/new/page.tsx` with `page_v2.tsx`:

```bash
mv app/admin/experience/new/page_v2.tsx app/admin/experience/new/page.tsx
```

### Option 2: Create All New Pages
I can create all remaining pages using these new components:

1. Experience edit page
2. Skills list, new, edit pages
3. Certifications list, new, edit pages

All will be:
- ✅ Clean and consistent
- ✅ 70% less code
- ✅ Fully accessible
- ✅ Easy to maintain

---

## 🎨 Customization

All components use Shadcn's theming system. You can customize in `globals.css`:

```css
:root {
  --primary: ...;
  --destructive: ...;
  --radius: ...;
}
```

---

## 📝 Import Pattern

Simple one-line imports:

```tsx
import {
  PageHeader,
  FormLayout,
  FormGrid,
  FormInput,
  FormTextarea,
  ArrayInput,
  DataCard,
  EmptyState,
} from '@/components/admin';
```

---

## ✅ Ready to Use

Everything is set up and ready! Just say the word and I'll:

1. Create all remaining CRUD pages with these components
2. Each page will be clean, consistent, and maintainable
3. Full functionality with 70% less code

**Would you like me to proceed with creating all remaining pages using Shadcn?**
