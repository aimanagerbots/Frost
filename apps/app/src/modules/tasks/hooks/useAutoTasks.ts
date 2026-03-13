'use client';

import { useQuery } from '@tanstack/react-query';
import { usePipelineEvents } from '@/modules/pipeline/hooks';
import { accounts } from '@/mocks/crm';
import type { Task } from '@/modules/tasks/types';
import type { PipelineEvent } from '@/modules/pipeline/types/events';

const REP_NAMES: Record<string, string> = {
  'rep-jake': 'Jake Morrison',
  'rep-priya': 'Priya Patel',
  'rep-carlos': 'Carlos Ruiz',
  'rep-dana': 'Dana Whitfield',
};

const CURRENT_DATE = new Date('2026-03-12');

function addDays(date: Date, days: number): string {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

function getDueDate(severity: PipelineEvent['severity']): string {
  switch (severity) {
    case 'critical':
      return addDays(CURRENT_DATE, 1);
    case 'high':
      return addDays(CURRENT_DATE, 3);
    case 'medium':
      return addDays(CURRENT_DATE, 7);
  }
}

function getAssignee(accountId: string): string {
  const account = accounts.find((a) => a.id === accountId);
  if (!account) return 'Jake Morrison';
  return REP_NAMES[account.assignedRepId] ?? 'Jake Morrison';
}

function buildTitle(event: PipelineEvent): string {
  const { type, accountName, metadata } = event;

  switch (type) {
    case 'health-below-threshold':
      return `Health review: ${accountName} — score ${metadata.healthScore}`;
    case 'phase-stale':
      return `Phase review: ${accountName} — stale in ${metadata.phase} for ${metadata.daysInPhase} days`;
    case 'status-changed-inactive':
      return `Win-back outreach: ${accountName} — moved to Inactive`;
    case 'license-expiring':
      return `License renewal: ${accountName} — expires in ${metadata.licenseDaysRemaining} days`;
    case 'payment-overdue':
      return `Payment follow-up: ${accountName} — ${metadata.paymentOverdueDays} days overdue`;
    default:
      return `Pipeline task: ${accountName}`;
  }
}

function eventTypeToTag(type: PipelineEvent['type']): string {
  switch (type) {
    case 'health-below-threshold':
      return 'health-review';
    case 'phase-stale':
      return 'phase-review';
    case 'status-changed-inactive':
      return 'win-back';
    case 'license-expiring':
      return 'license-renewal';
    case 'payment-overdue':
      return 'payment-followup';
    default:
      return type;
  }
}

function eventToTask(event: PipelineEvent): Task {
  return {
    id: `task-pipeline-${event.id}`,
    title: buildTitle(event),
    description: event.description,
    status: 'todo',
    priority: event.severity,
    assignee: getAssignee(event.accountId),
    dueDate: getDueDate(event.severity),
    createdAt: event.triggeredAt,
    module: 'CRM',
    moduleRoute: '/crm',
    linkedAccountId: event.accountId,
    pipelineCode: event.pipelineCode,
    tags: [eventTypeToTag(event.type), 'pipeline', 'auto-generated'],
    source: 'agent',
  };
}

export function useAutoTasks() {
  const { data: events } = usePipelineEvents();

  return useQuery({
    queryKey: ['tasks', 'auto-generated'],
    queryFn: async (): Promise<Task[]> => {
      await new Promise((resolve) => setTimeout(resolve, 200));
      return (events ?? []).map(eventToTask);
    },
    enabled: !!events && events.length > 0,
  });
}
