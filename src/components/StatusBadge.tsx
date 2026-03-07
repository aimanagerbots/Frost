'use client';

import { cn } from '@/lib/utils';

const VARIANT_STYLES = {
  default: { bg: 'bg-elevated', text: 'text-text-default', dot: 'bg-default' },
  success: { bg: 'bg-success/15', text: 'text-success', dot: 'bg-success' },
  warning: { bg: 'bg-warning/15', text: 'text-warning', dot: 'bg-warning' },
  danger: { bg: 'bg-danger/15', text: 'text-danger', dot: 'bg-danger' },
  info: { bg: 'bg-info/15', text: 'text-info', dot: 'bg-info' },
  muted: { bg: 'bg-elevated', text: 'text-text-muted', dot: 'bg-muted' },
} as const;

type BadgeVariant = keyof typeof VARIANT_STYLES;

interface StatusBadgeProps {
  variant?: BadgeVariant;
  label: string;
  size?: 'sm' | 'md';
  pulse?: boolean;
  dot?: boolean;
  className?: string;
}

export function StatusBadge({
  variant = 'default',
  label,
  size = 'md',
  pulse = false,
  dot = false,
  className,
}: StatusBadgeProps) {
  const styles = VARIANT_STYLES[variant];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium',
        styles.bg,
        styles.text,
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm',
        className
      )}
    >
      {dot && (
        <span className="relative flex h-2 w-2">
          {pulse && (
            <span
              className={cn(
                'absolute inline-flex h-full w-full animate-ping rounded-full opacity-75',
                styles.dot
              )}
            />
          )}
          <span
            className={cn(
              'relative inline-flex h-2 w-2 rounded-full',
              styles.dot
            )}
          />
        </span>
      )}
      {label}
    </span>
  );
}
