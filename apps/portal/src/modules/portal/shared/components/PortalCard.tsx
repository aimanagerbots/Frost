import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

const PADDING_MAP = {
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-6',
} as const;

interface PortalCardProps {
  children: ReactNode;
  className?: string;
  padding?: keyof typeof PADDING_MAP;
}

export function PortalCard({
  children,
  className,
  padding = 'md',
}: PortalCardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-border-default bg-card',
        PADDING_MAP[padding],
        className
      )}
    >
      {children}
    </div>
  );
}
