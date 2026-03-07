'use client';

import { LayoutDashboard, Activity } from 'lucide-react';
import { SectionHeader, MetricCard, LoadingSkeleton, ErrorState, EmptyState } from '@/components';
import { useDashboardAlerts } from '@/modules/dashboard/hooks/useDashboardAlerts';
import { useDashboardMetrics } from '@/modules/dashboard/hooks/useDashboardMetrics';
import { useDashboardCharts } from '@/modules/dashboard/hooks/useDashboardCharts';
import { AlertsRow } from './AlertsRow';
import { DashboardCharts } from './DashboardCharts';
import { QuickActions } from './QuickActions';

const DASHBOARD_ACCENT = '#667EEA';

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

  const isLoading = alertsLoading || metricsLoading || chartsLoading;

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
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
    <div className="space-y-6 p-6">
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
      <div className="rounded-xl border border-default bg-card p-5">
        <h2 className="text-xl font-bold text-text-bright">
          {getGreeting()}, Team
        </h2>
        <p className="mt-1 text-sm text-text-muted">{formatDate()}</p>
        <p className="mt-3 text-sm text-text-default leading-relaxed">
          <span
            className="mr-2 inline-block h-2 w-2 rounded-full"
            style={{ backgroundColor: DASHBOARD_ACCENT }}
          />
          12 orders pending, 3 alerts need attention, manufacturing is running at 89% capacity.
          On-time delivery rate holding steady at 94%.
        </p>
      </div>

      {/* Alerts */}
      {alerts && <AlertsRow alerts={alerts} />}

      {/* KPI Metrics */}
      {metrics?.length === 0 && (
        <EmptyState icon={Activity} title="No metrics" description="No dashboard metrics available yet." accentColor={DASHBOARD_ACCENT} />
      )}
      {metrics && metrics.length > 0 && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
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
