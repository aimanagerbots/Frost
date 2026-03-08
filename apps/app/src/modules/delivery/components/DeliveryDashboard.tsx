'use client';

import { MapPin, DollarSign, CheckCircle2, Loader2 } from 'lucide-react';
import { MetricCard, StatusBadge, LoadingSkeleton } from '@/components';
import { useDeliveryMetrics, useDeliverySchedule } from '../hooks';
import type { ScheduleEntry } from '../types';
import { ACCENT } from '@/design/colors';


const scheduleStatusConfig: Record<
  ScheduleEntry['status'],
  { variant: 'success' | 'info' | 'warning' | 'muted'; pulse?: boolean }
> = {
  completed: { variant: 'success' },
  'in-transit': { variant: 'info', pulse: true },
  loading: { variant: 'warning' },
  upcoming: { variant: 'muted' },
};

export function DeliveryDashboard() {
  const { data: metrics, isLoading: metricsLoading } = useDeliveryMetrics();
  const { data: schedule, isLoading: scheduleLoading } = useDeliverySchedule();

  if (metricsLoading) return <LoadingSkeleton variant="card" count={5} />;

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      {metrics && (
        <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          <MetricCard
            label="Deliveries Today"
            value={metrics.completedToday}
            accentColor={ACCENT}
          />
          <MetricCard
            label="On-Time Rate (30d)"
            value={`${metrics.onTimeRate}%`}
            accentColor={ACCENT}
            trend={{ value: 2, direction: 'up' }}
          />
          <MetricCard
            label="Avg Delivery Time"
            value={`${metrics.avgDeliveryTime} min`}
            accentColor={ACCENT}
          />
          <MetricCard
            label="Revenue Delivered Today"
            value={`$${metrics.revenueDeliveredToday.toLocaleString()}`}
            accentColor={ACCENT}
          />
          <MetricCard
            label="Payments Collected Today"
            value={`$${metrics.paymentsCollectedToday.toLocaleString()}`}
            accentColor={ACCENT}
          />
        </div>
      )}

      {/* Map Placeholder */}
      <div className="rounded-xl border border-default bg-card flex flex-col items-center justify-center py-16 px-6" style={{ minHeight: 300 }}>
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-elevated mb-4">
          <MapPin className="h-7 w-7 text-text-muted" />
        </div>
        <h3 className="text-base font-semibold text-text-bright mb-1">Delivery Route Map</h3>
        <p className="text-sm text-text-muted mb-4">Integration with Google Maps coming soon</p>
        <p className="text-xs text-text-muted">4 routes | 10 stops | Est. 87 miles</p>
      </div>

      {/* Today's Delivery Schedule */}
      <div className="rounded-xl border border-default bg-card p-5">
        <h3 className="text-sm font-semibold text-text-bright mb-4">
          Today&apos;s Delivery Schedule
        </h3>

        {scheduleLoading ? (
          <LoadingSkeleton variant="list" count={5} />
        ) : (
          <div className="relative">
            {/* Vertical timeline line */}
            <div className="absolute left-[59px] top-2 bottom-2 w-px bg-elevated" />

            <div className="space-y-0">
              {schedule?.map((entry) => {
                const config = scheduleStatusConfig[entry.status];
                const isCompleted = entry.status === 'completed';
                const isInTransit = entry.status === 'in-transit';

                return (
                  <div
                    key={entry.id}
                    className={`flex items-center gap-4 rounded-lg px-3 py-3 transition-colors hover:bg-accent-hover/50 ${
                      isCompleted ? 'opacity-60' : ''
                    }`}
                  >
                    {/* Time */}
                    <div className="w-[48px] shrink-0 text-right">
                      <span className="text-sm font-semibold text-text-default">{entry.time}</span>
                    </div>

                    {/* Timeline dot */}
                    <div className="relative z-10 flex shrink-0 items-center justify-center">
                      {isCompleted ? (
                        <CheckCircle2 className="h-4 w-4 text-success" />
                      ) : isInTransit ? (
                        <span className="relative flex h-3 w-3">
                          <span
                            className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
                            style={{ backgroundColor: ACCENT }}
                          />
                          <span
                            className="relative inline-flex h-3 w-3 rounded-full"
                            style={{ backgroundColor: ACCENT }}
                          />
                        </span>
                      ) : entry.status === 'loading' ? (
                        <Loader2 className="h-3.5 w-3.5 text-warning animate-spin" />
                      ) : (
                        <span className="h-3 w-3 rounded-full bg-elevated border-2 border-default" />
                      )}
                    </div>

                    {/* Account + City */}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-text-default truncate">
                        {entry.accountName}
                      </p>
                      <p className="text-xs text-text-muted">{entry.city}</p>
                    </div>

                    {/* Status badge */}
                    <StatusBadge
                      label={entry.status.replace(/-/g, ' ')}
                      variant={config.variant}
                      size="sm"
                      dot
                      pulse={config.pulse}
                    />

                    {/* Order value */}
                    <div className="hidden sm:flex items-center gap-1 text-sm font-medium text-text-default w-[80px] justify-end">
                      <DollarSign className="h-3 w-3 text-text-muted" />
                      {entry.orderValue.toLocaleString()}
                    </div>

                    {/* Payment method */}
                    <div className="hidden md:block w-[50px] text-xs text-text-muted text-center">
                      {entry.paymentMethod}
                    </div>

                    {/* Driver */}
                    <div className="hidden lg:block w-[120px] text-xs text-text-muted text-right truncate">
                      {entry.driverName}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
