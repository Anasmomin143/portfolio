import { COMMON_INLINE_STYLES } from '@/lib/constants/styles';

interface LoadingStateProps {
  message?: string;
  fullHeight?: boolean;
}

export function LoadingState({
  message = 'Loading...',
  fullHeight = true
}: LoadingStateProps) {
  return (
    <div
      className={`flex items-center justify-center ${fullHeight ? 'min-h-[calc(100vh-12rem)]' : 'py-12'}`}
    >
      <div className="flex flex-col items-center gap-4">
        <div
          className="animate-spin rounded-full h-12 w-12 border-b-2"
          style={{ borderColor: 'var(--color-primary)' }}
        />
        <p className="text-sm" style={COMMON_INLINE_STYLES.textMuted}>
          {message}
        </p>
      </div>
    </div>
  );
}
