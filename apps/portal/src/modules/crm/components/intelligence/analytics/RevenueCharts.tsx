'use client';

import { ChartWrapper, CHART_THEME, CHART_COLORS } from '@/components';
import type { RevenueAnalytics } from '../../../types';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts';

const CATEGORY_COLORS: Record<string, string> = {
  flower: CHART_COLORS.flower,
  preroll: CHART_COLORS.preroll,
  vaporizer: CHART_COLORS.vaporizer,
  concentrate: CHART_COLORS.concentrate,
  edible: CHART_COLORS.edible,
  beverage: CHART_COLORS.beverage,
};

interface RevenueChartsProps {
  analytics: RevenueAnalytics;
}

export function RevenueCharts({ analytics }: RevenueChartsProps) {
  const monthData = analytics.monthlyRevenue.map((m) => ({
    ...m,
    month: new Date(m.month + '-01').toLocaleDateString('en-US', { month: 'short' }),
  }));

  const repData = analytics.revenueByRep.map((r) => ({
    ...r,
    name: r.name.split(' ')[0], // First name only for chart
  }));

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Revenue by Category — Stacked Bar */}
      <ChartWrapper title="Revenue by Category" subtitle="12-month trend">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthData}>
            <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.gridColor} />
            <XAxis dataKey="month" tick={{ fill: CHART_THEME.axisColor, fontSize: 11 }} axisLine={{ stroke: CHART_THEME.gridColor }} />
            <YAxis tick={{ fill: CHART_THEME.axisColor, fontSize: 11 }} axisLine={{ stroke: CHART_THEME.gridColor }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
            <Tooltip
              contentStyle={{ backgroundColor: CHART_THEME.tooltipBg, border: `1px solid ${CHART_THEME.tooltipBorder}`, color: CHART_THEME.tooltipText, borderRadius: 8 }}
              formatter={(value) => [`$${Number(value).toLocaleString()}`, '']}
            />
            <Legend wrapperStyle={{ fontSize: 11 }} formatter={(value: string) => <span style={{ color: CHART_THEME.legendColor }}>{value}</span>} />
            {Object.entries(CATEGORY_COLORS).map(([cat, color]) => (
              <Bar key={cat} dataKey={cat} stackId="revenue" fill={color} radius={cat === 'beverage' ? [2, 2, 0, 0] : undefined} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </ChartWrapper>

      {/* Revenue by Rep — Horizontal Bar with target */}
      <ChartWrapper title="Revenue by Rep" subtitle="Actual vs target">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={repData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.gridColor} />
            <XAxis type="number" tick={{ fill: CHART_THEME.axisColor, fontSize: 11 }} axisLine={{ stroke: CHART_THEME.gridColor }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
            <YAxis type="category" dataKey="name" tick={{ fill: CHART_THEME.axisColor, fontSize: 12 }} axisLine={{ stroke: CHART_THEME.gridColor }} width={60} />
            <Tooltip
              contentStyle={{ backgroundColor: CHART_THEME.tooltipBg, border: `1px solid ${CHART_THEME.tooltipBorder}`, color: CHART_THEME.tooltipText, borderRadius: 8 }}
              formatter={(value) => [`$${Number(value).toLocaleString()}`, '']}
            />
            <Legend wrapperStyle={{ fontSize: 11 }} formatter={(value: string) => <span style={{ color: CHART_THEME.legendColor }}>{value}</span>} />
            <Bar dataKey="revenue" fill={CHART_COLORS.primary} name="Revenue" radius={[0, 4, 4, 0]} />
            <Bar dataKey="target" fill={CHART_COLORS.warning} name="Target" radius={[0, 4, 4, 0]} opacity={0.3} />
          </BarChart>
        </ResponsiveContainer>
      </ChartWrapper>
    </div>
  );
}
