'use client';

import { Calendar, Clock, User, Package, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PortalDelivery } from '@/modules/portal/shared/types';
import { PortalStatusBadge } from '@/modules/portal/shared/components/PortalStatusBadge';

interface DeliveriesUpcomingProps {
  deliveries: PortalDelivery[];
  onViewDetail: (id: string) => void;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

export function DeliveriesUpcoming({
  deliveries,
  onViewDetail,
}: DeliveriesUpcomingProps) {
  const upcoming = deliveries.filter(
    (d) => d.status === 'scheduled' || d.status === 'rescheduled'
  );

  if (upcoming.length === 0) {
    return (
      <div className="rounded-xl border border-border-default bg-card p-8 text-center">
        <Calendar className="mx-auto mb-3 h-8 w-8 text-text-muted" />
        <p className="text-sm text-text-muted">No upcoming deliveries</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold text-text-bright">
        Upcoming Deliveries
      </h2>
      <div className="space-y-2">
        {upcoming.map((delivery) => {
          const itemCount = delivery.items.reduce(
            (sum, item) => sum + item.quantity,
            0
          );
          return (
            <button
              key={delivery.id}
              type="button"
              onClick={() => onViewDetail(delivery.id)}
              className={cn(
                'w-full rounded-xl border border-border-default bg-card p-4',
                'text-left transition-colors hover:border-accent-primary/30 hover:bg-elevated'
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-text-bright">
                      {delivery.orderNumber}
                    </span>
                    <PortalStatusBadge status={delivery.status} />
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-text-muted">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(delivery.scheduledDate)}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {delivery.scheduledWindow.start} &ndash;{' '}
                      {delivery.scheduledWindow.end}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {delivery.driver.name}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Package className="h-3 w-3" />
                      {itemCount} item{itemCount !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>

                <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-text-muted" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
