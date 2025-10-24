# Confirmation Dialog Hook - Usage Examples

## 1. Basic Delete (Simplified)

```tsx
import { useDeleteConfirmation } from '@/hooks/use-delete-confirmation';

const { openDialog, ConfirmationDialog } = useDeleteConfirmation({
  onDelete: async (id) => {
    await fetch(`/api/items/${id}`, { method: 'DELETE' });
    setItems(items.filter(i => i.id !== id));
  },
  entityName: 'project'
});

// In JSX
<button onClick={() => openDialog({ id: item.id, name: item.name })}>Delete</button>
<ConfirmationDialog />
```

---

## 2. Custom Action with Info Toast

```tsx
import { useConfirmationDialog } from '@/hooks/use-delete-confirmation';

const { openDialog, ConfirmationDialog } = useConfirmationDialog({
  onConfirm: async (id) => {
    await fetch(`/api/projects/${id}/archive`, { method: 'POST' });
    setProjects(projects.map(p => p.id === id ? { ...p, archived: true } : p));
  },
  config: {
    title: 'Archive Project?',
    description: (item) => `Archive "${item.name}"? You can restore it later.`,
    actionLabel: 'Archive',
    actionButtonClass: 'bg-primary text-primary-foreground',
    cancelLabel: 'Keep Active',
    successMessage: (item) => `${item.name} has been archived`,
    successToastType: 'info', // info toast instead of success
    errorToastType: 'error',
  }
});
```

---

## 3. Publish Action with Warning Toast

```tsx
const { openDialog, ConfirmationDialog } = useConfirmationDialog({
  onConfirm: async (id, item) => {
    await fetch(`/api/posts/${id}/publish`, { method: 'POST' });
  },
  config: {
    title: 'Publish Post?',
    description: 'This will make the post visible to everyone.',
    actionLabel: 'Publish Now',
    actionButtonClass: 'bg-green-600 text-white hover:bg-green-700',
    successMessage: 'Post published successfully!',
    successToastType: 'success',
  }
});
```

---

## 4. Destructive Action with Custom Error Handling

```tsx
const { openDialog, ConfirmationDialog } = useConfirmationDialog({
  onConfirm: async (id) => {
    const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('User has active subscriptions');
  },
  config: {
    title: 'Delete User Account',
    description: (item) => (
      <>
        Delete <strong>{item.name}</strong>?
        <br />
        This will permanently remove all user data.
      </>
    ),
    actionLabel: 'Delete Forever',
    errorMessage: (error) => `Cannot delete: ${error.message}`,
    errorToastType: 'error',
  }
});
```

---

## 5. Silent Confirmation (No Toast)

```tsx
const { openDialog, ConfirmationDialog } = useConfirmationDialog({
  onConfirm: async (id) => {
    await updateSettings(id);
  },
  config: {
    title: 'Apply Changes?',
    description: 'Save the updated settings?',
    actionLabel: 'Save',
    actionButtonClass: 'bg-primary text-primary-foreground',
    showSuccessToast: false, // No success toast
    showErrorToast: true,     // But show errors
  }
});
```

---

## 6. Custom Success Message Based on Item

```tsx
const { openDialog, ConfirmationDialog } = useConfirmationDialog({
  onConfirm: async (id, item) => {
    await markAsComplete(id);
  },
  config: {
    title: 'Mark as Complete?',
    actionLabel: 'Complete',
    actionButtonClass: 'bg-green-600 text-white',
    successMessage: (item) => `"${item.name}" marked as complete! 🎉`,
    successToastType: 'success',
  }
});
```

---

## 7. Multiple Confirmation Dialogs in One Component

```tsx
// Delete confirmation
const deleteDialog = useDeleteConfirmation({
  onDelete: async (id) => { /* delete logic */ },
  entityName: 'project'
});

// Archive confirmation
const archiveDialog = useConfirmationDialog({
  onConfirm: async (id) => { /* archive logic */ },
  config: {
    title: 'Archive?',
    actionLabel: 'Archive',
    successToastType: 'info',
  }
});

// In JSX
<>
  <button onClick={() => deleteDialog.openDialog({ id, name })}>Delete</button>
  <button onClick={() => archiveDialog.openDialog({ id, name })}>Archive</button>

  <deleteDialog.ConfirmationDialog />
  <archiveDialog.ConfirmationDialog />
</>
```

---

## Available Configuration Options

```tsx
interface ConfirmationConfig {
  title?: string;                                    // Dialog title
  description?: string | ((item) => ReactNode);      // Static or dynamic description
  actionLabel?: string;                              // Confirm button text
  actionButtonClass?: string;                        // Confirm button styling
  cancelLabel?: string;                              // Cancel button text
  successMessage?: string | ((item) => string);      // Success toast message
  errorMessage?: string | ((error) => string);       // Error toast message
  successToastType?: 'success' | 'error' | 'info' | 'warning';  // Toast type
  errorToastType?: 'success' | 'error' | 'info' | 'warning';    // Toast type
  showSuccessToast?: boolean;                        // Show/hide success toast
  showErrorToast?: boolean;                          // Show/hide error toast
}
```

---

## Item Interface

```tsx
interface ConfirmationItem {
  id: string;           // Required
  name: string;         // Required
  [key: string]: any;   // Any additional custom data
}
```
