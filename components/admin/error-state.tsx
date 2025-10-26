import { AlertCircle } from 'lucide-react';
import { COMMON_INLINE_STYLES } from '@/lib/constants/styles';

interface ErrorStateProps {
  message: string;
  title?: string;
  onRetry?: () => void;
  fullHeight?: boolean;
}

export function ErrorState({
  message,
  title = 'Error',
  onRetry,
  fullHeight = true
}: ErrorStateProps) {
  return (
    <div
      className={`flex items-center justify-center ${fullHeight ? 'min-h-[calc(100vh-12rem)]' : 'py-12'}`}
    >
      <div className="flex flex-col items-center gap-4 max-w-md text-center">
        <div
          className="flex items-center justify-center w-16 h-16 rounded-full"
          style={{ background: 'rgba(239, 68, 68, 0.1)' }}
        >
          <AlertCircle className="w-8 h-8" style={{ color: '#ef4444' }} />
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2" style={COMMON_INLINE_STYLES.text}>
            {title}
          </h3>
          <p className="text-sm" style={COMMON_INLINE_STYLES.textMuted}>
            {message}
          </p>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-6 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-[1.02]"
            style={{
              background: 'var(--color-primary)',
              color: 'white'
            }}
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}
