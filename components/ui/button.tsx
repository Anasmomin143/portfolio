import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'shadow-medium hover:shadow-strong transform hover:scale-105 text-white',
        outline: 'shadow-soft hover:shadow-medium text-current border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        destructive: 'shadow-medium hover:shadow-strong transform hover:scale-105 text-white',
      },
      size: {
        default: 'px-4 py-2 text-sm h-10',
        sm: 'px-3 py-1.5 text-xs h-9',
        lg: 'px-6 py-3 text-base h-11',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', asChild = false, style, ...props }, ref) => {
    const getVariantStyle = (variant: string) => {
      switch (variant) {
        case 'default':
          return {
            background: 'var(--gradient-primary)',
            color: 'white',
            border: 'none'
          };
        case 'outline':
          return {
            background: 'var(--gradient-secondary)',
            color: 'var(--color-primary)',
            border: '1px solid var(--color-primary)'
          };
        case 'ghost':
          return {
            background: 'transparent',
            color: 'var(--color-text)',
            border: 'none'
          };
        case 'destructive':
          return {
            background: 'linear-gradient(to right, #dc2626, #b91c1c)',
            color: 'white',
            border: 'none'
          };
        default:
          return {
            background: 'var(--gradient-primary)',
            color: 'white',
            border: 'none'
          };
      }
    };

    const variants = {
      default: 'shadow-medium hover:shadow-strong transform hover:scale-105 text-white',
      outline: 'shadow-soft hover:shadow-medium text-current',
      ghost: 'hover:bg-opacity-10 text-current',
      destructive: 'shadow-medium hover:shadow-strong transform hover:scale-105 text-white'
    };

    const sizes = {
      default: 'px-4 py-2 text-sm',
      sm: 'px-3 py-1.5 text-xs',
      lg: 'px-6 py-3 text-base'
    };

    const buttonStyle = {
      ...getVariantStyle(variant),
      ...style
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
          style={buttonStyle}
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
        style={buttonStyle}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };