'use client';

import { PIPELINE_PHASE_LABELS } from '@/modules/crm/types';
import { PipelineAccountCard } from './PipelineAccountCard';
import type { PipelineCellData, PipelineStatus, PipelinePhase } from '../types';

interface PipelineFunnelProps {
  cells: PipelineCellData[];
}

const STATUS_CONFIG: Record<PipelineStatus, { label: string; borderColor: string; bgColor: string }> = {
  active: { label: 'Active', borderColor: '#22C55E', bgColor: 'rgba(34, 197, 94, 0.08)' },
  inactive: { label: 'Inactive', borderColor: '#EF4444', bgColor: 'rgba(239, 68, 68, 0.08)' },
  recovery: { label: 'Recovery', borderColor: '#F59E0B', bgColor: 'rgba(245, 158, 11, 0.08)' },
};

const STATUSES: PipelineStatus[] = ['active', 'inactive', 'recovery'];
const PHASES: PipelinePhase[] = [1, 2, 3, 4, 5];

export function PipelineFunnel({ cells }: PipelineFunnelProps) {
  function getCell(status: PipelineStatus, phase: PipelinePhase): PipelineCellData | undefined {
    return cells.find((c) => c.status === status && c.phase === phase);
  }

  return (
    <div className="rounded-xl border border-default bg-card p-4 md:p-6">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-text-muted">
        A/I/R Pipeline Matrix
      </h2>

      {/* Column headers */}
      <div className="mb-2 grid grid-cols-[100px_repeat(5,1fr)] gap-2">
        <div /> {/* Empty top-left corner */}
        {PHASES.map((phase) => (
          <div key={phase} className="text-center">
            <div className="text-xs font-bold text-text-bright">Phase {phase}</div>
            <div className="text-[10px] text-text-muted">
              {PIPELINE_PHASE_LABELS.active[phase]}
            </div>
          </div>
        ))}
      </div>

      {/* Grid rows */}
      <div className="space-y-2">
        {STATUSES.map((status) => {
          const config = STATUS_CONFIG[status];
          return (
            <div key={status} className="grid grid-cols-[100px_repeat(5,1fr)] gap-2">
              {/* Row label */}
              <div
                className="flex items-center rounded-lg px-3 py-2 text-xs font-semibold"
                style={{
                  borderLeft: `3px solid ${config.borderColor}`,
                  backgroundColor: config.bgColor,
                  color: config.borderColor,
                }}
              >
                {config.label}
              </div>

              {/* Cells */}
              {PHASES.map((phase) => {
                const cell = getCell(status, phase);
                const count = cell?.count ?? 0;
                const accts = cell?.accounts ?? [];
                const shown = accts.slice(0, 3);
                const remaining = count - shown.length;

                return (
                  <div
                    key={`${status}-${phase}`}
                    className="group relative flex min-h-[100px] flex-col rounded-lg border border-default bg-elevated/50 p-2 transition-colors hover:bg-elevated"
                  >
                    {/* Count badge */}
                    <div className="mb-1.5 flex items-center justify-between">
                      <span className="text-[10px] text-text-muted md:hidden">
                        {PIPELINE_PHASE_LABELS[status][phase]}
                      </span>
                      <span
                        className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-bold"
                        style={{
                          backgroundColor: count > 0 ? `${config.borderColor}20` : 'transparent',
                          color: count > 0 ? config.borderColor : 'var(--color-text-muted)',
                        }}
                      >
                        {count}
                      </span>
                    </div>

                    {/* Account cards */}
                    <div className="flex flex-1 flex-col gap-1">
                      {shown.map((acct) => (
                        <PipelineAccountCard
                          key={acct.id}
                          name={acct.name}
                          healthScore={acct.healthScore}
                          thirtyDayRevenue={acct.thirtyDayRevenue}
                        />
                      ))}
                      {count === 0 && (
                        <div className="flex flex-1 items-center justify-center text-[10px] text-text-muted">
                          --
                        </div>
                      )}
                      {remaining > 0 && (
                        <div className="text-center text-[10px] text-text-muted">
                          +{remaining} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
