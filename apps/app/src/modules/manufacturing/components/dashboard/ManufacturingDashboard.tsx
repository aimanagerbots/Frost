'use client';

import { MetricCard, LoadingSkeleton } from '@/components';
import { useManufacturingMetrics, useManufacturingAlerts } from '../../hooks';
import { ProductionSummary } from './ProductionSummary';
import { ThroughputChart } from './ThroughputChart';
import { ActiveWorkOrders } from './ActiveWorkOrders';
import type { ManufacturingAlert } from '../../types';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { ACCENT } from '@/design/colors';


const SEVERITY_CONFIG: Record<ManufacturingAlert['severity'], { icon: React.ElementType; color: string }> = {
  critical: { icon: AlertCircle, color: '#EF4444' },
  warning: { icon: AlertTriangle, color: '#FBBF24' },
  info: { icon: Info, color: '#38BDF8' },
};

function completionColor(pct: number): string {
  if (pct >= 80) return '#22C55E';
  if (pct >= 60) return '#FBBF24';
  return '#EF4444';
}

export function ManufacturingDashboard() {
  const { data: metrics, isLoading: metricsLoading } = useManufacturingMetrics();
  const { data: alerts } = useManufacturingAlerts();

  if (metricsLoading) return <LoadingSkeleton variant="card" count={6} />;

  return (
    <div className="space-y-6">
      {/* Hero Metrics */}
      {metrics && (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          <MetricCard label="Work Orders Today" value={metrics.totalWorkOrders} accentColor={ACCENT} />
          <MetricCard label="Units Produced" value={`342 / 400`} accentColor={ACCENT} />
          <MetricCard label="Active Lines" value="5 of 6" accentColor={ACCENT} />
          <MetricCard
            label="Avg Completion"
            value={`${metrics.throughputRate}%`}
            accentColor={completionColor(metrics.throughputRate)}
          />
          <MetricCard label="Failed QC (Week)" value={2} accentColor="#EF4444" />
          <MetricCard label="Labor Hours Today" value="48.5" accentColor={ACCENT} />
        </div>
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ProductionSummary />
        <ThroughputChart />
      </div>

      {/* Active Orders + Alerts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ActiveWorkOrders />

        {/* Alerts */}
        <div className="rounded-xl border border-default bg-card p-4">
          <h3 className="mb-3 text-sm font-semibold text-text-bright">Alerts</h3>
          {alerts && alerts.length > 0 ? (
            <div className="space-y-2">
              {alerts.map((alert) => {
                const cfg = SEVERITY_CONFIG[alert.severity];
                const Icon = cfg.icon;
                return (
                  <div
                    key={alert.id}
                    className="flex items-start gap-3 rounded-lg border border-default px-3 py-2"
                  >
                    <Icon className="mt-0.5 h-4 w-4 shrink-0" style={{ color: cfg.color }} />
                    <p className="text-xs text-text-default">{alert.message}</p>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="py-4 text-center text-xs text-text-muted">No active alerts</p>
          )}
        </div>
      </div>
    </div>
  );
}
