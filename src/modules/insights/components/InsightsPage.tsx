'use client';

import { useState, useMemo } from 'react';
import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Target,
  GitBranch,
  Lightbulb,
  Search,
  Zap,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  SectionHeader,
  MetricCard,
  StatusBadge,
  ChartWrapper,
  CHART_THEME,
  CHART_COLORS,
  LoadingSkeleton,
} from '@/components';
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { useInsights } from '../hooks/useInsights';
import { useInsightQuery } from '../hooks/useInsightQuery';
import type { Insight } from '../types';

const ACCENT = '#06B6D4';

const TYPE_ICONS = {
  trend: TrendingUp,
  anomaly: AlertTriangle,
  prediction: Target,
  correlation: GitBranch,
  recommendation: Lightbulb,
} as const;

const TYPE_COLORS = {
  trend: CHART_COLORS.info,
  anomaly: CHART_COLORS.warning,
  prediction: CHART_COLORS.purple,
  correlation: CHART_COLORS.cyan,
  recommendation: CHART_COLORS.success,
} as const;

const TYPE_BADGE_VARIANTS: Record<string, 'info' | 'warning' | 'success' | 'danger' | 'default'> = {
  trend: 'info',
  anomaly: 'warning',
  prediction: 'default',
  correlation: 'info',
  recommendation: 'success',
};

const SEVERITY_BORDER: Record<string, string> = {
  high: 'border-l-red-500',
  medium: 'border-l-amber-500',
  low: 'border-l-blue-500',
};

const TYPE_FILTER_OPTIONS = [
  { key: 'all', label: 'All Types' },
  { key: 'trend', label: 'Trends' },
  { key: 'anomaly', label: 'Anomalies' },
  { key: 'prediction', label: 'Predictions' },
  { key: 'correlation', label: 'Correlations' },
  { key: 'recommendation', label: 'Recommendations' },
];

const SEVERITY_FILTER_OPTIONS = [
  { key: 'all', label: 'All Severity' },
  { key: 'high', label: 'High' },
  { key: 'medium', label: 'Medium' },
  { key: 'low', label: 'Low' },
];

const SUGGESTED_QUERIES = [
  'Which accounts are at risk of churning?',
  'What is our best performing product category?',
  'How are we doing against CloudNine?',
  'What should I focus on this week?',
  'What is our projected revenue for Q2?',
];

function ConfidenceBar({ value }: { value: number }) {
  const color =
    value >= 80 ? '#22C55E' : value >= 60 ? '#F59E0B' : '#EF4444';

  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 rounded-full bg-elevated">
        <div
          className="h-1.5 rounded-full transition-all"
          style={{ width: `${value}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-xs text-text-muted">{value}%</span>
    </div>
  );
}

function InsightCard({ insight }: { insight: Insight }) {
  const TypeIcon = TYPE_ICONS[insight.type];

  return (
    <div
      className={cn(
        'rounded-xl border border-default bg-card p-4 border-l-4 transition-all duration-200 hover:bg-card-hover',
        SEVERITY_BORDER[insight.severity]
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1.5">
            <TypeIcon
              className="h-4 w-4 shrink-0"
              style={{ color: TYPE_COLORS[insight.type] }}
            />
            <StatusBadge
              label={insight.type.charAt(0).toUpperCase() + insight.type.slice(1)}
              variant={TYPE_BADGE_VARIANTS[insight.type] ?? 'default'}
              size="sm"
            />
            <StatusBadge
              label={insight.module}
              variant="muted"
              size="sm"
            />
          </div>
          <h3 className="text-sm font-semibold text-text-bright">
            {insight.title}
          </h3>
          <p className="mt-1.5 text-xs text-text-default leading-relaxed">
            {insight.description}
          </p>
          <div className="mt-3 flex items-center gap-4">
            <ConfidenceBar value={insight.confidence} />
            <span className="text-xs text-text-muted">
              {new Date(insight.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {insight.actionable && insight.action && (
        <button
          className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-medium text-white transition-colors hover:opacity-90"
          style={{ backgroundColor: ACCENT }}
        >
          <Zap className="h-3.5 w-3.5" />
          {insight.action}
        </button>
      )}
    </div>
  );
}

function QueryResponseTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; name: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-lg border px-3 py-2 text-xs shadow-lg"
      style={{
        backgroundColor: CHART_THEME.tooltipBg,
        borderColor: CHART_THEME.tooltipBorder,
        color: CHART_THEME.tooltipText,
      }}
    >
      <p className="mb-1 font-medium">{label}</p>
      {payload.map((entry, i) => (
        <p key={i}>
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  );
}

export function InsightsPage() {
  const [typeFilter, setTypeFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [actionableOnly, setActionableOnly] = useState(false);
  const [queryInput, setQueryInput] = useState('');

  const filters = useMemo(
    () => ({
      type: typeFilter !== 'all' ? typeFilter : undefined,
      severity: severityFilter !== 'all' ? severityFilter : undefined,
      actionable: actionableOnly ? true : undefined,
    }),
    [typeFilter, severityFilter, actionableOnly]
  );

  const { data: insights, isLoading } = useInsights(filters);
  const { result: queryResult, isLoading: queryLoading, submitQuery, clearResult } = useInsightQuery();

  // All insights for metrics (unfiltered)
  const { data: allInsights } = useInsights();

  const handleQuerySubmit = () => {
    if (!queryInput.trim()) return;
    submitQuery(queryInput);
  };

  // Metrics from all insights
  const metrics = useMemo(() => {
    if (!allInsights) return null;
    const highSeverity = allInsights.filter((i) => i.severity === 'high').length;
    const actionable = allInsights.filter((i) => i.actionable).length;
    return {
      total: allInsights.length,
      highSeverity,
      actionable,
      predictionAccuracy: 84,
    };
  }, [allInsights]);

  // Chart data: insights by module
  const moduleChartData = useMemo(() => {
    if (!allInsights) return [];
    const counts: Record<string, number> = {};
    allInsights.forEach((i) => {
      counts[i.module] = (counts[i.module] ?? 0) + 1;
    });
    return Object.entries(counts)
      .map(([module, count]) => ({ module, count }))
      .sort((a, b) => b.count - a.count);
  }, [allInsights]);

  if (isLoading) {
    return <LoadingSkeleton variant="card" count={6} />;
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={Sparkles}
        title="Insights"
        subtitle="AI-generated intelligence across your entire operation"
        accentColor={ACCENT}
      />

      {/* Natural Language Query Bar */}
      <div className="rounded-xl border border-default bg-card p-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Ask anything about your business..."
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleQuerySubmit();
              }}
              className="w-full rounded-lg border border-default bg-elevated py-2.5 pl-9 pr-3 text-sm text-text-default placeholder:text-text-muted focus:border-[#06B6D4] focus:outline-none focus:ring-1 focus:ring-[#06B6D4]"
            />
          </div>
          <button
            onClick={handleQuerySubmit}
            disabled={!queryInput.trim() || queryLoading}
            className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white transition-colors disabled:opacity-50"
            style={{ backgroundColor: ACCENT }}
          >
            {queryLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            Ask
          </button>
        </div>

        {/* Suggested queries (show when no query result) */}
        {!queryResult && !queryLoading && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {SUGGESTED_QUERIES.map((sq) => (
              <button
                key={sq}
                onClick={() => {
                  setQueryInput(sq);
                  submitQuery(sq);
                }}
                className="flex items-center gap-1 rounded-full bg-elevated px-3 py-1 text-xs text-text-muted transition-colors hover:text-text-default hover:bg-card-hover"
              >
                <ArrowRight className="h-3 w-3" />
                {sq}
              </button>
            ))}
          </div>
        )}

        {/* Query Loading */}
        {queryLoading && (
          <div className="mt-3 flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" style={{ color: ACCENT }} />
            <span className="text-sm text-text-muted">Analyzing your data...</span>
          </div>
        )}

        {/* Query Response */}
        {queryResult && !queryLoading && (
          <div className="mt-3 rounded-lg border border-default bg-elevated p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="text-xs text-text-muted mb-2">
                  Q: {queryResult.query}
                </p>
                <div className="text-sm text-text-default leading-relaxed whitespace-pre-line">
                  {queryResult.results}
                </div>
              </div>
              <button
                onClick={clearResult}
                className="shrink-0 text-xs text-text-muted hover:text-text-default"
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Metric Cards */}
      {metrics && (
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
          <MetricCard
            label="Insights This Week"
            value={metrics.total}
            accentColor={ACCENT}
          />
          <MetricCard
            label="High Severity"
            value={metrics.highSeverity}
            accentColor={CHART_COLORS.danger}
          />
          <MetricCard
            label="Actionable"
            value={metrics.actionable}
            accentColor={CHART_COLORS.success}
          />
          <MetricCard
            label="Prediction Accuracy"
            value={`${metrics.predictionAccuracy}%`}
            accentColor={ACCENT}
            trend={{ value: 3, direction: 'up' }}
          />
        </div>
      )}

      {/* Filter Row */}
      <div className="flex flex-wrap items-center gap-2">
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="rounded-lg border border-default bg-elevated px-3 py-1.5 text-xs text-text-default focus:outline-none focus:ring-1 focus:ring-[#06B6D4]"
        >
          {TYPE_FILTER_OPTIONS.map((opt) => (
            <option key={opt.key} value={opt.key}>
              {opt.label}
            </option>
          ))}
        </select>

        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
          className="rounded-lg border border-default bg-elevated px-3 py-1.5 text-xs text-text-default focus:outline-none focus:ring-1 focus:ring-[#06B6D4]"
        >
          {SEVERITY_FILTER_OPTIONS.map((opt) => (
            <option key={opt.key} value={opt.key}>
              {opt.label}
            </option>
          ))}
        </select>

        <button
          onClick={() => setActionableOnly(!actionableOnly)}
          className={cn(
            'rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors',
            actionableOnly
              ? 'border-[#06B6D4] text-white'
              : 'border-default bg-elevated text-text-muted hover:text-text-default'
          )}
          style={actionableOnly ? { backgroundColor: ACCENT } : undefined}
        >
          <Zap className="mr-1 inline h-3 w-3" />
          Actionable Only
        </button>
      </div>

      {/* Insights Feed */}
      <div>
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-text-bright">
          <Sparkles className="h-4 w-4" style={{ color: ACCENT }} />
          Insights Feed
          <span className="text-xs font-normal text-text-muted">
            ({(insights ?? []).length} results)
          </span>
        </h2>
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
          {(insights ?? []).map((insight) => (
            <InsightCard key={insight.id} insight={insight} />
          ))}
        </div>
      </div>

      {/* Insights by Module Chart */}
      <ChartWrapper
        title="Insights by Module"
        subtitle="Distribution of generated insights across platform modules"
        height={320}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={moduleChartData}
            margin={{ left: 10, right: 20, top: 10, bottom: 10 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={CHART_THEME.gridColor}
              vertical={false}
            />
            <XAxis
              dataKey="module"
              tick={{ fill: CHART_THEME.axisColor, fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: CHART_THEME.axisColor, fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip content={<QueryResponseTooltip />} />
            <Bar dataKey="count" name="Insights" fill={ACCENT} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartWrapper>
    </div>
  );
}
