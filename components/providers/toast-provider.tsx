'use client';

import { useEffect, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { removeToast } from '@/lib/redux/slices/uiSlice';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export function ToastProvider() {
  const toasts = useAppSelector((state) => state.ui.toasts);
  const dispatch = useAppDispatch();
  const timersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  useEffect(() => {
    // Set timers for new toasts only
    toasts.forEach((toast) => {
      if (!timersRef.current.has(toast.id)) {
        const duration = toast.duration || 5000;
        const timer = setTimeout(() => {
          dispatch(removeToast(toast.id));
          timersRef.current.delete(toast.id);
        }, duration);
        timersRef.current.set(toast.id, timer);
      }
    });

    // Clean up timers for removed toasts
    const toastIds = new Set(toasts.map(t => t.id));
    timersRef.current.forEach((timer, id) => {
      if (!toastIds.has(id)) {
        clearTimeout(timer);
        timersRef.current.delete(id);
      }
    });
  }, [toasts, dispatch]);

  if (toasts.length === 0) return null;

  // Show only the most recent toast
  const currentToast = toasts[toasts.length - 1];

  return (
    <div className="fixed top-4 right-4 z-[9999] max-w-md">
      <div
        key={currentToast.id}
        className="rounded-lg p-4 shadow-2xl flex items-start gap-3 animate-in slide-in-from-right-5 fade-in duration-300"
        style={{
          background:
            currentToast.type === 'success'
              ? 'rgba(34, 197, 94, 0.95)'
              : currentToast.type === 'error'
              ? 'rgba(239, 68, 68, 0.95)'
              : currentToast.type === 'warning'
              ? 'rgba(251, 191, 36, 0.95)'
              : 'rgba(59, 130, 246, 0.95)',
          color: 'white',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          minWidth: '320px',
        }}
      >
        <div className="flex-shrink-0 mt-0.5">
          {currentToast.type === 'success' && <CheckCircle className="w-5 h-5" />}
          {currentToast.type === 'error' && <AlertCircle className="w-5 h-5" />}
          {currentToast.type === 'warning' && <AlertTriangle className="w-5 h-5" />}
          {currentToast.type === 'info' && <Info className="w-5 h-5" />}
        </div>

        <p className="flex-1 text-sm font-medium leading-relaxed">{currentToast.message}</p>

        <button
          onClick={() => dispatch(removeToast(currentToast.id))}
          className="flex-shrink-0 hover:opacity-70 transition-opacity rounded p-1 hover:bg-white/10"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
