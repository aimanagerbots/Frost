'use client';

import { FlaskConical, CalendarClock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PortalCard } from '@/modules/portal/shared/components';
import { PORTAL_PRODUCTION_ITEMS } from '@/modules/portal/shared/mock-data/production-calendar';

const TYPE_BADGE: Record<string, { label: string; color: string }> = {
  cultivation: { label: 'Cultivation', color: 'bg-green-500/15 text-green-400' },
  manufacturing: { label: 'Manufacturing', color: 'bg-violet-500/15 text-violet-400' },
};

function formatEstimatedDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

export function DashboardComingSoon() {
  const items = PORTAL_PRODUCTION_ITEMS.slice(0, 5);

  if (items.length === 0) return null;

  return (
    <PortalCard padding="sm" className="flex flex-col">
      <div className="flex items-center gap-2 px-2 pb-3 pt-1">
        <FlaskConical className="h-4 w-4 text-text-muted" />
        <h3 className="font-display text-sm font-semibold text-text-bright">
          Coming Soon
        </h3>
      </div>

      <ul className="divide-y divide-border-default">
        {items.map((item) => {
          const typeBadge = TYPE_BADGE[item.type] ?? TYPE_BADGE.cultivation;

          return (
            <li key={item.id} className="flex items-start justify-between gap-3 px-2 py-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-text-default">
                    {item.strainName}
                  </p>
                  <span
                    className={cn(
                      'rounded px-1.5 py-0.5 text-[10px] font-semibold',
                      typeBadge.color
                    )}
                  >
                    {typeBadge.label}
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-2 text-xs text-text-muted">
                  <span>{item.currentStage}</span>
                  <span className="text-border-default">|</span>
                  <span className="flex items-center gap-1">
                    <CalendarClock className="h-3 w-3" />
                    {formatEstimatedDate(item.estimatedDate)}
                  </span>
                </div>
              </div>

              <button
                type="button"
                className={cn(
                  'shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium',
                  item.reserved
                    ? 'bg-green-500/15 text-green-400 cursor-default'
                    : 'bg-elevated text-text-muted transition-colors hover:bg-accent-primary/15 hover:text-accent-primary'
                )}
                disabled={item.reserved}
              >
                {item.reserved ? 'Reserved' : 'Reserve Interest'}
              </button>
            </li>
          );
        })}
      </ul>
    </PortalCard>
  );
}
