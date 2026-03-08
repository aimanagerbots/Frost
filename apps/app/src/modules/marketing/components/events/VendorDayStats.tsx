'use client';

import { MetricCard } from '@/components';
import type { EventMetrics } from '../../types/seo-events';
import { ACCENT } from '@/design/colors';


interface VendorDayStatsProps {
  metrics: EventMetrics;
}

export function VendorDayStats({ metrics }: VendorDayStatsProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        label="Vendor Days This Month"
        value={metrics.vendorDaysThisMonth}
        accentColor={ACCENT}
      />
      <MetricCard
        label="Avg Revenue Lift"
        value={`+${metrics.avgRevenueLift}%`}
        accentColor={ACCENT}
        trend={{ value: metrics.avgRevenueLift, direction: 'up' }}
      />
      <MetricCard
        label="Top Location"
        value={metrics.topLocation}
        accentColor={ACCENT}
      />
      <MetricCard
        label="Next Trade Show"
        value={`${metrics.nextTradeShowDays} days`}
        accentColor={ACCENT}
      />
    </div>
  );
}
