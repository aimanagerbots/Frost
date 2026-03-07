'use client';

import { useState } from 'react';
import { AlertTriangle, AlertCircle, Info, X, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DashboardAlert, AlertSeverity } from '@/modules/dashboard/types';

interface AlertsRowProps {
  alerts: DashboardAlert[];
}

const SEVERITY_CONFIG: Record<AlertSeverity, { icon: typeof AlertTriangle; borderColor: string; iconColor: string }> = {
  critical: { icon: AlertTriangle, borderColor: 'border-l-red-500', iconColor: 'text-red-400' },
  warning: { icon: AlertCircle, borderColor: 'border-l-amber-500', iconColor: 'text-amber-400' },
  info: { icon: Info, borderColor: 'border-l-blue-500', iconColor: 'text-blue-400' },
};

export function AlertsRow({ alerts }: AlertsRowProps) {
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());

  const visibleAlerts = alerts.filter((a) => !dismissedIds.has(a.id));

  if (visibleAlerts.length === 0) return null;

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-text-bright">Alerts</h3>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
        {visibleAlerts.map((alert) => {
          const config = SEVERITY_CONFIG[alert.severity];
          const Icon = config.icon;

          return (
            <div
              key={alert.id}
              className={cn(
                'min-w-[300px] max-w-[360px] flex-shrink-0 rounded-xl border border-default border-l-4 bg-card p-4',
                config.borderColor
              )}
            >
              <div className="flex items-start gap-3">
                <Icon className={cn('mt-0.5 h-4 w-4 flex-shrink-0', config.iconColor)} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-text-bright leading-snug">{alert.title}</p>
                  <p className="mt-1 text-xs text-text-muted line-clamp-2">{alert.description}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="rounded-full bg-elevated px-2 py-0.5 text-[10px] font-medium text-text-muted">
                      {alert.module}
                    </span>
                    <a
                      href={alert.route}
                      className="flex items-center gap-1 text-[10px] font-medium text-info hover:underline"
                    >
                      View <ExternalLink className="h-2.5 w-2.5" />
                    </a>
                  </div>
                </div>
                <button
                  onClick={() => setDismissedIds((prev) => new Set([...prev, alert.id]))}
                  className="flex-shrink-0 rounded-md p-1 text-text-muted hover:bg-elevated hover:text-text-default transition-colors"
                  aria-label="Dismiss alert"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
