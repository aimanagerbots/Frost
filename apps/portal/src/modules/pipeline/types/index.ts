import type { PipelineStatus, PipelinePhase } from '@/modules/crm/types';

export type { PipelineStatus, PipelinePhase, PipelineTransition, PipelineInfo } from '@/modules/crm/types';
export { PIPELINE_PHASE_LABELS } from '@/modules/crm/types';

export interface PipelineCellData {
  status: PipelineStatus;
  phase: PipelinePhase;
  label: string;
  accounts: { id: string; name: string; healthScore: number; thirtyDayRevenue: number }[];
  count: number;
  totalRevenue: number;
}

export interface PipelineMetrics {
  totalActive: number;
  totalInactive: number;
  totalRecovery: number;
  totalAccounts: number;
  activeRevenue: number;
  recoveryRate: number;
  avgDaysToChurn: number;
  pipelineVelocity: number;
}

export interface PipelineMovement {
  id: string;
  accountId: string;
  accountName: string;
  fromCode: string;
  toCode: string;
  date: string;
  reason: string;
  repId: string;
  repName: string;
  direction: 'advance' | 'decline' | 'lateral';
}

export interface PipelineVelocityMetric {
  label: string;
  value: string | number;
  trend: { value: number; direction: 'up' | 'down' | 'flat' };
  description: string;
}

export interface RepPipelineStats {
  repId: string;
  repName: string;
  avatarUrl: string | null;
  totalAccounts: number;
  activeCount: number;
  inactiveCount: number;
  recoveryCount: number;
  advancesThisMonth: number;
  declinesThisMonth: number;
  topProspect?: { name: string; revenue: number };
  topAtRisk?: { name: string; revenue: number };
}

export interface MovementChartData {
  week: string;
  advances: number;
  declines: number;
}
