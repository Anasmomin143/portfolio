import Link from 'next/link';
import { ArrowLeft, LucideIcon } from 'lucide-react';
import { COMMON_INLINE_STYLES, THEME_GRADIENTS } from '@/lib/constants/styles';

interface ActionButton {
  href: string;
  label: string;
  icon?: LucideIcon;
  variant?: 'primary' | 'secondary';
}

interface PageHeaderProps {
  title: string;
  description?: string;
  backHref?: string;
  backLabel?: string;
  actions?: ActionButton[];
}

export function PageHeader({
  title,
  description,
  backHref,
  backLabel = 'Back',
  actions,
}: PageHeaderProps) {
  return (
    <div className="mb-8">
      {backHref && (
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 text-sm mb-4 hover:underline transition-colors"
          style={COMMON_INLINE_STYLES.textMuted}
        >
          <ArrowLeft className="h-4 w-4" />
          {backLabel}
        </Link>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2" style={COMMON_INLINE_STYLES.text}>
            {title}
          </h1>
          {description && (
            <p className="text-lg" style={COMMON_INLINE_STYLES.textMuted}>
              {description}
            </p>
          )}
        </div>

        {/* Action buttons */}
        {actions && actions.length > 0 && (
          <div className="flex gap-3">
            {actions.map((btn, index) => {
              const Icon = btn.icon;
              const isSecondary = btn.variant === 'secondary';

              return (
                <Link
                  key={index}
                  href={btn.href}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-[1.02]"
                  style={
                    isSecondary
                      ? { background: THEME_GRADIENTS.secondary, border: '1px solid var(--color-primary)', ...COMMON_INLINE_STYLES.text }
                      : { background: THEME_GRADIENTS.primary, color: 'white' }
                  }
                >
                  {Icon && <Icon className="w-5 h-5" />}
                  {btn.label}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
