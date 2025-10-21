import React from 'react';
import { COMMON_INLINE_STYLES, TAILWIND_PATTERNS } from '@/lib/constants/styles';

interface TechBadgeProps {
  tech: string;
  variant?: 'primary' | 'secondary';
  className?: string;
}

export function TechBadge({ tech, variant = 'primary', className = '' }: TechBadgeProps) {
  const variantStyles = variant === 'primary'
    ? COMMON_INLINE_STYLES.primaryGradient
    : COMMON_INLINE_STYLES.secondaryGradient;

  return (
    <span
      className={`${TAILWIND_PATTERNS.badge} ${className}`}
      style={variantStyles}
    >
      {tech}
    </span>
  );
}

interface TechBadgeListProps {
  technologies: string[];
  variant?: 'primary' | 'secondary';
  className?: string;
}

export function TechBadgeList({ technologies, variant = 'primary', className = '' }: TechBadgeListProps) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {technologies.map((tech) => (
        <TechBadge key={tech} tech={tech} variant={variant} />
      ))}
    </div>
  );
}
