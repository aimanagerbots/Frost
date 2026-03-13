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
import { ChartWrapper, CHART_THEME } from '@/components';
import { useWeeklySales } from '../hooks';

const ACCENT = '#F59E0B';

interface WeeklySalesChartProps {
  myAccountsOnly: boolean;
  currentRep: string;
}

export function WeeklySalesChart({ myAccountsOnly, currentRep }: WeeklySalesChartProps) {
  const { data, isLoading } = useWeeklySales(myAccountsOnly, currentRep);

  return (
    <ChartWrapper
      title="Weekly Sale"
      subtitle="Last 3 Months"
      loading={isLoading}
      empty={!data || data.length === 0}
      height={280}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data ?? []} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={CHART_THEME.gridColor}
            vertical={false}
          />
          <XAxis
            dataKey="week"
            tick={{ fill: CHART_THEME.axisColor, fontSize: 11 }}
            axisLine={{ stroke: CHART_THEME.gridColor }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: CHART_THEME.axisColor, fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: CHART_THEME.tooltipBg,
              border: `1px solid ${CHART_THEME.tooltipBorder}`,
              borderRadius: 8,
              color: CHART_THEME.tooltipText,
              fontSize: 12,
            }}
            formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Weekly Sale']}
            labelStyle={{ color: CHART_THEME.tooltipText }}
          />
          <Bar
            dataKey="sales"
            fill={ACCENT}
            radius={[4, 4, 0, 0]}
            name="Weekly Sale"
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}
