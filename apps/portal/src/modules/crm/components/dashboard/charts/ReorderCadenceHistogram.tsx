'use client';

import { ChartWrapper, CHART_THEME } from '@/components';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';
import type { ReorderCadenceBucket } from '@/mocks/crm-kpi-charts';

interface ReorderCadenceHistogramProps {
  data: ReorderCadenceBucket[];
}

export function ReorderCadenceHistogram({ data }: ReorderCadenceHistogramProps) {
  return (
    <ChartWrapper title="Reorder Cadence" subtitle="Days since last order by account count">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid stroke={CHART_THEME.gridColor} strokeDasharray="3 3" />
          <XAxis
            dataKey="label"
            tick={{ fill: CHART_THEME.axisColor, fontSize: 11 }}
            axisLine={{ stroke: CHART_THEME.gridColor }}
            tickLine={{ stroke: CHART_THEME.gridColor }}
          />
          <YAxis
            tick={{ fill: CHART_THEME.axisColor, fontSize: 11 }}
            axisLine={{ stroke: CHART_THEME.gridColor }}
            tickLine={{ stroke: CHART_THEME.gridColor }}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: CHART_THEME.tooltipBg,
              border: `1px solid ${CHART_THEME.tooltipBorder}`,
              borderRadius: 8,
              color: CHART_THEME.tooltipText,
              fontSize: 12,
            }}
            formatter={(value: number) => [`${value} accounts`, 'Count']}
          />
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}
