'use client';

import { MetricCard, LoadingSkeleton, ErrorState } from '@/components';
import { useFulfillmentMetrics, useFulfillmentProgress } from '../hooks';
import { ACCENT } from '@/design/colors';


const STAGE_OPACITIES: Record<string, number> = {
  queued: 0.2,
  picking: 0.35,
  picked: 0.5,
  packing: 0.65,
  packed: 0.75,
  manifested: 0.9,
  'ready-for-driver': 1.0,
};

export function FulfillmentDashboard() {
  const { data: metrics, isLoading: metricsLoading, error: metricsError, refetch: refetchMetrics } = useFulfillmentMetrics();
  const { data: progress, isLoading: progressLoading, error: progressError, refetch: refetchProgress } = useFulfillmentProgress();

  if (metricsLoading || progressLoading) return <LoadingSkeleton variant="card" count={5} />;
  if (metricsError || progressError) {
    return (
      <ErrorState
        title="Failed to load dashboard data"
        message={(metricsError || progressError)?.message}
        onRetry={() => { refetchMetrics(); refetchProgress(); }}
      />
    );
  }

  const totalSegments = progress?.stages.reduce((sum, s) => sum + s.count, 0) ?? 1;
  const pickedPct = progress ? (progress.unitsPicked / progress.totalUnitsToday) * 100 : 0;
  const throughputPct = progress ? (progress.unitsPicked / progress.throughputTarget) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        <MetricCard label="Pick Lists Today" value={metrics?.totalOrders ?? 0} accentColor={ACCENT} />
        <MetricCard
          label="Units Picked Today"
          value={`${progress?.unitsPicked ?? 0} / ${progress?.totalUnitsToday ?? 0}`}
          accentColor={ACCENT}
        />
        <MetricCard label="Avg Pick Time" value={`${metrics?.avgPickTime ?? 0} min`} accentColor={ACCENT} />
        <MetricCard
          label="Order Accuracy Rate"
          value={`${metrics?.accuracyRate ?? 0}%`}
          accentColor={ACCENT}
          trend={{ value: 0.5, direction: 'up' }}
        />
        <MetricCard label="Orders Ready to Ship" value={4} accentColor={ACCENT} />
      </div>

      {/* Fulfillment Progress Bar */}
      <div className="rounded-xl bg-card p-6">
        <h3 className="text-sm font-semibold text-text-bright mb-4">Today&apos;s Fulfillment Progress</h3>

        {/* Segmented bar */}
        <div className="flex h-10 w-full overflow-hidden rounded-lg">
          {progress?.stages.map((stage) => {
            const widthPct = (stage.count / totalSegments) * 100;
            const opacity = STAGE_OPACITIES[stage.status] ?? 0.5;
            return (
              <div
                key={stage.status}
                className="flex items-center justify-center text-xs font-medium transition-all"
                style={{
                  width: `${widthPct}%`,
                  backgroundColor: ACCENT,
                  opacity,
                  color: opacity > 0.5 ? 'white' : 'var(--text-text-bright)',
                }}
              >
                {stage.count > 0 && stage.count}
              </div>
            );
          })}
        </div>

        {/* Stage labels */}
        <div className="flex mt-2">
          {progress?.stages.map((stage) => {
            const widthPct = (stage.count / totalSegments) * 100;
            return (
              <div
                key={stage.status}
                className="text-center"
                style={{ width: `${widthPct}%` }}
              >
                <span className="text-[10px] text-text-muted">{stage.label}</span>
              </div>
            );
          })}
        </div>

        {/* Units picked progress */}
        <div className="mt-6 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-muted">
              {progress?.unitsPicked ?? 0} / {progress?.totalUnitsToday ?? 0} units picked
            </span>
            <span className="font-medium" style={{ color: ACCENT }}>
              {pickedPct.toFixed(0)}%
            </span>
          </div>
          <div className="h-2 rounded-full bg-elevated overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${pickedPct}%`, backgroundColor: ACCENT }}
            />
          </div>
        </div>

        {/* Throughput indicator */}
        <div className="mt-4 flex items-center gap-3 text-sm">
          <span className="text-text-muted">Today&apos;s throughput:</span>
          <span className="font-semibold" style={{ color: ACCENT }}>
            {progress?.unitsPicked ?? 0} / {progress?.throughputTarget ?? 0} target
          </span>
          <span className="text-text-muted">({throughputPct.toFixed(0)}%)</span>
        </div>
      </div>
    </div>
  );
}
