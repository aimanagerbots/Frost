'use client';

import { useState } from 'react';
import { DrawerPanel, StatusBadge } from '@/components';
import type { Playbook } from '../../types';
import { Mail, Phone, CheckSquare, Users as MeetingIcon, FileText, Clock, ChevronDown, ChevronRight, Bot } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const TYPE_LABELS: Record<string, string> = {
  'new-account': 'New Account',
  'win-back': 'Win-Back',
  'category-expansion': 'Category Expansion',
  'product-launch': 'Product Launch',
  'payment-issue': 'Payment Issue',
  'competitive-response': 'Competitive Response',
};

const ACTION_ICONS: Record<string, LucideIcon> = {
  email: Mail,
  call: Phone,
  task: CheckSquare,
  meeting: MeetingIcon,
  note: FileText,
  wait: Clock,
};

interface PlaybookDetailProps {
  playbook: Playbook | null;
  onClose: () => void;
  onStart?: (playbookId: string) => void;
}

export function PlaybookDetail({ playbook, onClose, onStart }: PlaybookDetailProps) {
  const [expandedStep, setExpandedStep] = useState<string | null>(null);

  if (!playbook) return null;

  return (
    <DrawerPanel open={!!playbook} onClose={onClose} title={playbook.name} width="lg">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge variant="info" label={TYPE_LABELS[playbook.type] || playbook.type} />
          <span className="text-xs text-text-muted">{playbook.steps.length} steps</span>
          <span className="text-xs text-text-muted">·</span>
          <span className="text-xs text-text-muted">{playbook.estimatedDuration}</span>
          <span className="text-xs text-text-muted">·</span>
          <span className="text-xs text-success">{playbook.successRate}% success rate</span>
        </div>

        <p className="text-sm text-text-muted leading-relaxed">{playbook.description}</p>

        {/* Step flow */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-4 top-4 bottom-4 w-px bg-default" />

          <div className="space-y-3">
            {playbook.steps.map((step) => {
              const Icon = ACTION_ICONS[step.actionType] || CheckSquare;
              const isExpanded = expandedStep === step.id;

              return (
                <div key={step.id} className="relative flex gap-4">
                  {/* Node */}
                  <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-card">
                    <span className="text-xs font-bold text-text-bright">{step.order}</span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 rounded-xl border border-default bg-base p-3">
                    <button
                      onClick={() => setExpandedStep(isExpanded ? null : step.id)}
                      className="flex w-full items-center justify-between text-left"
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-text-muted" />
                        <span className="text-sm font-medium text-text-bright">{step.title}</span>
                        <span className="text-xs text-text-muted">{step.estimatedTime}</span>
                      </div>
                      {isExpanded ? <ChevronDown className="h-4 w-4 text-text-muted" /> : <ChevronRight className="h-4 w-4 text-text-muted" />}
                    </button>

                    {isExpanded && (
                      <div className="mt-3 space-y-3 border-t border-default pt-3">
                        <p className="text-sm text-text-muted leading-relaxed">{step.instructions}</p>
                        {step.aiPrompt && (
                          <div className="flex items-start gap-2 rounded-lg bg-info/10 p-2">
                            <Bot className="mt-0.5 h-4 w-4 shrink-0 text-info" />
                            <div>
                              <span className="text-xs font-medium text-info">AI Assist</span>
                              <p className="text-xs text-text-muted">{step.aiPrompt}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Start button */}
        {onStart && (
          <button
            onClick={() => onStart(playbook.id)}
            className="w-full rounded-lg py-2.5 text-sm font-medium text-white transition-colors hover:opacity-90"
            style={{ backgroundColor: '#5BB8E6' }}
          >
            Start Playbook
          </button>
        )}
      </div>
    </DrawerPanel>
  );
}
