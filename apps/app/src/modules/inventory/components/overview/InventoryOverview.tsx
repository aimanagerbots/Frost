'use client';

import { MetricCard, LoadingSkeleton } from '@/components';
import { useOverviewMetrics, usePipelineNodes, useCategoryDistribution, useActivityFeed } from '@/modules/inventory/hooks';
import { PipelineVisualization } from './PipelineVisualization';
import { CategoryDistribution } from './CategoryDistribution';
import { ActivityFeed } from './ActivityFeed';
import type { ReadinessState } from '@/modules/inventory/types';
import { ACCENT } from '@/design/colors';


interface InventoryOverviewProps {
  onStateClick?: (state: ReadinessState) => void;
}

export function InventoryOverview({ onStateClick }: InventoryOverviewProps) {
  const { data: metrics, isLoading: metricsLoading } = useOverviewMetrics();
  const { data: pipeline, isLoading: pipelineLoading } = usePipelineNodes();
  const { data: categories, isLoading: categoriesLoading } = useCategoryDistribution();
  const { data: activity, isLoading: activityLoading } = useActivityFeed();

  if (metricsLoading || pipelineLoading || categoriesLoading || activityLoading) {
    return (
      <div className="space-y-4">
        <LoadingSkeleton variant="card" count={3} />
        <LoadingSkeleton variant="chart" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Key Metrics */}
      {metrics && (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
          <MetricCard label="Total SKUs Active" value={metrics.totalSKUs} accentColor={ACCENT} trend={{ value: 8, direction: 'up' }} />
          <MetricCard label="Total Inventory Value" value={`$${(metrics.totalValue / 1000).toFixed(0)}K`} accentColor="#5BB8E6" trend={{ value: 12, direction: 'up' }} />
          <MetricCard label="Below Reorder Point" value={metrics.belowReorderPoint} accentColor={metrics.belowReorderPoint > 5 ? '#FB7185' : '#5BB8E6'} />
          <MetricCard label="COA Tests Pending" value={metrics.coaPending} accentColor="#5BB8E6" />
          <MetricCard label="Avg Days in Pipeline" value={`${metrics.avgDaysInPipeline}d`} accentColor="#5BB8E6" trend={{ value: 5, direction: 'down' }} />
          <MetricCard label="Expiring COAs (30d)" value={metrics.expiringCOAs} accentColor={metrics.expiringCOAs > 0 ? '#5BB8E6' : '#5BB8E6'} />
        </div>
      )}

      {/* Pipeline Hero */}
      {pipeline && <PipelineVisualization nodes={pipeline} onStateClick={onStateClick} />}

      {/* Category Cards + Activity Feed */}
      <div className="grid gap-5 lg:grid-cols-[1fr_400px]">
        <div className="space-y-5">
          {categories && <CategoryDistribution categories={categories} />}
        </div>
        {activity && <ActivityFeed events={activity} />}
      </div>
    </div>
  );
}
