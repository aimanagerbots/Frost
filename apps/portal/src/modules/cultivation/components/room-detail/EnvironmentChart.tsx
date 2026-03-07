'use client';

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { ChartWrapper, CHART_THEME, CHART_COLORS } from '@/components';
import type { EnvironmentReading } from '../../types';

function formatHour(timestamp: string): string {
  const d = new Date(timestamp);
  const h = d.getHours();
  const suffix = h >= 12 ? 'pm' : 'am';
  const display = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${display}${suffix}`;
}

interface EnvironmentChartProps {
  data: EnvironmentReading[];
  roomName: string;
}

export function EnvironmentChart({ data, roomName }: EnvironmentChartProps) {
  const chartData = data.map((r) => ({
    time: formatHour(r.timestamp),
    temperature: r.temperature,
    humidity: r.humidity,
  }));

  return (
    <ChartWrapper
      title="24-Hour Environment"
      subtitle={`Temperature & humidity for ${roomName}`}
      empty={chartData.length === 0}
      emptyMessage="No environment history available"
      height={280}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: -8 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={CHART_THEME.gridColor}
            vertical={false}
          />
          <XAxis
            dataKey="time"
            tick={{ fill: CHART_THEME.axisColor, fontSize: 11 }}
            axisLine={{ stroke: CHART_THEME.gridColor }}
            tickLine={false}
          />
          <YAxis
            yAxisId="temp"
            orientation="left"
            domain={['dataMin - 5', 'dataMax + 5']}
            tick={{ fill: CHART_COLORS.danger, fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            label={{
              value: '°F',
              position: 'insideTopLeft',
              offset: 8,
              fill: CHART_COLORS.danger,
              fontSize: 11,
            }}
          />
          <YAxis
            yAxisId="rh"
            orientation="right"
            domain={[0, 100]}
            tick={{ fill: CHART_COLORS.info, fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            label={{
              value: '%RH',
              position: 'insideTopRight',
              offset: 8,
              fill: CHART_COLORS.info,
              fontSize: 11,
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
            labelStyle={{ color: CHART_THEME.tooltipText }}
          />
          <Line
            yAxisId="temp"
            type="monotone"
            dataKey="temperature"
            name="Temperature (°F)"
            stroke={CHART_COLORS.danger}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: CHART_COLORS.danger }}
          />
          <Line
            yAxisId="rh"
            type="monotone"
            dataKey="humidity"
            name="Humidity (%)"
            stroke={CHART_COLORS.info}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: CHART_COLORS.info }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}
