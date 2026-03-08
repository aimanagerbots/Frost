'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { ChartWrapper } from '@/components';
import type { MovementChartData } from '../types';

interface PipelineMovementChartProps {
  data: MovementChartData[];
}

export function PipelineMovementChart({ data }: PipelineMovementChartProps) {
  return (
    <ChartWrapper title="Pipeline Movements" subtitle="Advances vs declines over the last 12 weeks">
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} barGap={2}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis
            dataKey="week"
            tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }}
            axisLine={{ stroke: 'var(--color-border)' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--color-bg-card)',
              border: '1px solid var(--color-border)',
              borderRadius: '8px',
              color: 'var(--color-text-default)',
            }}
          />
          <Bar dataKey="advances" fill="#5BB8E6" name="Advances" radius={[4, 4, 0, 0]} />
          <Bar dataKey="declines" fill="#EF4444" name="Declines" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}
