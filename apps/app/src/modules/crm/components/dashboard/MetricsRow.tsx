'use client';

import { MetricCard } from '@/components';
import type { CRMDashboardMetrics, KPIMetric } from '@/modules/crm/types';
import { ACCENT as CRM_ACCENT } from '@/design/colors';
import {
  revenueSparkline,
  accountsSparkline,
  aovSparkline,
  ordersSparkline,
} from '@/mocks/crm';


const KPI_COLORS: Record<KPIMetric['category'], string> = {
  order: '#5BB8E6',
  basket: '#5BB8E6',
  'sell-through': '#5BB8E6',
  revenue: '#5BB8E6',
  payment: '#5BB8E6',
  relationship: '#5BB8E6',
  competitive: '#5BB8E6',
};

interface MetricsRowProps {
  metrics: CRMDashboardMetrics;
  kpiMetrics?: KPIMetric[];
}

export function MetricsRow({ metrics, kpiMetrics }: MetricsRowProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
        <MetricCard
          label="Total Revenue (MTD)"
          value={`$${(metrics.totalRevenue / 1000).toFixed(0)}K`}
          trend={{ value: metrics.revenueTrend, direction: metrics.revenueTrend > 0 ? 'up' : 'down' }}
          accentColor={CRM_ACCENT}
          sparklineData={revenueSparkline}
        />
        <MetricCard
          label="Active Accounts"
          value={metrics.activeAccounts}
          trend={{ value: metrics.activeAccountsTrend, direction: metrics.activeAccountsTrend > 0 ? 'up' : 'down' }}
          accentColor="#38BDF8"
          sparklineData={accountsSparkline}
        />
        <MetricCard
          label="Average Order Value"
          value={`$${metrics.avgOrderValue.toLocaleString()}`}
          trend={{ value: Math.abs(metrics.aovTrend), direction: metrics.aovTrend > 0 ? 'up' : metrics.aovTrend < 0 ? 'down' : 'flat' }}
          accentColor="#5BB8E6"
          sparklineData={aovSparkline}
        />
        <MetricCard
          label="Orders Pending"
          value={metrics.ordersPending}
          trend={{ value: 0, direction: 'flat' }}
          accentColor="#5BB8E6"
          sparklineData={ordersSparkline}
        />
        <MetricCard
          label="At-Risk Accounts"
          value={metrics.atRiskAccounts}
          trend={{ value: 0, direction: 'flat' }}
          accentColor="#FB7185"
        />
        <MetricCard
          label="Overdue Payments"
          value={metrics.overduePayments.count > 0 ? `${metrics.overduePayments.count} ($${(metrics.overduePayments.amount / 1000).toFixed(1)}K)` : '0'}
          trend={{ value: 0, direction: 'flat' }}
          accentColor={metrics.overduePayments.count > 0 ? '#FB7185' : '#00E5A0'}
        />
      </div>

      {kpiMetrics && kpiMetrics.length > 0 && (
        <>
          <h3 className="text-sm font-medium text-text-muted">Health KPIs</h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
            {kpiMetrics.map((kpi) => (
              <div
                key={kpi.category}
                className="rounded-xl border border-default bg-card p-3"
              >
                <p className="text-[11px] font-medium text-text-muted">
                  {kpi.label}
                </p>
                <p className="mt-1 text-lg font-semibold text-text-bright">
                  {kpi.unit === '$'
                    ? `$${kpi.value.toLocaleString()}`
                    : kpi.unit === '%'
                      ? `${kpi.value}%`
                      : kpi.value.toLocaleString()}
                  {kpi.unit !== '$' && kpi.unit !== '%' && (
                    <span className="ml-1 text-xs font-normal text-text-muted">
                      {kpi.unit}
                    </span>
                  )}
                </p>
                <p
                  className="mt-0.5 text-xs font-medium"
                  style={{
                    color:
                      kpi.trend > 0
                        ? '#5BB8E6'
                        : kpi.trend < 0
                          ? '#EF4444'
                          : KPI_COLORS[kpi.category],
                  }}
                >
                  {kpi.trend > 0 ? '+' : ''}
                  {kpi.trend}%
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
