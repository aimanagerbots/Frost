'use client';

import { LayoutDashboard, Activity, CheckCircle2 } from 'lucide-react';
import { SectionHeader, MetricCard, LoadingSkeleton, ErrorState, EmptyState } from '@/components';
import { useDashboardAlerts } from '@/modules/dashboard/hooks/useDashboardAlerts';
import { useDashboardMetrics } from '@/modules/dashboard/hooks/useDashboardMetrics';
import { useDashboardCharts } from '@/modules/dashboard/hooks/useDashboardCharts';
import { useAlertRules } from '@/modules/crm/hooks/useAlertRules';
import { AlertsRow } from './AlertsRow';
import { DashboardCharts } from './DashboardCharts';
import { QuickActions } from './QuickActions';
import { ACCENT as DASHBOARD_ACCENT } from '@/design/colors';


function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function formatDate(): string {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export function DashboardPage() {
  const { data: alerts, isLoading: alertsLoading, error: alertsError, refetch: refetchAlerts } = useDashboardAlerts();
  const { data: metrics, isLoading: metricsLoading, error: metricsError, refetch: refetchMetrics } = useDashboardMetrics();
  const { data: charts, isLoading: chartsLoading, error: chartsError, refetch: refetchCharts } = useDashboardCharts();
  const { data: proactiveAlerts } = useAlertRules();

  const isLoading = alertsLoading || metricsLoading || chartsLoading;

  if (isLoading) {
    return (
      <div className="space-y-4 p-6">
        <LoadingSkeleton variant="text" />
        <LoadingSkeleton variant="card" count={4} />
        <LoadingSkeleton variant="chart" count={2} />
      </div>
    );
  }

  const error = alertsError || metricsError || chartsError;
  if (error) {
    return (
      <ErrorState
        title="Failed to load dashboard"
        message={error.message}
        onRetry={() => { refetchAlerts(); refetchMetrics(); refetchCharts(); }}
      />
    );
  }

  return (
    <div className="space-y-4 p-6">
      <SectionHeader
        icon={LayoutDashboard}
        title="Dashboard"
        subtitle="Your operational command center"
        accentColor={DASHBOARD_ACCENT}
        stats={[
          { label: 'Active Orders', value: 34 },
          { label: 'Alerts', value: alerts?.filter((a) => !a.dismissed).length ?? 0 },
        ]}
      />

      {/* Welcome Header */}
      <div className="flex items-center justify-between rounded-xl bg-card p-5">
        <div>
          <h2 className="font-display text-xl font-semibold text-text-bright">
            {getGreeting()}, Team
          </h2>
          <p className="mt-1 text-sm text-text-muted">{formatDate()}</p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-green-500/15 px-3 py-1.5">
          <CheckCircle2 className="h-4 w-4 text-green-400" />
          <span className="text-sm font-medium text-green-400">Operational</span>
        </div>
      </div>

      {/* Alerts */}
      {alerts && (
        <AlertsRow
          alerts={[
            ...alerts,
            ...(proactiveAlerts?.dashboardAlerts ?? []).filter(
              (pa) => !alerts.some((a) => a.id === pa.id)
            ),
          ]}
        />
      )}

      {/* KPI Metrics */}
      {metrics?.length === 0 && (
        <EmptyState icon={Activity} title="No metrics" description="No dashboard metrics available yet." accentColor={DASHBOARD_ACCENT} />
      )}
      {metrics && metrics.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric) => (
            <MetricCard
              key={metric.id}
              label={metric.label}
              value={metric.value}
              trend={
                metric.trend !== 0
                  ? {
                      value: Math.abs(metric.trend),
                      direction: metric.trend > 0 ? 'up' : 'down',
                    }
                  : { value: 0, direction: 'flat' }
              }
              accentColor={DASHBOARD_ACCENT}
              sparklineData={metric.sparklineData}
            />
          ))}
        </div>
      )}

      {/* Charts */}
      {charts && <DashboardCharts data={charts} />}

      {/* Quick Actions */}
      <QuickActions />
    </div>
  );
}
