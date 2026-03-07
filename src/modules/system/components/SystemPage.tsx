'use client';

import { useState, useMemo } from 'react';
import { Server } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import {
  SectionHeader,
  MetricCard,
  DataTable,
  StatusBadge,
  LoadingSkeleton,
  ChartWrapper,
  CHART_THEME,
  CHART_COLORS,
  ErrorState,
  EmptyState,
} from '@/components';
import { useSystemHealth, useBackgroundJobs, useAIModelUsage, useFeatureFlags } from '../hooks';
import type { SystemTab, HealthStatus, JobStatus } from '../types';

const ACCENT = '#64748B';

const TABS: { key: SystemTab; label: string }[] = [
  { key: 'health', label: 'Health' },
  { key: 'jobs', label: 'Background Jobs' },
  { key: 'ai-usage', label: 'AI Usage' },
  { key: 'feature-flags', label: 'Feature Flags' },
];

const HEALTH_BADGE: Record<HealthStatus, { variant: 'success' | 'warning' | 'danger'; dot: boolean; pulse: boolean }> = {
  healthy: { variant: 'success', dot: true, pulse: false },
  degraded: { variant: 'warning', dot: true, pulse: true },
  down: { variant: 'danger', dot: true, pulse: true },
};

const JOB_STATUS_BADGE: Record<JobStatus, { variant: 'info' | 'success' | 'danger' | 'muted'; pulse: boolean }> = {
  running: { variant: 'info', pulse: true },
  completed: { variant: 'success', pulse: false },
  failed: { variant: 'danger', pulse: false },
  scheduled: { variant: 'muted', pulse: false },
};

const TYPE_BADGE_VARIANT: Record<string, 'default' | 'info' | 'warning' | 'muted'> = {
  sync: 'info',
  report: 'warning',
  cleanup: 'muted',
  ai: 'default',
};

function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function formatFutureTime(iso: string): string {
  const diff = new Date(iso).getTime() - Date.now();
  if (diff < 0) return 'overdue';
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `in ${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `in ${hours}h`;
  const days = Math.floor(hours / 24);
  return `in ${days}d`;
}

const DONUT_COLORS = [CHART_COLORS.primary, CHART_COLORS.amber];

export function SystemPage() {
  const [activeTab, setActiveTab] = useState<SystemTab>('health');
  const [overrides, setOverrides] = useState<Record<string, boolean>>({});

  const healthQuery = useSystemHealth();
  const jobsQuery = useBackgroundJobs();
  const aiQuery = useAIModelUsage();
  const flagsQuery = useFeatureFlags();

  const localFlags = useMemo(() => {
    if (!flagsQuery.data) return [];
    return flagsQuery.data.map((f) => ({
      ...f,
      enabled: overrides[f.id] !== undefined ? overrides[f.id] : f.enabled,
    }));
  }, [flagsQuery.data, overrides]);

  const toggleFlag = (id: string) => {
    const current = localFlags.find((f) => f.id === id);
    if (current) {
      setOverrides((prev) => ({ ...prev, [id]: !current.enabled }));
    }
  };

  // AI usage aggregations
  const totalTokens = aiQuery.data?.reduce((s, m) => s + m.tokensToday, 0) ?? 0;
  const totalCost = aiQuery.data?.reduce((s, m) => s + m.costToday, 0) ?? 0;
  const primaryPct = aiQuery.data && totalTokens > 0
    ? ((aiQuery.data[0].tokensToday / totalTokens) * 100).toFixed(1)
    : '0';
  const primaryLatency = aiQuery.data?.[0]?.avgLatency ?? 0;

  const donutData = aiQuery.data?.map((m) => ({ name: m.model, value: m.tokensToday })) ?? [];

  const systemError = healthQuery.error || jobsQuery.error || aiQuery.error || flagsQuery.error;
  if (systemError) {
    return (
      <div className="p-6">
        <ErrorState
          title="Failed to load system data"
          message={systemError.message}
          onRetry={() => { healthQuery.refetch(); jobsQuery.refetch(); aiQuery.refetch(); flagsQuery.refetch(); }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={Server}
        title="System"
        subtitle="Platform health, background jobs, AI usage, and feature flags"
        accentColor={ACCENT}
      />

      {/* Tab Bar */}
      <div className="flex gap-0 border-b border-[var(--border-default)]">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
              activeTab === tab.key
                ? 'border-[#64748B] text-[var(--text-text-bright)]'
                : 'border-transparent text-[var(--text-text-muted)] hover:text-[var(--text-text-default)]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Health Tab */}
      {activeTab === 'health' && (
        <div>
          {healthQuery.isLoading ? (
            <LoadingSkeleton variant="card" count={5} />
          ) : healthQuery.data?.length === 0 ? (
            <EmptyState
              icon={Server}
              title="No health data"
              description="System health metrics are not available."
              accentColor={ACCENT}
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {healthQuery.data?.map((h) => {
                const badge = HEALTH_BADGE[h.status];
                return (
                  <div
                    key={h.component}
                    className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-card)] p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold text-[var(--text-text-bright)]">
                        {h.component}
                      </span>
                      <StatusBadge
                        variant={badge.variant}
                        label={h.status}
                        size="sm"
                        dot={badge.dot}
                        pulse={badge.pulse}
                      />
                    </div>
                    <div className="text-xs text-[var(--text-text-muted)] mb-1">{h.metric}</div>
                    <div className="text-lg font-bold text-[var(--text-text-bright)]">{h.value}</div>
                    {h.threshold && (
                      <div className="mt-1 text-xs text-[var(--text-text-muted)]">
                        Threshold: {h.threshold}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Jobs Tab */}
      {activeTab === 'jobs' && (
        <div>
          {jobsQuery.isLoading ? (
            <LoadingSkeleton variant="table" />
          ) : jobsQuery.data?.length === 0 ? (
            <EmptyState
              icon={Server}
              title="No background jobs"
              description="There are no background jobs to display."
              accentColor={ACCENT}
            />
          ) : (
            <DataTable
              data={jobsQuery.data ?? []}
              columns={[
                {
                  header: 'Job Name',
                  accessor: 'name',
                  sortable: true,
                  render: (row) => (
                    <div>
                      <span className="font-medium text-[var(--text-text-bright)]">{row.name}</span>
                      {row.error && (
                        <div className="mt-1 text-xs text-[var(--color-danger)]">{row.error}</div>
                      )}
                    </div>
                  ),
                },
                {
                  header: 'Type',
                  accessor: 'type',
                  sortable: true,
                  render: (row) => (
                    <StatusBadge
                      variant={TYPE_BADGE_VARIANT[row.type] ?? 'default'}
                      label={row.type}
                      size="sm"
                    />
                  ),
                },
                {
                  header: 'Status',
                  accessor: 'status',
                  sortable: true,
                  render: (row) => {
                    const cfg = JOB_STATUS_BADGE[row.status];
                    return (
                      <StatusBadge
                        variant={cfg.variant}
                        label={row.status}
                        size="sm"
                        dot
                        pulse={cfg.pulse}
                      />
                    );
                  },
                },
                {
                  header: 'Last Run',
                  accessor: 'lastRun',
                  sortable: true,
                  render: (row) => (
                    <span className="text-[var(--text-text-muted)]">
                      {formatRelativeTime(row.lastRun)}
                    </span>
                  ),
                },
                {
                  header: 'Next Run',
                  accessor: (row) => row.nextRun ?? '',
                  render: (row) => (
                    <span className="text-[var(--text-text-muted)]">
                      {row.nextRun ? formatFutureTime(row.nextRun) : '—'}
                    </span>
                  ),
                },
                {
                  header: 'Duration',
                  accessor: (row) => row.duration ?? '',
                  render: (row) => (
                    <span className="text-[var(--text-text-muted)]">{row.duration ?? '—'}</span>
                  ),
                },
              ]}
              searchable
              searchPlaceholder="Search jobs..."
              pageSize={10}
            />
          )}
        </div>
      )}

      {/* AI Usage Tab */}
      {activeTab === 'ai-usage' && (
        <div className="space-y-6">
          {aiQuery.isLoading ? (
            <LoadingSkeleton variant="card" count={4} />
          ) : (
            <>
              {/* Metric cards */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <MetricCard
                  label="Total Tokens Today"
                  value={totalTokens.toLocaleString()}
                  accentColor={ACCENT}
                />
                <MetricCard
                  label="Total Cost"
                  value={`$${totalCost.toFixed(2)}`}
                  accentColor={ACCENT}
                />
                <MetricCard
                  label="Primary Model %"
                  value={`${primaryPct}%`}
                  accentColor={ACCENT}
                />
                <MetricCard
                  label="Avg Latency"
                  value={`${primaryLatency}ms`}
                  accentColor={ACCENT}
                />
              </div>

              {/* Donut + detail cards */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <ChartWrapper title="Model Distribution" height={240}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={donutData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        dataKey="value"
                        stroke="none"
                      >
                        {donutData.map((_, i) => (
                          <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: CHART_THEME.tooltipBg,
                          border: `1px solid ${CHART_THEME.tooltipBorder}`,
                          borderRadius: '8px',
                          color: CHART_THEME.tooltipText,
                        }}
                        formatter={(value) => [`${Number(value).toLocaleString()} tokens`, '']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartWrapper>

                <div className="lg:col-span-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {aiQuery.data?.map((model, i) => (
                    <div
                      key={model.model}
                      className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-card)] p-4"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <span
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: DONUT_COLORS[i % DONUT_COLORS.length] }}
                        />
                        <span className="text-sm font-semibold text-[var(--text-text-bright)]">
                          {model.model}
                        </span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-[var(--text-text-muted)]">Tokens</span>
                          <span className="text-[var(--text-text-default)]">
                            {model.tokensToday.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[var(--text-text-muted)]">Cost</span>
                          <span className="text-[var(--text-text-default)]">
                            ${model.costToday.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[var(--text-text-muted)]">Requests</span>
                          <span className="text-[var(--text-text-default)]">{model.requestsToday}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[var(--text-text-muted)]">Avg Latency</span>
                          <span className="text-[var(--text-text-default)]">{model.avgLatency}ms</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[var(--text-text-muted)]">Error Rate</span>
                          <span
                            className={
                              model.errorRate > 1
                                ? 'text-[var(--color-danger)]'
                                : 'text-[var(--text-text-default)]'
                            }
                          >
                            {model.errorRate}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Feature Flags Tab */}
      {activeTab === 'feature-flags' && (
        <div>
          {flagsQuery.isLoading ? (
            <LoadingSkeleton variant="list" count={2} />
          ) : (
            <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-card)] divide-y divide-[var(--border-default)]">
              {localFlags.map((flag) => (
                <div
                  key={flag.id}
                  className="flex items-center justify-between gap-4 p-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-[var(--text-text-bright)]">
                        {flag.name}
                      </span>
                      <StatusBadge variant="default" label={flag.module} size="sm" />
                    </div>
                    <p className="text-xs text-[var(--text-text-muted)] line-clamp-1">
                      {flag.description}
                    </p>
                  </div>
                  <button
                    onClick={() => toggleFlag(flag.id)}
                    className={`relative inline-flex h-5 w-10 shrink-0 items-center rounded-full transition-colors duration-200 ${
                      flag.enabled
                        ? 'bg-[var(--color-success)]'
                        : 'bg-[var(--bg-elevated)]'
                    }`}
                    role="switch"
                    aria-checked={flag.enabled}
                    aria-label={`Toggle ${flag.name}`}
                  >
                    <span
                      className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform duration-200 ${
                        flag.enabled ? 'translate-x-5' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
