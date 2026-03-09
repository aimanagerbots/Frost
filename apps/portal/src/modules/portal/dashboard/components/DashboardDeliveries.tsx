'use client';

import { Truck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePortalAuth, usePortalUpcomingDeliveries } from '@/modules/portal/shared/hooks';
import { PortalCard, PortalStatusBadge } from '@/modules/portal/shared/components';

function formatDeliveryDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

function formatTimeWindow(window: { start: string; end: string }): string {
  return `${window.start} – ${window.end}`;
}

export function DashboardDeliveries() {
  const { currentAccount } = usePortalAuth();
  const { data: deliveries } = usePortalUpcomingDeliveries(currentAccount?.id ?? '');

  const upcoming = (deliveries ?? []).slice(0, 2);

  return (
    <PortalCard padding="sm" className="flex flex-col">
      <div className="flex items-center gap-2 px-2 pb-3 pt-1">
        <Truck className="h-4 w-4 text-text-muted" />
        <h3 className="font-display text-sm font-semibold text-text-bright">
          Upcoming Deliveries
        </h3>
      </div>

      {upcoming.length === 0 ? (
        <div className="px-2 py-6 text-center text-sm text-text-muted">
          No upcoming deliveries
        </div>
      ) : (
        <ul className="divide-y divide-border-default">
          {upcoming.map((delivery) => (
            <li key={delivery.id} className="flex items-start justify-between gap-3 px-2 py-3">
              <div className="min-w-0">
                <p className="font-mono text-xs font-medium text-text-default">
                  {delivery.orderNumber}
                </p>
                <p className="mt-1 text-xs text-text-muted">
                  {formatDeliveryDate(delivery.scheduledDate)}
                </p>
                <p className="text-xs text-text-muted">
                  {formatTimeWindow(delivery.scheduledWindow)}
                </p>
                <p className="mt-1 text-xs text-text-muted">
                  Driver: {delivery.driver.name}
                </p>
              </div>

              <div className="shrink-0">
                {delivery.status === 'in-transit' ? (
                  <span
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
                      'bg-accent-primary/15 text-accent-primary'
                    )}
                  >
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-primary opacity-75" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent-primary" />
                    </span>
                    In Transit
                  </span>
                ) : (
                  <PortalStatusBadge status={delivery.status} />
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </PortalCard>
  );
}
