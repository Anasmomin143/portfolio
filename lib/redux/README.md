# Redux Toolkit Setup

This project uses Redux Toolkit for centralized state management with global loading, error handling, and toast notifications.

## Architecture

```
lib/redux/
├── store.ts           # Redux store configuration
├── hooks.ts           # Typed hooks (useAppDispatch, useAppSelector)
├── provider.tsx       # Redux Provider component
└── slices/
    ├── uiSlice.ts              # Global UI state (loading, toasts)
    ├── projectsSlice.ts        # Projects CRUD
    ├── experienceSlice.ts      # Experience CRUD
    ├── skillsSlice.ts          # Skills CRUD
    └── certificationsSlice.ts  # Certifications CRUD
```

## Features

### 1. Centralized State Management
- All admin data in Redux store
- No prop drilling
- Single source of truth

### 2. Global Loading
- Root-level loading overlay
- Managed via `uiSlice`
- No per-page loading states needed

### 3. Global Toast Notifications
- Root-level toast provider
- Success, error, warning, info types
- Auto-dismiss with custom duration
- Managed via `uiSlice`

### 4. Centralized Error Handling
- Errors handled in slices
- Can be displayed globally or per-page
- Automatic error state management

## Usage

### Setup (Already Done)

The Redux store is wrapped in `/app/admin/layout.tsx`:

```tsx
<ReduxProvider>
  <AuthSessionProvider>
    <AdminLayoutWrapper>
      {children}
    </AdminLayoutWrapper>
    <ToastProvider />      {/* Global toasts */}
    <GlobalLoader />       {/* Global loading */}
  </AuthSessionProvider>
</ReduxProvider>
```

### Using Redux in Components

#### 1. Import Hooks and Actions

```tsx
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { fetchProjects, deleteProject } from '@/lib/redux/slices/projectsSlice';
import { addToast } from '@/lib/redux/slices/uiSlice';
```

#### 2. Access State and Dispatch

```tsx
export default function ProjectsPage() {
  const dispatch = useAppDispatch();
  const { items: projects, loading, error } = useAppSelector((state) => state.projects);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  // ... rest of component
}
```

#### 3. Dispatch Actions

**Fetch Data:**
```tsx
dispatch(fetchProjects());
```

**Create Item:**
```tsx
const newProject = { name: 'New Project', ... };
await dispatch(createProject(newProject)).unwrap();
```

**Update Item:**
```tsx
await dispatch(updateProject({ id: '123', name: 'Updated' })).unwrap();
```

**Delete Item:**
```tsx
await dispatch(deleteProject('123')).unwrap();
```

#### 4. Show Toasts

```tsx
// Success toast
dispatch(addToast({
  type: 'success',
  message: 'Project created successfully!',
}));

// Error toast
dispatch(addToast({
  type: 'error',
  message: 'Failed to delete project',
  duration: 5000, // optional, defaults to 5000ms
}));

// Info toast
dispatch(addToast({
  type: 'info',
  message: 'Processing your request...',
}));

// Warning toast
dispatch(addToast({
  type: 'warning',
  message: 'This action cannot be undone',
}));
```

#### 5. Global Loading

```tsx
import { setGlobalLoading } from '@/lib/redux/slices/uiSlice';

// Show global loader
dispatch(setGlobalLoading(true));

// Hide global loader
dispatch(setGlobalLoading(false));
```

### Complete Example

See `/app/admin/projects/page-redux.tsx` for a complete example.

```tsx
'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { fetchProjects, deleteProject } from '@/lib/redux/slices/projectsSlice';
import { addToast } from '@/lib/redux/slices/uiSlice';

export default function ProjectsPage() {
  const dispatch = useAppDispatch();
  const { items: projects, loading, error } = useAppSelector((state) => state.projects);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteProject(id)).unwrap();
      dispatch(addToast({
        type: 'success',
        message: 'Project deleted successfully',
      }));
    } catch (error) {
      dispatch(addToast({
        type: 'error',
        message: error as string,
      }));
    }
  };

  return (
    <DataWrapper loading={loading} error={error} onRetry={() => dispatch(fetchProjects())}>
      {/* Your content */}
    </DataWrapper>
  );
}
```

## Benefits

### Before (useFetch Hook)
```tsx
const { data, loading, error, refetch, setData } = useFetch({
  url: '/api/admin/projects',
  initialData: [],
});

// Manual toast with sonner
toast.success('Success!');
toast.error('Error!');

// Local loading state
if (loading) return <LoadingState />;
```

### After (Redux)
```tsx
const { items, loading, error } = useAppSelector((state) => state.projects);
dispatch(fetchProjects());

// Centralized toasts
dispatch(addToast({ type: 'success', message: 'Success!' }));

// Automatic loading from DataWrapper
<DataWrapper loading={loading} error={error}>
  {/* content */}
</DataWrapper>
```

### Advantages

1. **Single Source of Truth**: All data in Redux store
2. **Global Access**: Access data from any component
3. **Centralized Toasts**: Consistent toast notifications
4. **Global Loading**: Optional full-page loading overlay
5. **Better DevTools**: Redux DevTools for debugging
6. **Optimistic Updates**: Easy to implement
7. **Caching**: Data persists between route changes
8. **Type Safety**: Full TypeScript support

## State Structure

```typescript
{
  projects: {
    items: Project[],
    loading: boolean,
    error: string | null
  },
  experience: {
    items: Experience[],
    loading: boolean,
    error: string | null
  },
  skills: {
    items: Skill[],
    loading: boolean,
    error: string | null
  },
  certifications: {
    items: Certification[],
    loading: boolean,
    error: string | null
  },
  ui: {
    globalLoading: boolean,
    toasts: Toast[]
  }
}
```

## Migration Guide

To migrate from `useFetch` to Redux:

1. Remove `useFetch` hook
2. Add Redux hooks:
   ```tsx
   const dispatch = useAppDispatch();
   const { items, loading, error } = useAppSelector((state) => state.projects);
   ```
3. Replace fetch with dispatch:
   ```tsx
   // Before
   const { data, refetch } = useFetch({ url: '/api/...' });

   // After
   useEffect(() => {
     dispatch(fetchProjects());
   }, [dispatch]);
   ```
4. Replace manual toasts:
   ```tsx
   // Before
   toast.success('Success!');

   // After
   dispatch(addToast({ type: 'success', message: 'Success!' }));
   ```

## Best Practices

1. **Use `.unwrap()`** for async thunks to catch errors:
   ```tsx
   try {
     await dispatch(deleteProject(id)).unwrap();
     // Success
   } catch (error) {
     // Error handling
   }
   ```

2. **Dispatch toasts** after successful operations:
   ```tsx
   await dispatch(createProject(data)).unwrap();
   dispatch(addToast({ type: 'success', message: 'Created!' }));
   ```

3. **Use global loading** for critical operations:
   ```tsx
   dispatch(setGlobalLoading(true));
   await someOperation();
   dispatch(setGlobalLoading(false));
   ```

4. **Clear errors** when navigating away:
   ```tsx
   useEffect(() => {
     return () => {
       dispatch(clearError());
     };
   }, [dispatch]);
   ```
