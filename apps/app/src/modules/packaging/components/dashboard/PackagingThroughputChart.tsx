'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { ChartWrapper, CHART_THEME } from '@/components';
import { usePackagingThroughput } from '../../hooks';

const ACCENT = '#84CC16';

export function PackagingThroughputChart() {
  const { data, isLoading } = usePackagingThroughput();

  return (
    <ChartWrapper
      title="Packaging Throughput"
      subtitle="Packages produced per day (7 days)"
      loading={isLoading}
      empty={!data?.length}
      height={280}
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="packagingThroughputGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={ACCENT} stopOpacity={0.25} />
              <stop offset="95%" stopColor={ACCENT} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="packagingTargetGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#5BB8E6" stopOpacity={0.12} />
              <stop offset="95%" stopColor="#5BB8E6" stopOpacity={0} />
            </linearGradient>
          </defs>
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
          <Area
            type="monotone"
            dataKey="target"
            stroke="#5BB8E6"
            strokeDasharray="6 3"
            strokeWidth={1.5}
            fill="url(#packagingTargetGradient)"
            dot={false}
            name="Target"
          />
          <Area
            type="monotone"
            dataKey="units"
            stroke={ACCENT}
            strokeWidth={2}
            fill="url(#packagingThroughputGradient)"
            dot={false}
            name="Packaged"
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}
