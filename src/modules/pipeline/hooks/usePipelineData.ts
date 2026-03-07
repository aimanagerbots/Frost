'use client';

import { useQuery } from '@tanstack/react-query';
import { accounts } from '@/mocks/crm';
import { PIPELINE_PHASE_LABELS } from '@/modules/crm/types';
import type { PipelineCellData, PipelineMetrics, PipelineStatus, PipelinePhase, PipelineTransition } from '../types';

interface RecentTransition {
  accountId: string;
  accountName: string;
  transition: PipelineTransition;
}

function buildPipelineData() {
  const statuses: PipelineStatus[] = ['active', 'inactive', 'recovery'];
  const phases: PipelinePhase[] = [1, 2, 3, 4, 5];

  // Build 15-cell grid
  const cells: PipelineCellData[] = [];
  for (const status of statuses) {
    for (const phase of phases) {
      const matching = accounts.filter(
        (a) => a.pipelineStatus === status && a.pipelinePhase === phase
      );
      cells.push({
        status,
        phase,
        label: PIPELINE_PHASE_LABELS[status][phase],
        accounts: matching.map((a) => ({
          id: a.id,
          name: a.name,
          healthScore: a.healthScore,
          thirtyDayRevenue: a.thirtyDayRevenue,
        })),
        count: matching.length,
      });
    }
  }

  // Compute metrics
  const totalActive = accounts.filter((a) => a.pipelineStatus === 'active').length;
  const totalInactive = accounts.filter((a) => a.pipelineStatus === 'inactive').length;
  const totalRecovery = accounts.filter((a) => a.pipelineStatus === 'recovery').length;

  // Recovery rate: accounts that graduated (recovery phase 5) / total that entered recovery
  const recoveryAccounts = accounts.filter((a) => a.pipelineStatus === 'recovery');
  const graduatedCount = recoveryAccounts.filter((a) => a.pipelinePhase === 5).length;
  const recoveryRate = recoveryAccounts.length > 0
    ? Math.round((graduatedCount / recoveryAccounts.length) * 100)
    : 0;

  // Pipeline velocity: avg accounts moving through phases per month (simulated)
  const pipelineVelocity = 4.2;

  // Avg days to churn (simulated)
  const avgDaysToChurn = 67;

  const metrics: PipelineMetrics = {
    totalActive,
    totalInactive,
    totalRecovery,
    recoveryRate,
    avgDaysToChurn,
    pipelineVelocity,
  };

  // Collect recent transitions across all accounts
  const recentTransitions: RecentTransition[] = [];
  for (const account of accounts) {
    for (const transition of account.pipelineHistory) {
      recentTransitions.push({
        accountId: account.id,
        accountName: account.name,
        transition,
      });
    }
  }

  // Sort by date descending, take last 10
  recentTransitions.sort(
    (a, b) => new Date(b.transition.date).getTime() - new Date(a.transition.date).getTime()
  );

  return {
    cells,
    metrics,
    recentTransitions: recentTransitions.slice(0, 10),
  };
}

export function usePipelineData() {
  return useQuery({
    queryKey: ['pipeline', 'grid'],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return buildPipelineData();
    },
  });
}
