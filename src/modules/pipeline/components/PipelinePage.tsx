'use client';

import { GitBranch } from 'lucide-react';
import { SectionHeader, LoadingSkeleton } from '@/components';
import { usePipelineData } from '../hooks/usePipelineData';
import { PipelineMetricsRow } from './PipelineMetricsRow';
import { PipelineFunnel } from './PipelineFunnel';
import { PipelineTransitionLog } from './PipelineTransitionLog';

const ACCENT = '#F59E0B';

export function PipelinePage() {
  const { data, isLoading } = usePipelineData();

  if (isLoading || !data) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton variant="card" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <LoadingSkeleton key={i} variant="card" />
          ))}
        </div>
        <LoadingSkeleton variant="card" className="h-[400px]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={GitBranch}
        title="Pipeline"
        subtitle="A/I/R account pipeline — Active, Inactive & Recovery tracking"
        accentColor={ACCENT}
        stats={[
          { label: 'Active', value: data.metrics.totalActive },
          { label: 'Inactive', value: data.metrics.totalInactive },
          { label: 'Recovery', value: data.metrics.totalRecovery },
        ]}
      />

      <PipelineMetricsRow metrics={data.metrics} />

      <PipelineFunnel cells={data.cells} />

      <PipelineTransitionLog transitions={data.recentTransitions} />
    </div>
  );
}
