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
        totalRevenue: matching.reduce((sum, a) => sum + a.thirtyDayRevenue, 0),
      });
    }
  }

  const totalActive = accounts.filter((a) => a.pipelineStatus === 'active').length;
  const totalInactive = accounts.filter((a) => a.pipelineStatus === 'inactive').length;
  const totalRecovery = accounts.filter((a) => a.pipelineStatus === 'recovery').length;

  const activeAccounts = accounts.filter((a) => a.pipelineStatus === 'active');
  const activeRevenue = activeAccounts.reduce((sum, a) => sum + a.thirtyDayRevenue, 0);

  const recoveryAccounts = accounts.filter((a) => a.pipelineStatus === 'recovery');
  const recoveredCount = recoveryAccounts.filter((a) => a.pipelinePhase === 5).length;
  const recoveryRate = recoveryAccounts.length > 0
    ? Math.round((recoveredCount / recoveryAccounts.length) * 100)
    : 0;

  const metrics: PipelineMetrics = {
    totalActive,
    totalInactive,
    totalRecovery,
    totalAccounts: accounts.length,
    activeRevenue,
    recoveryRate,
    avgDaysToChurn: 67,
    pipelineVelocity: 4.2,
  };

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
