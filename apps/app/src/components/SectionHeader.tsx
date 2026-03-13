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
  actions,
  className,
}: SectionHeaderProps) {
  if (!actions) return null;
  return (
    <div className={cn('flex items-center justify-end pb-3', className)}>
      <div className="flex items-center gap-2">{actions}</div>
    </div>
  );
}
