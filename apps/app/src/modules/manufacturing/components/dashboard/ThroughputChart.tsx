'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { ChartWrapper, CHART_THEME } from '@/components';
import { useThroughputHistory } from '../../hooks';

const ACCENT = '#10B981';

export function ThroughputChart() {
  const { data, isLoading } = useThroughputHistory();

  return (
    <ChartWrapper title="Throughput Trend" subtitle="Units produced per day (30 days)" loading={isLoading} empty={!data?.length} height={280}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.gridColor} />
          <XAxis
            dataKey="date"
            tick={{ fill: CHART_THEME.axisColor, fontSize: 10 }}
            tickFormatter={(v: string) => v.slice(5)}
            interval="preserveStartEnd"
          />
          <YAxis tick={{ fill: CHART_THEME.axisColor, fontSize: 10 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: CHART_THEME.tooltipBg,
              border: `1px solid ${CHART_THEME.tooltipBorder}`,
              borderRadius: 8,
              color: CHART_THEME.tooltipText,
              fontSize: 12,
            }}
          />
          <Line
            type="monotone"
            dataKey="target"
            stroke="#64748B"
            strokeDasharray="6 3"
            dot={false}
            strokeWidth={1.5}
            name="Target"
          />
          <Line
            type="monotone"
            dataKey="units"
            stroke={ACCENT}
            dot={false}
            strokeWidth={2}
            name="Produced"
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}
