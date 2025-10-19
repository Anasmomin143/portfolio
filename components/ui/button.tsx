import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'destructive';
  size?: 'default' | 'sm' | 'lg';
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', asChild = false, ...props }, ref) => {
    const variants = {
      default: 'bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:from-primary-700 hover:to-primary-800 focus-visible:ring-primary-500 shadow-medium hover:shadow-strong transform hover:scale-105',
      outline: 'border border-primary-300 bg-gradient-to-r from-surface-50 to-surface-100 hover:from-primary-50 hover:to-primary-100 text-primary-700 hover:text-primary-800 shadow-soft hover:shadow-medium',
      ghost: 'hover:bg-gradient-to-r hover:from-primary-50 hover:to-surface-100 text-secondary-600 hover:text-primary-700',
      destructive: 'bg-gradient-to-r from-error-600 to-error-700 text-white hover:from-error-700 hover:to-error-800 focus-visible:ring-error-500 shadow-medium hover:shadow-strong'
    };

    const sizes = {
      default: 'px-4 py-2 text-sm',
      sm: 'px-3 py-1.5 text-xs',
      lg: 'px-6 py-3 text-base'
    };

    if (asChild) {
      return (
        <span
          className={cn(
            'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
            'disabled:pointer-events-none disabled:opacity-50',
            variants[variant],
            sizes[size],
            className
          )}
          {...props}
        />
      );
    }

    return (
      <button
        className={cn(
          'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button };