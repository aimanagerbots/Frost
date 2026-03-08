'use client';

import { ChartWrapper, CHART_THEME, CHART_COLORS, legendFormatter } from '@/components';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import type { InteractionOrderPoint } from '@/mocks/crm-kpi-charts';

interface InteractionOrderOverlayProps {
  data: InteractionOrderPoint[];
}

export function InteractionOrderOverlay({ data }: InteractionOrderOverlayProps) {
  return (
    <ChartWrapper title="Interactions vs Orders" subtitle="12-week activity overlay">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data}>
          <CartesianGrid stroke={CHART_THEME.gridColor} strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tick={{ fill: CHART_THEME.axisColor, fontSize: 11 }}
            tickFormatter={(v: string) => v.slice(5)}
            axisLine={{ stroke: CHART_THEME.gridColor }}
            tickLine={{ stroke: CHART_THEME.gridColor }}
          />
          <YAxis
            yAxisId="left"
            tick={{ fill: CHART_THEME.axisColor, fontSize: 11 }}
            axisLine={{ stroke: CHART_THEME.gridColor }}
            tickLine={{ stroke: CHART_THEME.gridColor }}
            allowDecimals={false}
            label={{
              value: 'Interactions',
              angle: -90,
              position: 'insideLeft',
              fill: CHART_THEME.axisColor,
              fontSize: 10,
            }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={{ fill: CHART_THEME.axisColor, fontSize: 11 }}
            axisLine={{ stroke: CHART_THEME.gridColor }}
            tickLine={{ stroke: CHART_THEME.gridColor }}
            allowDecimals={false}
            label={{
              value: 'Orders',
              angle: 90,
              position: 'insideRight',
              fill: CHART_THEME.axisColor,
              fontSize: 10,
            }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: CHART_THEME.tooltipBg,
              border: `1px solid ${CHART_THEME.tooltipBorder}`,
              borderRadius: 8,
              color: CHART_THEME.tooltipText,
              fontSize: 12,
            }}
          />
          <Legend wrapperStyle={{ fontSize: 11 }} formatter={legendFormatter} />
          <Bar
            yAxisId="right"
            dataKey="orders"
            fill={CHART_COLORS.amber}
            opacity={0.6}
            radius={[3, 3, 0, 0]}
            name="Orders"
          />
          <Scatter yAxisId="left" dataKey="calls" fill={CHART_COLORS.success} name="Calls" />
          <Scatter yAxisId="left" dataKey="emails" fill={CHART_COLORS.info} name="Emails" />
          <Scatter yAxisId="left" dataKey="visits" fill={CHART_COLORS.purple} name="Visits" />
        </ComposedChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}
