'use client';

import { useState } from 'react';
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

function formatTime(timestamp: string): string {
  const d = new Date(timestamp);
  const h = d.getHours();
  const m = d.getMinutes();
  const suffix = h >= 12 ? 'pm' : 'am';
  const display = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return m === 0 ? `${display}${suffix}` : `${display}:${String(m).padStart(2, '0')}`;
}

const METRIC_CONFIG = {
  temperature: { label: 'Temperature', color: CHART_COLORS.danger, unit: 'F', yAxisId: 'temp' },
  humidity: { label: 'Humidity', color: CHART_COLORS.info, unit: '%', yAxisId: 'rh' },
  co2: { label: 'CO2', color: '#A855F7', unit: 'ppm', yAxisId: 'co2' },
  vpd: { label: 'VPD', color: '#5BB8E6', unit: 'kPa', yAxisId: 'vpd' },
  ppfd: { label: 'PPFD', color: '#5BB8E6', unit: 'umol', yAxisId: 'ppfd' },
} as const;

type MetricKey = keyof typeof METRIC_CONFIG;

interface EnvironmentChartProps {
  data: EnvironmentReading[];
  roomName: string;
}

export function EnvironmentChart({ data, roomName }: EnvironmentChartProps) {
  const [activeMetrics, setActiveMetrics] = useState<Set<MetricKey>>(
    new Set(['temperature', 'humidity'])
  );

  const toggleMetric = (metric: MetricKey) => {
    setActiveMetrics((prev) => {
      const next = new Set(prev);
      if (next.has(metric)) {
        if (next.size > 1) next.delete(metric);
      } else {
        next.add(metric);
      }
      return next;
    });
  };

  // Sample every 4th point to avoid crowding (96 → 24 labels)
  const chartData = data.map((r, i) => ({
    time: i % 4 === 0 ? formatTime(r.timestamp) : '',
    rawTime: formatTime(r.timestamp),
    temperature: r.temperature,
    humidity: r.humidity,
    co2: r.co2,
    vpd: r.vpd,
    ppfd: r.ppfd,
  }));

  return (
    <div>
      {/* Toggle buttons */}
      <div className="flex flex-wrap gap-2 mb-3">
        {(Object.keys(METRIC_CONFIG) as MetricKey[]).map((key) => {
          const cfg = METRIC_CONFIG[key];
          const isActive = activeMetrics.has(key);
          return (
            <button
              key={key}
              onClick={() => toggleMetric(key)}
              className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors border"
              style={{
                borderColor: isActive ? cfg.color : 'transparent',
                backgroundColor: isActive ? `${cfg.color}15` : 'rgba(255,255,255,0.05)',
                color: isActive ? cfg.color : 'rgba(255,255,255,0.5)',
              }}
            >
              <div
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: isActive ? cfg.color : 'rgba(255,255,255,0.2)' }}
              />
              {cfg.label}
            </button>
          );
        })}
      </div>

      <ChartWrapper
        title="24-Hour Environment"
        subtitle={`Environment trends for ${roomName}`}
        empty={chartData.length === 0}
        emptyMessage="No environment history available"
        height={300}
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
              tick={{ fill: CHART_THEME.axisColor, fontSize: 10 }}
              axisLine={{ stroke: CHART_THEME.gridColor }}
              tickLine={false}
              interval={0}
            />

            {activeMetrics.has('temperature') && (
              <YAxis
                yAxisId="temp"
                orientation="left"
                domain={['dataMin - 5', 'dataMax + 5']}
                tick={{ fill: METRIC_CONFIG.temperature.color, fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                width={35}
              />
            )}
            {activeMetrics.has('humidity') && (
              <YAxis
                yAxisId="rh"
                orientation="right"
                domain={[0, 100]}
                tick={{ fill: METRIC_CONFIG.humidity.color, fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                width={35}
              />
            )}
            {activeMetrics.has('co2') && !activeMetrics.has('temperature') && (
              <YAxis
                yAxisId="co2"
                orientation="left"
                domain={['dataMin - 100', 'dataMax + 100']}
                tick={{ fill: METRIC_CONFIG.co2.color, fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                width={45}
              />
            )}
            {activeMetrics.has('vpd') && !activeMetrics.has('humidity') && (
              <YAxis
                yAxisId="vpd"
                orientation="right"
                domain={[0, 2]}
                tick={{ fill: METRIC_CONFIG.vpd.color, fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                width={35}
              />
            )}

            <Tooltip
              contentStyle={{
                backgroundColor: CHART_THEME.tooltipBg,
                border: `1px solid ${CHART_THEME.tooltipBorder}`,
                borderRadius: 8,
                color: CHART_THEME.tooltipText,
                fontSize: 12,
              }}
              labelStyle={{ color: CHART_THEME.tooltipText }}
              labelFormatter={(_, payload) => {
                if (payload?.[0]?.payload?.rawTime) return payload[0].payload.rawTime;
                return '';
              }}
            />

            {activeMetrics.has('temperature') && (
              <Line
                yAxisId="temp"
                type="monotone"
                dataKey="temperature"
                name="Temp (F)"
                stroke={METRIC_CONFIG.temperature.color}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 3 }}
              />
            )}
            {activeMetrics.has('humidity') && (
              <Line
                yAxisId="rh"
                type="monotone"
                dataKey="humidity"
                name="Humidity (%)"
                stroke={METRIC_CONFIG.humidity.color}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 3 }}
              />
            )}
            {activeMetrics.has('co2') && (
              <Line
                yAxisId={activeMetrics.has('temperature') ? 'temp' : 'co2'}
                type="monotone"
                dataKey="co2"
                name="CO2 (ppm)"
                stroke={METRIC_CONFIG.co2.color}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 3 }}
              />
            )}
            {activeMetrics.has('vpd') && (
              <Line
                yAxisId={activeMetrics.has('humidity') ? 'rh' : 'vpd'}
                type="monotone"
                dataKey="vpd"
                name="VPD (kPa)"
                stroke={METRIC_CONFIG.vpd.color}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 3 }}
              />
            )}
            {activeMetrics.has('ppfd') && (
              <Line
                yAxisId={activeMetrics.has('temperature') ? 'temp' : activeMetrics.has('co2') ? 'co2' : 'temp'}
                type="monotone"
                dataKey="ppfd"
                name="PPFD (umol)"
                stroke={METRIC_CONFIG.ppfd.color}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 3 }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </ChartWrapper>
    </div>
  );
}
