'use client';

import { MetricCard } from '@/components';
import type { PipelineVelocityMetric } from '../types';

const ACCENT_COLORS = ['#3B82F6', '#06B6D4', '#8B5CF6', '#22C55E', '#F59E0B'];

interface PipelineVelocityMetricsProps {
  metrics: PipelineVelocityMetric[];
}

export function PipelineVelocityMetrics({ metrics }: PipelineVelocityMetricsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {metrics.map((m, i) => (
        <MetricCard
          key={m.label}
          label={m.label}
          value={m.value}
          accentColor={ACCENT_COLORS[i % ACCENT_COLORS.length]}
          trend={{
            value: m.trend.value,
            direction: m.trend.direction,
          }}
        />
      ))}
    </div>
  );
}
