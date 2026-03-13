'use client';

import { LoadingSkeleton } from '@/components';
import { useCRMDashboard, useAlertRules } from '@/modules/crm/hooks';
import { AIBriefingCard } from './AIBriefingCard';
import type { BriefingItem } from '@/modules/crm/types';
import { MetricsRow } from './MetricsRow';
import { ChartsSection } from './ChartsSection';
import { ActivityFeed } from './ActivityFeed';

function deduplicateBriefingItems(
  existing: BriefingItem[],
  generated: BriefingItem[]
): BriefingItem[] {
  const existingMessages = new Set(
    existing.map((item) => item.message.toLowerCase().slice(0, 60))
  );
  const unique = generated.filter(
    (item) => !existingMessages.has(item.message.toLowerCase().slice(0, 60))
  );
  return [...existing, ...unique];
}

export function CRMDashboard() {
  const { data, isLoading } = useCRMDashboard();
  const { data: alertRulesData } = useAlertRules();

  if (isLoading || !data) {
    return (
      <div className="space-y-4">
        <LoadingSkeleton variant="card" />
        <LoadingSkeleton variant="card" count={3} />
        <LoadingSkeleton variant="chart" count={2} />
      </div>
    );
  }

  const combinedBriefingItems = alertRulesData
    ? deduplicateBriefingItems(data.briefingItems, alertRulesData.briefingItems)
    : data.briefingItems;

  return (
    <div className="space-y-6">
      <AIBriefingCard items={combinedBriefingItems} />
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
