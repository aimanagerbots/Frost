import type { PipelineStatus, PipelinePhase } from '@/modules/crm/types';

export type { PipelineStatus, PipelinePhase, PipelineTransition } from '@/modules/crm/types';
export { PIPELINE_PHASE_LABELS } from '@/modules/crm/types';

export interface PipelineCellData {
  status: PipelineStatus;
  phase: PipelinePhase;
  label: string;
  accounts: { id: string; name: string; healthScore: number; thirtyDayRevenue: number }[];
  count: number;
}

export interface PipelineMetrics {
  totalActive: number;
  totalInactive: number;
  totalRecovery: number;
  recoveryRate: number;
  avgDaysToChurn: number;
  pipelineVelocity: number;
}
