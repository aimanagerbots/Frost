import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PortalPageHeaderProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
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
    <div className={cn('flex items-center justify-between', className)}>
      <div className="flex items-center gap-4">
        {/* Accent bar */}
        <div className="h-12 w-1 rounded-full bg-accent-primary" />

        {/* Icon circle */}
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-primary/10">
          <Icon className="h-5 w-5 text-accent-primary" />
        </div>

        {/* Text */}
        <div>
          <h1 className="font-display text-xl font-semibold text-text-bright">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-0.5 text-sm text-text-muted">{subtitle}</p>
          )}
        </div>
      </div>

      {/* Actions */}
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
