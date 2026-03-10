'use client';

import { useState } from 'react';
import { StatusBadge, LoadingSkeleton } from '@/components';
import { usePlaybooks, usePlaybookExecutions } from '../../hooks/usePlaybooks';
import { PlaybookDetail } from './PlaybookDetail';
import { PlaybookExecutionView } from './PlaybookExecution';
import { Play, BookOpen, Clock, TrendingUp } from 'lucide-react';
import type { Playbook, PlaybookExecution } from '../../types';
import { ACCENT as CRM_ACCENT } from '@/design/colors';


const TYPE_LABELS: Record<string, string> = {
  'new-account': 'New Account',
  'win-back': 'Win-Back',
  'category-expansion': 'Category Expansion',
  'product-launch': 'Product Launch',
  'payment-issue': 'Payment Issue',
  'competitive-response': 'Competitive Response',
};

const TYPE_VARIANT: Record<string, 'info' | 'warning' | 'success' | 'danger' | 'muted'> = {
  'new-account': 'info',
  'win-back': 'warning',
  'category-expansion': 'success',
  'product-launch': 'info',
  'payment-issue': 'danger',
  'competitive-response': 'muted',
};

export function Playbooks() {
  const { data: playbooks, isLoading: loadingPB } = usePlaybooks();
  const { data: executions, isLoading: loadingExec } = usePlaybookExecutions();

  const [selectedPlaybook, setSelectedPlaybook] = useState<Playbook | null>(null);
  const [selectedExecution, setSelectedExecution] = useState<PlaybookExecution | null>(null);
  const [detailMode, setDetailMode] = useState<'detail' | 'execution'>('detail');

  if (loadingPB || loadingExec) return <LoadingSkeleton variant="card" count={4} />;
  if (!playbooks || !executions) return null;

  const activeExecutions = executions.filter((e) => e.status === 'active');

  function getPlaybook(id: string) {
    return playbooks?.find((p) => p.id === id) ?? null;
  }

  function handleContinue(exec: PlaybookExecution) {
    setSelectedExecution(exec);
    setDetailMode('execution');
  }

  function handleViewDetail(pb: Playbook) {
    setSelectedPlaybook(pb);
    setDetailMode('detail');
  }

  return (
    <div className="space-y-8">
      {/* Active Executions */}
      {activeExecutions.length > 0 && (
        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-text-muted">Active Playbooks</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {activeExecutions.map((exec) => {
              const pb = getPlaybook(exec.playbookId);
              if (!pb) return null;
              const currentStep = pb.steps.find((s) => s.order === exec.currentStep);
              const progressPct = (exec.completedSteps.length / pb.steps.length) * 100;
              const daysActive = Math.floor(
                (new Date().getTime() - new Date(exec.startedAt).getTime()) / (1000 * 60 * 60 * 24)
              );

              return (
                <div key={exec.id} className="rounded-xl border border-amber-500/30 bg-card p-4">
                  <div className="mb-2 flex items-start justify-between">
                    <h4 className="text-sm font-medium text-text-bright">{pb.name}</h4>
                    <StatusBadge status="active" size="sm" pulse />
                  </div>
                  <p className="mb-2 text-xs text-text-muted">{exec.accountName}</p>

                  {/* Progress */}
                  <div className="mb-2">
                    <div className="flex items-center justify-between text-xs text-text-muted">
                      <span>{exec.completedSteps.length}/{pb.steps.length} steps</span>
                      <span>{daysActive}d active</span>
                    </div>
                    <div className="mt-1 h-2 rounded-full bg-elevated">
                      <div className="h-2 rounded-full bg-amber-500" style={{ width: `${progressPct}%` }} />
                    </div>
                  </div>

                  {currentStep && (
                    <p className="mb-3 text-xs text-text-muted">
                      Current: <span className="text-text-default">{currentStep.title}</span>
                    </p>
                  )}

                  <button
                    onClick={() => handleContinue(exec)}
                    className="flex w-full items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-medium text-white transition-colors hover:opacity-90"
                    style={{ backgroundColor: CRM_ACCENT }}
                  >
                    <Play className="h-3.5 w-3.5" /> Continue
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Available Playbooks */}
      <div>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-text-muted">Available Playbooks</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {playbooks.map((pb) => (
            <div key={pb.id} className="rounded-xl border border-default bg-card p-4 transition-colors hover:bg-accent-hover">
              <div className="mb-2 flex items-start justify-between">
                <StatusBadge variant={TYPE_VARIANT[pb.type] || 'muted'} label={TYPE_LABELS[pb.type] || pb.type} size="sm" />
                <span className="text-xs text-success">{pb.successRate}%</span>
              </div>

              <h4
                className="mb-1 cursor-pointer text-sm font-medium text-text-bright hover:underline"
                onClick={() => handleViewDetail(pb)}
              >
                {pb.name}
              </h4>
              <p className="mb-3 text-xs text-text-muted line-clamp-2">{pb.description}</p>

              <div className="mb-3 flex items-center gap-3 text-xs text-text-muted">
                <span className="flex items-center gap-1">
                  <BookOpen className="h-3 w-3" /> {pb.steps.length} steps
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {pb.estimatedDuration}
                </span>
                <span className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" /> {pb.successRate}%
                </span>
              </div>

              <button
                onClick={() => handleViewDetail(pb)}
                className="w-full rounded-lg border border-default bg-elevated py-1.5 text-sm text-text-default transition-colors hover:bg-accent-hover"
              >
                View & Start
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Detail drawer */}
      {detailMode === 'detail' && (
        <PlaybookDetail
          playbook={selectedPlaybook}
          onClose={() => setSelectedPlaybook(null)}
          onStart={() => {
            // In real app, this would open account selector then create execution
            setSelectedPlaybook(null);
          }}
        />
      )}

      {/* Execution drawer */}
      {detailMode === 'execution' && (
        <PlaybookExecutionView
          execution={selectedExecution}
          playbook={selectedExecution ? getPlaybook(selectedExecution.playbookId) : null}
          onClose={() => setSelectedExecution(null)}
        />
      )}
    </div>
  );
}
