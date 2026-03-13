'use client';

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { DollarSign, ShoppingCart, TrendingUp, Calendar } from 'lucide-react';
import { ChartWrapper, CHART_THEME, MetricCard, LoadingSkeleton } from '@/components';
import { useMonthlySales } from '../hooks';

const BAR_COLOR = '#F59E0B';
const ACCENT = '#06B6D4';

function fmt(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toLocaleString()}`;
}

export function MonthlySalesChart() {
  const { data, isLoading } = useMonthlySales();

  if (isLoading || !data) {
    return <LoadingSkeleton variant="chart" />;
  }

  const totalRevenue = data.reduce((s, d) => s + d.revenue, 0);
  const avgMonthly = Math.round(totalRevenue / data.length);
  const bestMonth = data.reduce((best, d) => (d.revenue > best.revenue ? d : best), data[0]);
  const totalOrders = data.reduce((s, d) => s + d.orderCount, 0);

  return (
    <div className="space-y-4">
      {/* Summary metrics */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <MetricCard
          label="Total Revenue"
          value={fmt(totalRevenue)}
          accentColor={ACCENT}
          icon={DollarSign}
        />
        <MetricCard
          label="Avg Monthly"
          value={fmt(avgMonthly)}
          accentColor={ACCENT}
          icon={TrendingUp}
        />
        <MetricCard
          label="Best Month"
          value={bestMonth.month}
          subValue={fmt(bestMonth.revenue)}
          accentColor={BAR_COLOR}
          icon={Calendar}
        />
        <MetricCard
          label="Total Orders"
          value={totalOrders.toLocaleString()}
          accentColor={ACCENT}
          icon={ShoppingCart}
        />
      </div>

      {/* Bar chart */}
      <ChartWrapper
        title="Monthly Sales (12 Months)"
        subtitle="Revenue by month, April 2025 - March 2026"
        height={360}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 16, left: 8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.gridColor} />
            <XAxis
              dataKey="month"
              tick={{ fill: CHART_THEME.axisColor, fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: CHART_THEME.gridColor }}
            />
            <YAxis
              tickFormatter={(v: number) => fmt(v)}
              tick={{ fill: CHART_THEME.axisColor, fontSize: 11 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: CHART_THEME.tooltipBg,
                border: `1px solid ${CHART_THEME.tooltipBorder}`,
                borderRadius: 8,
                color: CHART_THEME.tooltipText,
                fontSize: 12,
              }}
              formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Revenue']}
              labelStyle={{ color: CHART_THEME.tooltipText, fontWeight: 600 }}
            />
            <Bar
              dataKey="revenue"
              fill={BAR_COLOR}
              radius={[4, 4, 0, 0]}
              maxBarSize={48}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartWrapper>
    </div>
  );
}
