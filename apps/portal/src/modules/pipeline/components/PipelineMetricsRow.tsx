'use client';

import { MetricCard } from '@/components';
import type { PipelineMetrics } from '../types';

const ACCENT = '#F59E0B';

interface PipelineMetricsRowProps {
  metrics: PipelineMetrics;
}

export function PipelineMetricsRow({ metrics }: PipelineMetricsRowProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        label="Active Accounts"
        value={metrics.totalActive}
        accentColor="#22C55E"
        trend={{ value: 3.2, direction: 'up' }}
      />
      <MetricCard
        label="Recovery Pipeline"
        value={metrics.totalRecovery}
        accentColor={ACCENT}
        trend={{ value: 1, direction: 'up' }}
      />
      <MetricCard
        label="Recovery Rate"
        value={`${metrics.recoveryRate}%`}
        accentColor="#06B6D4"
        trend={{ value: 5, direction: 'up' }}
      />
      <MetricCard
        label="Pipeline Velocity"
        value={`${metrics.pipelineVelocity}/mo`}
        accentColor="#8B5CF6"
        trend={{ value: 0, direction: 'flat' }}
      />
    </div>
  );
}
