'use client';

import { useState } from 'react';
import { AlertTriangle, AlertCircle, Info, X, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AccentCard } from '@/components';
import type { DashboardAlert, AlertSeverity } from '@/modules/dashboard/types';

interface AlertsRowProps {
  alerts: DashboardAlert[];
}

const SEVERITY_CONFIG: Record<AlertSeverity, { icon: typeof AlertTriangle; accentColor: string; iconColor: string }> = {
  critical: { icon: AlertTriangle, accentColor: '#EF4444', iconColor: 'text-red-400' },
  warning: { icon: AlertCircle, accentColor: '#F59E0B', iconColor: 'text-amber-400' },
  info: { icon: Info, accentColor: '#3B82F6', iconColor: 'text-blue-400' },
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
            <AccentCard
              key={alert.id}
              accentColor={config.accentColor}
              className="min-w-[300px] max-w-[360px] flex-shrink-0 p-4"
            >
              <div className="flex items-start gap-3">
                <Icon className={cn('mt-0.5 h-4 w-4 flex-shrink-0', config.iconColor)} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-text-bright leading-snug">{alert.title}</p>
                  <p className="mt-1 text-xs text-text-muted line-clamp-2">{alert.description}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <span
                      className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-medium"
                      style={{
                        backgroundColor: `${config.accentColor}15`,
                        color: config.accentColor,
                      }}
                    >
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ backgroundColor: config.accentColor }}
                      />
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
                  className="flex-shrink-0 rounded-md p-1 text-text-muted hover:bg-accent-hover hover:text-text-default transition-colors"
                  aria-label="Dismiss alert"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </AccentCard>
          );
        })}
      </div>
    </div>
  );
}
