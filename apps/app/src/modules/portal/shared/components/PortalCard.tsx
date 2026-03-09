'use client';

import { cn } from '@/lib/utils';

interface PortalCardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
}

const paddingMap = { sm: 'p-3', md: 'p-5', lg: 'p-6' } as const;

export function PortalCard({ children, className, padding = 'md' }: PortalCardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-gray-200 bg-white shadow-sm',
        paddingMap[padding],
        className,
      )}
    >
      {children}
    </div>
  );
}
