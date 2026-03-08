'use client';

import { useState } from 'react';
import { GitBranch } from 'lucide-react';
import { SectionHeader, LoadingSkeleton, ErrorState, EmptyState } from '@/components';
import { usePipelineData } from '../hooks/usePipelineData';
import { usePipelineVelocity } from '../hooks/usePipelineVelocity';
import { useRepPipelinePerformance } from '../hooks/useRepPipelinePerformance';
import { useMovementChartData } from '../hooks/useMovementChartData';
import { PipelineVelocityMetrics } from './PipelineVelocityMetrics';
import { PipelineMatrix } from './PipelineMatrix';
import { AccountListPanel } from './AccountListPanel';
import { PipelineMovementChart } from './PipelineMovementChart';
import { RepPerformanceCards } from './RepPerformanceCards';
import { PipelineTransitionLog } from './PipelineTransitionLog';
import type { PipelineStatus, PipelinePhase } from '../types';

const ACCENT = '#F59E0B';

export function PipelinePage() {
  const [selectedCell, setSelectedCell] = useState<{ status: PipelineStatus; phase: PipelinePhase } | null>(null);

  const { data, isLoading, error, refetch } = usePipelineData();
  const { data: velocityMetrics, isLoading: velocityLoading } = usePipelineVelocity();
  const { data: repStats, isLoading: repLoading } = useRepPipelinePerformance();
  const { data: movementData, isLoading: movementLoading } = useMovementChartData();

  const anyLoading = isLoading || velocityLoading || repLoading || movementLoading;

  if (anyLoading && !data) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton variant="card" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
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

  const selectedCellData = selectedCell
    ? data.cells.find((c) => c.status === selectedCell.status && c.phase === selectedCell.phase)
    : null;

  function handleCellClick(status: PipelineStatus, phase: PipelinePhase) {
    if (selectedCell?.status === status && selectedCell?.phase === phase) {
      setSelectedCell(null);
    } else {
      setSelectedCell({ status, phase });
    }
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

      {/* Velocity Metrics */}
      {velocityMetrics && (
        <PipelineVelocityMetrics metrics={velocityMetrics} />
      )}

      {/* Pipeline Matrix */}
      <PipelineMatrix
        cells={data.cells}
        selectedCell={selectedCell}
        onCellClick={handleCellClick}
      />

      {/* Account List Panel (appears when cell is clicked) */}
      {selectedCell && selectedCellData && (
        <AccountListPanel
          status={selectedCell.status}
          phase={selectedCell.phase}
          cell={selectedCellData}
          onClose={() => setSelectedCell(null)}
        />
      )}

      {/* Movement Chart */}
      {movementData && (
        <PipelineMovementChart data={movementData} />
      )}

      {/* Rep Performance Cards */}
      {repStats && (
        <RepPerformanceCards stats={repStats} />
      )}

      {/* Recent Transitions */}
      <PipelineTransitionLog transitions={data.recentTransitions} />
    </div>
  );
}
