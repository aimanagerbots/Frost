'use client';

import { MetricCard, LoadingSkeleton, StatusBadge } from '@/components';
import {
  usePackagingMetrics,
  usePackagingAlerts,
  usePackagingOrders,
} from '../../hooks';
import { usePackagingStore } from '../../store';
import { MaterialAlerts } from '../MaterialAlerts';
import { PackagingThroughputChart } from './PackagingThroughputChart';
import { PackagingLinesSummary } from './PackagingLinesSummary';
import type { PackagingAlert } from '../../types';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';
import type { PackagingOrder } from '../../types';

const ACCENT = '#84CC16';

function orderStatusVariant(status: PackagingOrder['status']): 'success' | 'warning' | 'danger' | 'muted' {
  switch (status) {
    case 'completed': return 'success';
    case 'in-progress': return 'warning';
    case 'blocked-material': return 'danger';
    case 'queued': return 'muted';
  }
}

function orderStatusLabel(status: PackagingOrder['status']): string {
  switch (status) {
    case 'completed': return 'Completed';
    case 'in-progress': return 'In Progress';
    case 'blocked-material': return 'Blocked';
    case 'queued': return 'Queued';
  }
}

const SEVERITY_CONFIG: Record<PackagingAlert['severity'], { icon: React.ElementType; color: string }> = {
  critical: { icon: AlertCircle, color: '#EF4444' },
  warning: { icon: AlertTriangle, color: '#FBBF24' },
  info: { icon: Info, color: '#38BDF8' },
};

export function PackagingDashboard() {
  const { data: metrics, isLoading: metricsLoading } = usePackagingMetrics();
  const { data: alerts } = usePackagingAlerts();
  const { data: orders } = usePackagingOrders({ status: 'in-progress' });
  const { setView, selectOrder } = usePackagingStore();

  const activeOrders = orders?.slice(0, 5) ?? [];

  if (metricsLoading) return <LoadingSkeleton variant="card" count={6} />;

  return (
    <div className="space-y-6">
      {/* Hero Metrics */}
      {metrics && (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          <MetricCard label="Total Orders" value={metrics.totalOrders} accentColor={ACCENT} />
          <MetricCard label="Completed Today" value={metrics.completedToday} accentColor={ACCENT} />
          <MetricCard label="In Progress" value={metrics.inProgress} accentColor={ACCENT} />
          <MetricCard
            label="Material Shortages"
            value={metrics.materialShortages}
            accentColor={metrics.materialShortages > 0 ? '#EF4444' : ACCENT}
          />
          <MetricCard
            label="Packages / Hour"
            value={metrics.avgPackagesPerHour}
            accentColor={ACCENT}
          />
          <MetricCard label="Top SKU" value={metrics.topSKU} accentColor={ACCENT} />
        </div>
      )}

      {/* Material Alerts row (only renders when shortages exist) */}
      <MaterialAlerts />

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <PackagingThroughputChart />
        <PackagingLinesSummary />
      </div>

      {/* Active Orders + Alerts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Active Orders */}
        <div className="rounded-xl bg-card p-4">
          <h3 className="mb-3 text-sm font-semibold text-text-bright">Active Orders</h3>
          {activeOrders.length === 0 ? (
            <p className="py-4 text-center text-xs text-text-muted">No orders in progress</p>
          ) : (
            <div className="space-y-2">
              {activeOrders.map((order) => (
                <button
                  key={order.id}
                  onClick={() => {
                    selectOrder(order.id);
                    setView('work-orders');
                  }}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-accent-hover"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-medium text-text-bright">
                        {order.product}
                      </span>
                      <span
                        className="shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-medium capitalize"
                        style={{
                          backgroundColor: `${ACCENT}20`,
                          color: ACCENT,
                        }}
                      >
                        {order.category}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-xs text-text-muted">
                      <span>{order.assignee}</span>
                      <span>&#183;</span>
                      <span>SKU: {order.sku}</span>
                    </div>
                  </div>
                  <div className="shrink-0">
                    <StatusBadge
                      variant={orderStatusVariant(order.status)}
                      label={orderStatusLabel(order.status)}
                      size="sm"
                    />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Alerts Panel */}
        <div className="rounded-xl bg-card p-4">
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
