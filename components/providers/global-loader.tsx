'use client';

import { useAppSelector } from '@/lib/redux/hooks';
import { COMMON_INLINE_STYLES } from '@/lib/constants/styles';

export function GlobalLoader() {
  const globalLoading = useAppSelector((state) => state.ui.globalLoading);

  if (!globalLoading) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-2xl flex flex-col items-center gap-4">
        <div
          className="animate-spin rounded-full h-16 w-16 border-b-4"
          style={{ borderColor: 'var(--color-primary)' }}
        />
        <p className="text-lg font-medium" style={COMMON_INLINE_STYLES.text}>
          Processing...
        </p>
      </div>
    </div>
  );
}
