'use client';

import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { removeToast } from '@/lib/redux/slices/uiSlice';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export function ToastProvider() {
  const toasts = useAppSelector((state) => state.ui.toasts);
  const dispatch = useAppDispatch();

  useEffect(() => {
    toasts.forEach((toast) => {
      const duration = toast.duration || 5000;
      const timer = setTimeout(() => {
        dispatch(removeToast(toast.id));
      }, duration);

      return () => clearTimeout(timer);
    });
  }, [toasts, dispatch]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="rounded-lg p-4 shadow-lg animate-in slide-in-from-right flex items-start gap-3"
          style={{
            background:
              toast.type === 'success'
                ? 'rgba(34, 197, 94, 0.9)'
                : toast.type === 'error'
                ? 'rgba(239, 68, 68, 0.9)'
                : toast.type === 'warning'
                ? 'rgba(251, 191, 36, 0.9)'
                : 'rgba(59, 130, 246, 0.9)',
            color: 'white',
            backdropFilter: 'blur(8px)',
          }}
        >
          {toast.type === 'success' && <CheckCircle className="w-5 h-5 flex-shrink-0" />}
          {toast.type === 'error' && <AlertCircle className="w-5 h-5 flex-shrink-0" />}
          {toast.type === 'warning' && <AlertTriangle className="w-5 h-5 flex-shrink-0" />}
          {toast.type === 'info' && <Info className="w-5 h-5 flex-shrink-0" />}

          <p className="flex-1 text-sm font-medium">{toast.message}</p>

          <button
            onClick={() => dispatch(removeToast(toast.id))}
            className="flex-shrink-0 hover:opacity-70 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
