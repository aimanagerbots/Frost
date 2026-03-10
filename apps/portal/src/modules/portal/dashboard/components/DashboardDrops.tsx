'use client';

import { CalendarClock, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAllocationDrops } from '@/modules/portal/shared/hooks';
import { PortalCard } from '@/modules/portal/shared/components';

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

function daysUntil(dateStr: string): number {
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / 86_400_000));
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

const CATEGORY_COLORS: Record<string, string> = {
  flower: '#22C55E',
  prerolls: '#F59E0B',
  vaporizers: '#3B82F6',
  concentrates: '#EF4444',
  edibles: '#EC4899',
  beverages: '#06B6D4',
};

export function DashboardDrops() {
  const { data: drops } = useAllocationDrops();

  if (!drops || drops.length === 0) return null;

  return (
    <PortalCard>
      <div className="flex items-center gap-2 pb-4">
        <CalendarClock className="h-4 w-4 text-accent-primary" />
        <h3 className="font-display text-sm font-semibold text-text-bright">
          Upcoming Drops &mdash; Reserve Your Allocation
        </h3>
      </div>

      <div className="space-y-3">
        {drops.map((drop) => {
          const categoryColor = CATEGORY_COLORS[drop.category] ?? '#5BB8E6';
          const remaining = drop.allocationsRemaining;
          const total = drop.totalAllocations;
          const depletePercent = total > 0 ? ((total - remaining) / total) * 100 : 0;
          const deadlineDays = daysUntil(drop.reservationDeadline);
          const isUrgent = deadlineDays <= 2;
          const isLowStock = remaining <= total * 0.3;

          return (
            <div
              key={drop.id}
              className={cn(
                'rounded-lg border border-border-default bg-elevated p-4',
                'transition-colors hover:border-accent-primary/30'
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="mb-1.5 flex flex-wrap items-center gap-2">
                    <span
                      className="rounded-full px-1.5 py-0.5 text-[10px] font-semibold uppercase"
                      style={{
                        backgroundColor: `${categoryColor}15`,
                        color: categoryColor,
                      }}
                    >
                      {drop.category}
                    </span>
                    <span className="text-xs text-text-muted">
                      Drop {formatDate(drop.dropDate)}
                    </span>
                  </div>

                  <p className="text-sm font-semibold text-text-bright">
                    {drop.productName}
                  </p>
                  <p className="text-xs text-text-muted">{drop.strainName}</p>

                  {/* Scarcity bar */}
                  <div className="mt-3 space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span
                        className={cn(
                          'font-medium',
                          isLowStock ? 'text-[#FB7185]' : 'text-text-muted'
                        )}
                      >
                        {remaining} of {total} allocations left
                      </span>
                      {isLowStock && (
                        <span className="flex items-center gap-1 text-[#FB7185]">
                          <AlertTriangle className="h-3 w-3" />
                          Low
                        </span>
                      )}
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
                      <div
                        className={cn(
                          'h-full rounded-full transition-all duration-700',
                          isLowStock ? 'bg-[#FB7185]' : 'bg-accent-primary'
                        )}
                        style={{ width: `${depletePercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Deadline countdown */}
                  <p
                    className={cn(
                      'mt-2 text-xs',
                      isUrgent ? 'font-semibold text-[#FB7185]' : 'text-text-muted'
                    )}
                  >
                    Reserve by {formatDate(drop.reservationDeadline)}
                    {deadlineDays > 0 && ` (${deadlineDays} day${deadlineDays === 1 ? '' : 's'} left)`}
                    {deadlineDays === 0 && ' (today!)'}
                  </p>
                </div>

                {/* Price + reserve button */}
                <div className="flex shrink-0 flex-col items-end gap-2">
                  <p className="text-sm font-semibold text-text-bright">
                    {formatCurrency(drop.estimatedPrice)}
                  </p>
                  <button
                    disabled={drop.reserved}
                    className={cn(
                      'rounded-lg px-4 py-2 text-xs font-semibold transition-colors',
                      drop.reserved
                        ? 'bg-white/5 text-text-muted cursor-default'
                        : 'bg-accent-primary text-black hover:bg-accent-primary/90'
                    )}
                  >
                    {drop.reserved ? 'Reserved' : 'Reserve'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </PortalCard>
  );
}
