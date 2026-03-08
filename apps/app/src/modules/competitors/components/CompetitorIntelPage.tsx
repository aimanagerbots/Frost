'use client';

import { useState } from 'react';
import {
  Target,
  TrendingUp,
  TrendingDown,
  Minus,
  Store,
  AlertCircle,
  Eye,
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
  ErrorState,
  EmptyState,
} from '@/components';
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { useCompetitors, useCompetitorMetrics, useCompetitorAlerts } from '../hooks';
import { CompetitorDrawer } from './CompetitorDrawer';
import type { Competitor, CompetitorAlert } from '../types';
import { ACCENT } from '@/design/colors';


const TREND_ICONS = {
  growing: TrendingUp,
  stable: Minus,
  declining: TrendingDown,
} as const;

const TREND_COLORS = {
  growing: 'text-success',
  stable: 'text-text-muted',
  declining: 'text-danger',
} as const;

const ALERT_TYPE_LABELS: Record<string, string> = {
  'gained-placement': 'Gained Placement',
  'lost-placement': 'Lost Placement',
  'price-change': 'Price Change',
  'new-product': 'New Product',
};

const ALERT_TYPE_VARIANTS: Record<string, 'danger' | 'success' | 'warning' | 'info'> = {
  'gained-placement': 'danger',
  'lost-placement': 'success',
  'price-change': 'warning',
  'new-product': 'info',
};

const SEVERITY_BORDER: Record<string, string> = {
  high: 'border-l-red-500',
  medium: 'border-l-amber-500',
  low: 'border-l-gray-500',
};

// Build market share chart data from competitors
function buildMarketShareChart(competitors: Competitor[]) {
  const allCategories = new Set<string>();
  competitors.forEach((c) => c.categories.forEach((cat) => allCategories.add(cat)));

  return Array.from(allCategories).map((category) => {
    const entry: Record<string, string | number> = {
      category: category.charAt(0).toUpperCase() + category.slice(1),
    };
    competitors.forEach((c) => {
      entry[c.name] = c.avgPrice[category] ? c.marketShare : 0;
    });
    return entry;
  });
}

const COMPETITOR_COLORS = [
  CHART_COLORS.danger,
  CHART_COLORS.info,
  CHART_COLORS.warning,
  CHART_COLORS.success,
  CHART_COLORS.purple,
  CHART_COLORS.cyan,
];

function AlertCard({ alert }: { alert: CompetitorAlert }) {
  return (
    <div
      className={cn(
        'rounded-lg border-l-4 bg-card px-4 py-3',
        SEVERITY_BORDER[alert.severity] ?? 'border-l-gray-500'
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-text-bright">
              {alert.competitorName}
            </span>
            <StatusBadge
              label={ALERT_TYPE_LABELS[alert.type] ?? alert.type}
              variant={ALERT_TYPE_VARIANTS[alert.type] ?? 'default'}
              size="sm"
            />
          </div>
          <p className="mt-1 text-sm text-text-default">{alert.details}</p>
          <p className="mt-0.5 text-xs text-text-muted">{alert.accountName}</p>
        </div>
        <span className="shrink-0 text-xs text-text-muted">
          {new Date(alert.date).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}

function CompetitorCard({
  competitor,
  onViewDetails,
}: {
  competitor: Competitor;
  onViewDetails: () => void;
}) {
  const TrendIcon = TREND_ICONS[competitor.trend];
  const trendColor = TREND_COLORS[competitor.trend];

  return (
    <div className="rounded-xl border border-default bg-card p-4 transition-all duration-200 hover:bg-accent-hover">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-text-bright">{competitor.name}</h3>
          <p className="mt-0.5 line-clamp-2 text-xs text-text-muted">
            {competitor.description}
          </p>
        </div>
        <div className={cn('flex items-center gap-1', trendColor)}>
          <TrendIcon className="h-4 w-4" />
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <div className="text-lg font-bold text-text-bright">
              {competitor.marketShare}%
            </div>
            <div className="text-xs text-text-muted">Market Share</div>
          </div>
          <div className="flex items-center gap-1">
            <Store className="h-3.5 w-3.5 text-text-muted" />
            <span className="text-sm text-text-default">{competitor.storeCount}</span>
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1">
        {competitor.categories.map((cat) => (
          <StatusBadge key={cat} label={cat} variant="default" size="sm" />
        ))}
      </div>

      <button
        onClick={onViewDetails}
        className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg border border-default py-1.5 text-xs font-medium text-text-muted transition-colors hover:bg-accent-hover hover:text-text-default"
      >
        <Eye className="h-3.5 w-3.5" />
        View Details
      </button>
    </div>
  );
}

function MarketShareTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
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
        <p key={i} style={{ color: entry.color }}>
          {entry.name}: {entry.value}%
        </p>
      ))}
    </div>
  );
}

export function CompetitorIntelPage() {
  const [selectedCompetitor, setSelectedCompetitor] = useState<Competitor | null>(null);

  const { data: competitors, isLoading: competitorsLoading, error: competitorsError, refetch: refetchCompetitors } = useCompetitors();
  const { data: metrics, isLoading: metricsLoading, error: metricsError, refetch: refetchMetrics } = useCompetitorMetrics();
  const { data: alerts, isLoading: alertsLoading, error: alertsError, refetch: refetchAlerts } = useCompetitorAlerts();

  if (metricsLoading || competitorsLoading) {
    return <LoadingSkeleton variant="card" count={3} />;
  }

  if (competitorsError || metricsError || alertsError) {
    return (
      <ErrorState
        title="Failed to load competitor data"
        message={(competitorsError || metricsError || alertsError)?.message}
        onRetry={() => { refetchCompetitors(); refetchMetrics(); refetchAlerts(); }}
      />
    );
  }

  if (!competitors?.length) {
    return (
      <EmptyState
        icon={Target}
        title="No competitors tracked"
        description="No competitor data is available yet. Start tracking competitors to see intel here."
        accentColor={ACCENT}
      />
    );
  }

  const recentAlerts = (alerts ?? []).slice(0, 6);
  const chartData = buildMarketShareChart(competitors ?? []);
  const competitorNames = (competitors ?? []).map((c) => c.name);

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={Target}
        title="Competitor Intel"
        subtitle="Track competitor activity, pricing, and market share across your accounts"
        accentColor={ACCENT}
      />

      {/* Metrics Row */}
      {metrics && (
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
          <MetricCard
            label="Competitors Tracked"
            value={metrics.competitorsTracked}
            accentColor={ACCENT}
          />
          <MetricCard
            label="Our Market Share"
            value={`${metrics.ourMarketShare}%`}
            accentColor={ACCENT}
            trend={{ value: 3, direction: 'up' }}
          />
          <MetricCard
            label="Top Threat"
            value={metrics.topThreat}
            accentColor={CHART_COLORS.danger}
          />
          <MetricCard
            label="Recent Alerts"
            value={metrics.recentAlerts}
            accentColor={metrics.recentAlerts > 5 ? CHART_COLORS.danger : ACCENT}
          />
        </div>
      )}

      {/* Alerts Section */}
      <div>
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-text-bright">
          <AlertCircle className="h-4 w-4" style={{ color: ACCENT }} />
          Recent Alerts
        </h2>
        {alertsLoading ? (
          <LoadingSkeleton variant="list" />
        ) : (
          <div className="space-y-2">
            {recentAlerts.map((alert) => (
              <AlertCard key={alert.id} alert={alert} />
            ))}
          </div>
        )}
      </div>

      {/* Competitor Cards */}
      <div>
        <h2 className="mb-3 text-sm font-semibold text-text-bright">Competitors</h2>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {(competitors ?? []).map((competitor) => (
            <CompetitorCard
              key={competitor.id}
              competitor={competitor}
              onViewDetails={() => setSelectedCompetitor(competitor)}
            />
          ))}
        </div>
      </div>

      {/* Market Share Chart */}
      <ChartWrapper
        title="Market Share by Category"
        subtitle="Estimated share across product categories for all tracked competitors"
        height={360}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ left: 10, right: 20 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={CHART_THEME.gridColor}
              horizontal={false}
            />
            <XAxis
              type="number"
              tick={{ fill: CHART_THEME.axisColor, fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="category"
              width={90}
              tick={{ fill: CHART_THEME.axisColor, fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<MarketShareTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: 11 }}
              formatter={(value: string) => <span style={{ color: CHART_THEME.legendColor }}>{value}</span>}
            />
            {competitorNames.map((name, i) => (
              <Bar
                key={name}
                dataKey={name}
                stackId="share"
                fill={COMPETITOR_COLORS[i % COMPETITOR_COLORS.length]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </ChartWrapper>

      {/* Drawer */}
      <CompetitorDrawer
        competitor={selectedCompetitor}
        onClose={() => setSelectedCompetitor(null)}
      />
    </div>
  );
}
