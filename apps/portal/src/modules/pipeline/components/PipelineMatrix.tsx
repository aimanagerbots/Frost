'use client';

import { PIPELINE_PHASE_LABELS } from '@/modules/crm/types';
import { PipelineMatrixCell } from './PipelineMatrixCell';
import type { PipelineCellData, PipelineStatus, PipelinePhase } from '../types';

interface PipelineMatrixProps {
  cells: PipelineCellData[];
  selectedCell: { status: PipelineStatus; phase: PipelinePhase } | null;
  onCellClick: (status: PipelineStatus, phase: PipelinePhase) => void;
}

const STATUS_CONFIG: Record<PipelineStatus, { label: string; borderColor: string; bgColor: string }> = {
  active: { label: 'Active', borderColor: '#22C55E', bgColor: 'rgba(34, 197, 94, 0.08)' },
  inactive: { label: 'Inactive', borderColor: '#3B82F6', bgColor: 'rgba(59, 130, 246, 0.08)' },
  recovery: { label: 'Recovery', borderColor: '#EF4444', bgColor: 'rgba(239, 68, 68, 0.08)' },
};

const STATUSES: PipelineStatus[] = ['active', 'inactive', 'recovery'];
const PHASES: PipelinePhase[] = [1, 2, 3, 4, 5];

export function PipelineMatrix({ cells, selectedCell, onCellClick }: PipelineMatrixProps) {
  function getCell(status: PipelineStatus, phase: PipelinePhase): PipelineCellData | undefined {
    return cells.find((c) => c.status === status && c.phase === phase);
  }

  return (
    <div className="rounded-xl border border-default bg-card p-4 md:p-6">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-text-muted">
        A/I/R Pipeline Matrix
      </h2>

      {/* Column headers */}
      <div className="mb-2 hidden grid-cols-[100px_repeat(5,1fr)] gap-2 md:grid">
        <div />
        {PHASES.map((phase) => (
          <div key={phase} className="text-center">
            <div className="text-xs font-bold text-text-bright">Phase {phase}</div>
          </div>
        ))}
      </div>

      {/* Grid rows */}
      <div className="space-y-2">
        {STATUSES.map((status) => {
          const config = STATUS_CONFIG[status];
          return (
            <div key={status}>
              {/* Row label + phase labels for this status */}
              <div className="mb-1 hidden grid-cols-[100px_repeat(5,1fr)] gap-2 md:grid">
                <div />
                {PHASES.map((phase) => (
                  <div key={phase} className="text-center text-[10px] text-text-muted">
                    {PIPELINE_PHASE_LABELS[status][phase]}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 gap-2 md:grid-cols-[100px_repeat(5,1fr)]">
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
                  if (!cell) return null;
                  const isSelected = selectedCell?.status === status && selectedCell?.phase === phase;

                  return (
                    <PipelineMatrixCell
                      key={`${status}-${phase}`}
                      cell={cell}
                      statusConfig={config}
                      status={status}
                      isSelected={isSelected}
                      onClick={() => onCellClick(status, phase)}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
