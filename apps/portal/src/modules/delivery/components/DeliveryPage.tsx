'use client';

import { useState } from 'react';
import { Truck, PackageX } from 'lucide-react';
import { SectionHeader, MetricCard, LoadingSkeleton, ErrorState, EmptyState } from '@/components';
import { useDeliveryRuns, useDeliveryMetrics, useDrivers } from '../hooks';
import { ActiveRoutes } from './ActiveRoutes';
import { DriverCards } from './DriverCards';
import { RouteDrawer } from './RouteDrawer';

const ACCENT = '#0EA5E9';

export function DeliveryPage() {
  const [selectedRunId, setSelectedRunId] = useState<string | null>(null);

  const { data: runs, isLoading: runsLoading, error: runsError, refetch: refetchRuns } = useDeliveryRuns();
  const { data: metrics, isLoading: metricsLoading, error: metricsError, refetch: refetchMetrics } = useDeliveryMetrics();
  const { data: drivers, isLoading: driversLoading, error: driversError, refetch: refetchDrivers } = useDrivers();

  const selectedRun = runs?.find((r) => r.id === selectedRunId) ?? null;

  if (metricsLoading) return <LoadingSkeleton variant="card" count={3} />;
  if (runsError || metricsError || driversError) return <ErrorState title="Failed to load delivery data" message={(runsError || metricsError || driversError)?.message} onRetry={() => { refetchRuns(); refetchMetrics(); refetchDrivers(); }} />;

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
      {!runsLoading && runs && runs.length === 0 ? (
        <EmptyState icon={Truck} title="No delivery runs" description="No active delivery runs to display" accentColor={ACCENT} />
      ) : (
        <ActiveRoutes
          runs={runs ?? []}
          loading={runsLoading}
          onSelectRun={setSelectedRunId}
          selectedRunId={selectedRunId}
        />
      )}

      {/* Drivers */}
      {!driversLoading && drivers && drivers.length === 0 ? (
        <EmptyState icon={PackageX} title="No drivers" description="No drivers available" accentColor={ACCENT} />
      ) : (
        <DriverCards drivers={drivers ?? []} loading={driversLoading} />
      )}

      {/* Route Drawer */}
      <RouteDrawer
        run={selectedRun}
        open={!!selectedRunId}
        onClose={() => setSelectedRunId(null)}
      />
    </div>
  );
}
