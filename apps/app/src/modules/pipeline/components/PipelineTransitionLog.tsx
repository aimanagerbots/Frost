'use client';

import { ArrowRight, Clock } from 'lucide-react';
import { PIPELINE_PHASE_LABELS } from '@/modules/crm/types';
import type { PipelineTransition, PipelineStatus } from '../types';

interface TransitionEntry {
  accountId: string;
  accountName: string;
  transition: PipelineTransition;
}

interface PipelineTransitionLogProps {
  transitions: TransitionEntry[];
}

const STATUS_COLOR: Record<PipelineStatus, string> = {
  active: '#5BB8E6',
  inactive: '#5BB8E6',
  recovery: '#EF4444',
};

function formatLabel(status: PipelineStatus, phase: 1 | 2 | 3 | 4 | 5): string {
  return `${status.charAt(0).toUpperCase() + status.slice(1)} P${phase}: ${PIPELINE_PHASE_LABELS[status][phase]}`;
}

export function PipelineTransitionLog({ transitions }: PipelineTransitionLogProps) {
  if (transitions.length === 0) {
    return null;
  }

  return (
    <div className="rounded-xl bg-card p-4 md:p-6">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-text-muted">
        Recent Transitions
      </h2>

      <div className="space-y-3">
        {transitions.map((entry, idx) => {
          const { transition, accountName } = entry;
          const fromColor = STATUS_COLOR[transition.from.status];
          const toColor = STATUS_COLOR[transition.to.status];

          return (
            <div
              key={`${entry.accountId}-${idx}`}
              className="flex items-start gap-3 rounded-lg border border-default bg-elevated/50 px-3 py-2.5"
            >
              <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-text-muted" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                  <span className="font-medium text-text-bright">{accountName}</span>
                  <span className="text-text-muted">moved from</span>
                  <span
                    className="rounded px-1.5 py-0.5 text-[10px] font-medium"
                    style={{ backgroundColor: `${fromColor}20`, color: fromColor }}
                  >
                    {formatLabel(transition.from.status, transition.from.phase)}
                  </span>
                  <ArrowRight className="h-3 w-3 text-text-muted" />
                  <span
                    className="rounded px-1.5 py-0.5 text-[10px] font-medium"
                    style={{ backgroundColor: `${toColor}20`, color: toColor }}
                  >
                    {formatLabel(transition.to.status, transition.to.phase)}
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-2 text-[10px] text-text-muted">
                  <span>{transition.date}</span>
                  <span>&middot;</span>
                  <span>{transition.trigger}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
