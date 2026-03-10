'use client';

import { AlertTriangle, AlertCircle, Info, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DashboardAlert, AlertSeverity } from '@/modules/dashboard/types';

interface AlertsRowProps {
  alerts: DashboardAlert[];
}

const SEVERITY_CONFIG: Record<
  AlertSeverity,
  {
    icon: typeof AlertTriangle;
    borderClass: string;
    bgClass: string;
    iconContainerClass: string;
    iconClass: string;
  }
> = {
  critical: {
    icon: AlertTriangle,
    borderClass: 'border-[#FB7185]/40',
    bgClass: 'bg-[#FB7185]/5',
    iconContainerClass: 'bg-[#FB7185]/15',
    iconClass: 'text-[#FB7185]',
  },
  warning: {
    icon: AlertCircle,
    borderClass: 'border-[#FBBF24]/40',
    bgClass: 'bg-[#FBBF24]/5',
    iconContainerClass: 'bg-[#FBBF24]/15',
    iconClass: 'text-[#FBBF24]',
  },
  info: {
    icon: Info,
    borderClass: 'border-border-default',
    bgClass: 'bg-accent-primary/5',
    iconContainerClass: 'bg-accent-primary/10',
    iconClass: 'text-accent-primary',
  },
};

const MAX_ALERTS = 5;

export function AlertsRow({ alerts }: AlertsRowProps) {
  const visibleAlerts = alerts.slice(0, MAX_ALERTS);

  if (visibleAlerts.length === 0) return null;

  return (
    <div className="rounded-xl bg-card p-3">
      <div className="mb-3 flex items-center gap-2">
        <AlertTriangle className="h-4 w-4 text-text-muted" />
        <h3 className="text-sm font-semibold text-text-bright">Alerts</h3>
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#FB7185] px-1.5 text-[10px] font-bold text-white">
          {alerts.length}
        </span>
      </div>
      <ul className="space-y-2">
        {visibleAlerts.map((alert) => {
          const config = SEVERITY_CONFIG[alert.severity];
          const Icon = config.icon;

          return (
            <li
              key={alert.id}
              className={cn(
                'flex gap-3 rounded-lg border p-3',
                config.borderClass,
                config.bgClass
              )}
            >
              <div
                className={cn(
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                  config.iconContainerClass
                )}
              >
                <Icon className={cn('h-4 w-4', config.iconClass)} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-text-default">
                  {alert.title}
                </p>
                <p className="line-clamp-1 text-xs text-text-muted">
                  {alert.description}
                </p>
                <div className="mt-1.5 flex items-center gap-3">
                  <span className="text-[10px] text-text-muted">
                    {alert.timestamp}
                  </span>
                  <a
                    href={alert.route}
                    className="flex items-center gap-1 text-[10px] font-medium text-info hover:underline"
                  >
                    View details <ExternalLink className="h-2.5 w-2.5" />
                  </a>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
