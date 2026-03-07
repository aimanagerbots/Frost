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
  subtitle,
  accentColor,
  actions,
  stats,
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        'relative rounded-xl border border-default bg-card p-4 md:p-6',
        className
      )}
    >
      <div
        className="absolute top-0 left-0 right-0 h-1 rounded-t-xl"
        style={{ backgroundColor: accentColor }}
      />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
            style={{ backgroundColor: `${accentColor}20` }}
          >
            <Icon className="h-5 w-5" style={{ color: accentColor }} />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-bright">{title}</h1>
            {subtitle && (
              <p className="mt-0.5 text-sm text-muted">{subtitle}</p>
            )}
            {stats && stats.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {stats.map((stat) => (
                  <span
                    key={stat.label}
                    className="inline-flex items-center gap-1.5 rounded-full bg-elevated px-2.5 py-0.5 text-xs"
                  >
                    <span className="text-muted">{stat.label}</span>
                    <span className="font-medium text-bright">{stat.value}</span>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        {actions && (
          <div className="flex shrink-0 items-center gap-2">{actions}</div>
        )}
      </div>
    </div>
  );
}
