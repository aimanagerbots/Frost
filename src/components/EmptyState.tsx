'use client';

import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  accentColor?: string;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  accentColor,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-16 text-center',
        className
      )}
    >
      <div
        className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl"
        style={{
          backgroundColor: accentColor ? `${accentColor}15` : undefined,
        }}
      >
        <Icon
          className="h-8 w-8"
          style={{ color: accentColor || 'var(--text-text-muted)' }}
        />
      </div>
      <h3 className="mb-1 text-lg font-semibold text-text-bright">{title}</h3>
      <p className="mb-6 max-w-sm text-sm text-text-muted">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="rounded-lg px-4 py-2 text-sm font-medium text-text-bright transition-colors"
          style={{
            backgroundColor: accentColor || 'var(--accent-primary)',
          }}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
