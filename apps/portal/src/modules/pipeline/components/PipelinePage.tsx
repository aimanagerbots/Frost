'use client';

import { GitBranch } from 'lucide-react';
import { SectionHeader, LoadingSkeleton, ErrorState, EmptyState } from '@/components';
import { usePipelineData } from '../hooks/usePipelineData';
import { PipelineMetricsRow } from './PipelineMetricsRow';
import { PipelineFunnel } from './PipelineFunnel';
import { PipelineTransitionLog } from './PipelineTransitionLog';

const ACCENT = '#F59E0B';

export function PipelinePage() {
  const { data, isLoading, error, refetch } = usePipelineData();

  if (isLoading || (!data && !error)) {
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

  if (error) {
    return (
      <ErrorState
        title="Failed to load pipeline data"
        message={error.message}
        onRetry={refetch}
      />
    );
  }

  if (!data || (!data.cells?.length && !data.recentTransitions?.length)) {
    return (
      <div className="space-y-6">
        <SectionHeader
          icon={GitBranch}
          title="Pipeline"
          subtitle="A/I/R account pipeline — Active, Inactive & Recovery tracking"
          accentColor={ACCENT}
        />
        <EmptyState
          icon={GitBranch}
          title="No pipeline data"
          description="No accounts are in the pipeline yet. Data will appear as accounts are tracked through the A/I/R stages."
          accentColor={ACCENT}
        />
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
