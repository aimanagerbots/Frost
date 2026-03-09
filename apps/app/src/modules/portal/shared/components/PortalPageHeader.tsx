'use client';

import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface PortalPageHeaderProps {
  icon?: LucideIcon;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function PortalPageHeader({
  icon: Icon,
  title,
  subtitle,
  actions,
  className,
}: PortalPageHeaderProps) {
  return (
    <div className={cn('flex items-center justify-between gap-4', className)}>
      <div className="flex items-center gap-4">
        {/* Amber accent bar */}
        <div className="h-12 w-1 rounded-full bg-amber-500" />

        {Icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-50">
            <Icon className="h-5 w-5 text-amber-600" />
          </div>
        )}

        <div>
          <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
          {subtitle && (
            <p className="mt-0.5 text-sm text-gray-500">{subtitle}</p>
          )}
        </div>
      </div>

      {actions && (
        <div className="flex items-center gap-2">{actions}</div>
      )}
    </div>
  );
}
