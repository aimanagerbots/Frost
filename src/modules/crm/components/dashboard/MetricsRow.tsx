'use client';

import { MetricCard } from '@/components';
import type { CRMDashboardMetrics } from '@/modules/crm/types';
import {
  revenueSparkline,
  accountsSparkline,
  aovSparkline,
  ordersSparkline,
} from '@/mocks/crm';

const CRM_ACCENT = '#F59E0B';

interface MetricsRowProps {
  metrics: CRMDashboardMetrics;
}

export function MetricsRow({ metrics }: MetricsRowProps) {
  return (
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
        accentColor="#8B5CF6"
        sparklineData={aovSparkline}
      />
      <MetricCard
        label="Orders Pending"
        value={metrics.ordersPending}
        trend={{ value: 0, direction: 'flat' }}
        accentColor="#06B6D4"
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
  );
}
