'use client';

import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

interface StatBadge {
  label: string;
  value: string | number;
}

interface SectionHeaderProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  accentColor: string;
  actions?: ReactNode;
  stats?: StatBadge[];
  className?: string;
}

export function SectionHeader({
  icon: Icon,
  title,
  accentColor,
  actions,
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between border-b border-default px-1 py-2',
        className
      )}
    >
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4" style={{ color: accentColor }} />
        <h1 className="text-sm font-medium text-text-bright">{title}</h1>
      </div>
      {actions && (
        <div className="flex items-center gap-2">{actions}</div>
      )}
    </div>
  );
}
