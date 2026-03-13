'use client';

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { ChartWrapper, CHART_THEME, legendFormatter, MetricCard, LoadingSkeleton } from '@/components';
import { useMonthlySalesComparison } from '../hooks';
import { TrendingUp, DollarSign, BarChart3 } from 'lucide-react';

const ACCENT = '#06B6D4';

function formatK(v: number): string {
  return `$${Math.round(v / 1000)}K`;
}

export function MonthlySalesComparison() {
  const { data, isLoading } = useMonthlySalesComparison();

  if (isLoading || !data) {
    return <LoadingSkeleton variant="chart" />;
  }

  const ytdCurrent = data.reduce((s, r) => s + r.currentYear, 0);
  const ytdPrior = data.reduce((s, r) => s + r.priorYear, 0);
  const yoyChange = Math.round(((ytdCurrent - ytdPrior) / ytdPrior) * 1000) / 10;

  return (
    <div className="space-y-4">
      {/* Summary metrics */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <MetricCard
          label="YTD Current Year"
          value={`$${(ytdCurrent / 1000).toFixed(0)}K`}
          accentColor={ACCENT}
          icon={DollarSign}
        />
        <MetricCard
          label="YTD Prior Year"
          value={`$${(ytdPrior / 1000).toFixed(0)}K`}
          accentColor="#64748B"
          icon={BarChart3}
        />
        <MetricCard
          label="YoY Change"
          value={`${yoyChange > 0 ? '+' : ''}${yoyChange}%`}
          accentColor={yoyChange >= 0 ? '#22C55E' : '#EF4444'}
          icon={TrendingUp}
          trend={{
            value: yoyChange,
            direction: yoyChange > 0 ? 'up' : yoyChange < 0 ? 'down' : 'flat',
          }}
        />
      </div>

      {/* Chart */}
      <ChartWrapper title="Monthly Sales Comparison" subtitle="Current year vs prior year revenue">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.gridColor} />
            <XAxis
              dataKey="month"
              stroke={CHART_THEME.axisColor}
              tick={{ fill: CHART_THEME.axisColor, fontSize: 12 }}
            />
            <YAxis
              stroke={CHART_THEME.axisColor}
              tick={{ fill: CHART_THEME.axisColor, fontSize: 12 }}
              tickFormatter={formatK}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: CHART_THEME.tooltipBg,
                border: `1px solid ${CHART_THEME.tooltipBorder}`,
                borderRadius: 8,
                color: CHART_THEME.tooltipText,
              }}
              formatter={(value) => [`$${Number(value).toLocaleString()}`]}
            />
            <Legend formatter={legendFormatter} />
            <Bar dataKey="currentYear" name="2026" fill={ACCENT} radius={[4, 4, 0, 0]} />
            <Bar dataKey="priorYear" name="2025" fill="#475569" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartWrapper>
    </div>
  );
}
