'use client';

import { LoadingSkeleton } from '@/components';
import { useCRMDashboard } from '@/modules/crm/hooks';
import { AIBriefingCard } from './AIBriefingCard';
import { MetricsRow } from './MetricsRow';
import { ChartsSection } from './ChartsSection';
import { ActivityFeed } from './ActivityFeed';

export function CRMDashboard() {
  const { data, isLoading } = useCRMDashboard();

  if (isLoading || !data) {
    return (
      <div className="space-y-4">
        <LoadingSkeleton variant="card" />
        <LoadingSkeleton variant="card" count={3} />
        <LoadingSkeleton variant="chart" count={2} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AIBriefingCard items={data.briefingItems} />
      <MetricsRow metrics={data.metrics} kpiMetrics={data.kpiMetrics} />
      <ChartsSection
        revenueByCategoryWeeks={data.revenueByCategoryWeeks}
        healthDistribution={data.healthDistribution}
        orderVolume={data.orderVolume}
        topAccounts={data.topAccounts}
        pipelineDistribution={data.pipelineDistribution}
        recoveryFunnel={data.recoveryFunnel}
      />
      <ActivityFeed activities={data.recentActivity} />
    </div>
  );
}
