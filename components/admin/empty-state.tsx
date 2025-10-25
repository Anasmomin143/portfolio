import { Plus } from 'lucide-react';
import Link from 'next/link';
import { COMMON_INLINE_STYLES, THEME_GRADIENTS } from '@/lib/constants/styles';

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    href: string;
    icon?: React.ComponentType<{ className?: string }>;
  };
  icon?: React.ReactNode;
}

export function EmptyState({ title, description, action, icon }: EmptyStateProps) {
  const ActionIcon = action?.icon || Plus;

  return (
    <div
      className="text-center py-16 rounded-xl"
      style={{
        background: THEME_GRADIENTS.card,
        border: '1px solid var(--card-border)',
      }}
    >
      {icon && (
        <div className="flex justify-center mb-6" style={{ color: 'var(--color-text-secondary)' }}>
          {icon}
        </div>
      )}

      <h3 className="text-xl font-bold mb-2" style={COMMON_INLINE_STYLES.text}>
        {title}
      </h3>

      {description && (
        <p className="text-base mb-6" style={COMMON_INLINE_STYLES.textMuted}>
          {description}
        </p>
      )}

      {action && (
        <Link
          href={action.href}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-[1.02]"
          style={{
            background: THEME_GRADIENTS.primary,
            color: 'white',
          }}
        >
          <ActionIcon className="w-5 h-5" />
          {action.label}
        </Link>
      )}
    </div>
  );
}
