'use client';

import { useState } from 'react';
import { Truck } from 'lucide-react';
import { SectionHeader, MetricCard, LoadingSkeleton } from '@/components';
import { useDeliveryRuns, useDeliveryMetrics, useDrivers } from '../hooks';
import { ActiveRoutes } from './ActiveRoutes';
import { DriverCards } from './DriverCards';
import { RouteDrawer } from './RouteDrawer';

const ACCENT = '#0EA5E9';

export function DeliveryPage() {
  const [selectedRunId, setSelectedRunId] = useState<string | null>(null);

  const { data: runs, isLoading: runsLoading } = useDeliveryRuns();
  const { data: metrics, isLoading: metricsLoading } = useDeliveryMetrics();
  const { data: drivers, isLoading: driversLoading } = useDrivers();

  const selectedRun = runs?.find((r) => r.id === selectedRunId) ?? null;

  if (metricsLoading) return <LoadingSkeleton variant="card" count={3} />;

  return (
    <div className="space-y-6">
      <SectionHeader icon={Truck} title="Delivery" accentColor={ACCENT} />

      {/* Metrics Row */}
      {metrics && (
        <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          <MetricCard label="Total Runs" value={metrics.totalDeliveries} accentColor={ACCENT} />
          <MetricCard label="Completed Today" value={metrics.completedToday} accentColor={ACCENT} trend={{ value: 8, direction: 'up' }} />
          <MetricCard label="In Transit" value={metrics.inTransit} accentColor={ACCENT} />
          <MetricCard label="Avg Delivery Time" value={`${metrics.avgDeliveryTime}m`} accentColor={ACCENT} />
          <MetricCard label="On-Time Rate" value={`${metrics.onTimeRate}%`} accentColor={ACCENT} trend={{ value: 2, direction: 'up' }} />
          <MetricCard label="Drivers Active" value={metrics.driversActive} accentColor={ACCENT} />
        </div>
      )}

      {/* Active Routes */}
      <ActiveRoutes
        runs={runs ?? []}
        loading={runsLoading}
        onSelectRun={setSelectedRunId}
        selectedRunId={selectedRunId}
      />

      {/* Drivers */}
      <DriverCards drivers={drivers ?? []} loading={driversLoading} />

      {/* Route Drawer */}
      <RouteDrawer
        run={selectedRun}
        open={!!selectedRunId}
        onClose={() => setSelectedRunId(null)}
      />
    </div>
  );
}
