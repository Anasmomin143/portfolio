"use client"

import { useState, ReactNode } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

interface ConfirmationItem {
  id: string;
  name: string;
  [key: string]: any; // Allow additional custom data
}

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ConfirmationConfig {
  title?: string;
  description?: string | ((item: ConfirmationItem) => ReactNode);
  actionLabel?: string;
  actionButtonClass?: string;
  cancelLabel?: string;
  successMessage?: string | ((item: ConfirmationItem) => string);
  errorMessage?: string | ((error: Error) => string);
  successToastType?: ToastType;
  errorToastType?: ToastType;
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
}

interface UseConfirmationDialogProps {
  onConfirm: (id: string, item?: ConfirmationItem) => Promise<void>;
  config?: ConfirmationConfig;
}

export function useConfirmationDialog({
  onConfirm,
  config = {}
}: UseConfirmationDialogProps) {
  const {
    title = 'Are you sure?',
    description,
    actionLabel = 'Confirm',
    actionButtonClass = 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
    cancelLabel = 'Cancel',
    successMessage = 'Action completed successfully',
    errorMessage = 'Failed to complete action',
    successToastType = 'success',
    errorToastType = 'error',
    showSuccessToast = true,
    showErrorToast = true,
  } = config;

  const [dialog, setDialog] = useState<{ open: boolean; item: ConfirmationItem | null }>({
    open: false,
    item: null,
  });

  const openDialog = (item: ConfirmationItem) => {
    setDialog({ open: true, item });
  };

  const closeDialog = () => {
    setDialog({ open: false, item: null });
  };

  const handleConfirm = async () => {
    if (!dialog.item) return;

    try {
      await onConfirm(dialog.item.id, dialog.item);

      if (showSuccessToast) {
        const message = typeof successMessage === 'function'
          ? successMessage(dialog.item)
          : successMessage;

        toast[successToastType](message);
      }

      closeDialog();
    } catch (err) {
      if (showErrorToast) {
        const message = typeof errorMessage === 'function'
          ? errorMessage(err as Error)
          : (err instanceof Error ? err.message : errorMessage);

        toast[errorToastType](message);
      }
    }
  };

  const getDescription = () => {
    if (!dialog.item) return null;

    if (description) {
      return typeof description === 'function'
        ? description(dialog.item)
        : description;
    }

    return (
      <>
        This will permanently delete <strong>&quot;{dialog.item.name}&quot;</strong>.
        This action cannot be undone.
      </>
    );
  };

  const ConfirmationDialog = () => (
    <AlertDialog open={dialog.open} onOpenChange={(open) => !open && closeDialog()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {getDescription()}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className={actionButtonClass}
          >
            {actionLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  return {
    openDialog,
    closeDialog,
    ConfirmationDialog,
  };
}

// Convenience wrapper for delete operations
export function useDeleteConfirmation({
  onDelete,
  entityName = 'item'
}: {
  onDelete: (id: string) => Promise<void>;
  entityName?: string;
}) {
  return useConfirmationDialog({
    onConfirm: onDelete,
    config: {
      title: 'Are you sure?',
      actionLabel: 'Delete',
      actionButtonClass: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
      successMessage: `${entityName.charAt(0).toUpperCase() + entityName.slice(1)} deleted successfully`,
      errorMessage: `Failed to delete ${entityName}`,
    }
  });
}
