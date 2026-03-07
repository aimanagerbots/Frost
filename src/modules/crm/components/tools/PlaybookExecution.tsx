'use client';

import { DrawerPanel, StatusBadge } from '@/components';
import type { Playbook, PlaybookExecution as PlaybookExecType } from '../../types';
import { Mail, Phone, CheckSquare, Users as MeetingIcon, FileText, Clock, CheckCircle, SkipForward } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const ACTION_ICONS: Record<string, LucideIcon> = {
  email: Mail,
  call: Phone,
  task: CheckSquare,
  meeting: MeetingIcon,
  note: FileText,
  wait: Clock,
};

interface PlaybookExecutionViewProps {
  execution: PlaybookExecType | null;
  playbook: Playbook | null;
  onClose: () => void;
}

export function PlaybookExecutionView({ execution, playbook, onClose }: PlaybookExecutionViewProps) {
  if (!execution || !playbook) return null;

  const currentStep = playbook.steps.find((s) => s.order === execution.currentStep);
  const totalSteps = playbook.steps.length;
  const completedCount = execution.completedSteps.length;
  const progressPct = (completedCount / totalSteps) * 100;

  const daysActive = Math.floor(
    (new Date().getTime() - new Date(execution.startedAt).getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <DrawerPanel open={!!execution} onClose={onClose} title={`Executing: ${playbook.name}`} width="lg">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm text-text-muted">Account:</span>{' '}
            <span className="text-sm font-medium text-text-bright">{execution.accountName}</span>
          </div>
          <StatusBadge variant={execution.status === 'active' ? 'success' : execution.status === 'completed' ? 'muted' : 'danger'} label={execution.status} />
        </div>

        {/* Progress bar */}
        <div>
          <div className="flex items-center justify-between text-xs text-text-muted">
            <span>Progress: {completedCount}/{totalSteps} steps</span>
            <span>{daysActive} days active</span>
          </div>
          <div className="mt-1 h-2.5 rounded-full bg-elevated">
            <div
              className="h-2.5 rounded-full bg-amber-500 transition-all"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Current step */}
        {currentStep && execution.status === 'active' && (
          <div className="rounded-xl border-2 border-amber-500/40 bg-amber-500/5 p-4">
            <div className="mb-2 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-xs font-bold text-white">
                {currentStep.order}
              </span>
              <h4 className="text-sm font-medium text-text-bright">{currentStep.title}</h4>
              <span className="ml-auto text-xs text-text-muted">{currentStep.estimatedTime}</span>
            </div>
            <p className="mb-4 text-sm text-text-muted leading-relaxed">{currentStep.instructions}</p>

            <div className="flex gap-2">
              <button className="flex items-center gap-1.5 rounded-lg bg-success/20 px-3 py-1.5 text-sm text-success hover:bg-success/30">
                <CheckCircle className="h-4 w-4" /> Mark Complete
              </button>
              <button className="flex items-center gap-1.5 rounded-lg bg-elevated px-3 py-1.5 text-sm text-text-muted hover:text-text-default">
                <SkipForward className="h-4 w-4" /> Skip
              </button>
              <button className="rounded-lg bg-elevated px-3 py-1.5 text-sm text-text-muted hover:text-text-default">
                Add Note
              </button>
            </div>
          </div>
        )}

        {/* All steps list */}
        <div>
          <h4 className="mb-3 text-sm font-medium text-text-bright">All Steps</h4>
          <div className="relative">
            <div className="absolute left-3 top-3 bottom-3 w-px bg-default" />
            <div className="space-y-2">
              {playbook.steps.map((step) => {
                const isCompleted = execution.completedSteps.includes(step.order);
                const isCurrent = step.order === execution.currentStep;
                const Icon = ACTION_ICONS[step.actionType] || CheckSquare;

                return (
                  <div key={step.id} className={`relative flex items-start gap-3 rounded-lg p-2 ${isCurrent ? 'bg-amber-500/10' : ''}`}>
                    <div className={`relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs ${
                      isCompleted ? 'bg-success text-white' : isCurrent ? 'bg-amber-500 text-white' : 'border border-default bg-card text-text-muted'
                    }`}>
                      {isCompleted ? <CheckCircle className="h-3.5 w-3.5" /> : step.order}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Icon className="h-3.5 w-3.5 text-text-muted" />
                        <span className={`text-sm ${isCompleted ? 'text-text-muted line-through' : isCurrent ? 'font-medium text-text-bright' : 'text-text-default'}`}>
                          {step.title}
                        </span>
                        <span className="text-xs text-text-muted">{step.estimatedTime}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </DrawerPanel>
  );
}
