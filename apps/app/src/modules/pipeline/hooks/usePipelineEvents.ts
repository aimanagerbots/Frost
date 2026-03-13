'use client';

import { useQuery } from '@tanstack/react-query';
import { accounts } from '@/mocks/crm';
import type { PipelineEvent, PipelineEventType } from '@/modules/pipeline/types/events';

const SEVERITY_ORDER: Record<PipelineEvent['severity'], number> = {
  critical: 0,
  high: 1,
  medium: 2,
};

const LICENSE_DAYS_REMAINING = [15, 45, 8, 60, 22, 90, 12, 35, 5, 50, 28, 70];
const PAYMENT_OVERDUE_DAYS = [0, 5, 0, 0, 8, 0, 0, 4, 0, 0, 6, 0];

const CURRENT_DATE = new Date('2026-03-12');
const TRIGGERED_AT = '2026-03-12T06:00:00Z';

function daysBetween(dateStr: string, reference: Date): number {
  const d = new Date(dateStr);
  return Math.floor((reference.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
}

function makeEvent(
  accountId: string,
  accountName: string,
  pipelineCode: string,
  type: PipelineEventType,
  severity: PipelineEvent['severity'],
  title: string,
  description: string,
  metadata: Record<string, unknown>,
): PipelineEvent {
  return {
    id: `evt-${accountId}-${type}`,
    type,
    accountId,
    accountName,
    pipelineCode,
    severity,
    title,
    description,
    triggeredAt: TRIGGERED_AT,
    metadata,
  };
}

function evaluateAccount(
  account: (typeof accounts)[number],
  index: number,
): PipelineEvent[] {
  const events: PipelineEvent[] = [];
  const { id, name, healthScore, pipeline } = account;
  const code = pipeline.code;

  // Rule 1: Health score below 40
  if (healthScore < 40) {
    events.push(
      makeEvent(id, name, code, 'health-below-threshold', 'critical',
        `${name} health score critically low (${healthScore})`,
        `${name}'s health score has dropped to ${healthScore}, well below the 40-point threshold. Immediate attention required.`,
        { healthScore }),
    );
  }

  // Rule 2: Phase stale > 30 days
  const daysInPhase = daysBetween(pipeline.enteredDate, CURRENT_DATE);
  if (daysInPhase > 30) {
    events.push(
      makeEvent(id, name, code, 'phase-stale', 'medium',
        `${name} stale in ${pipeline.name} for ${daysInPhase} days`,
        `${name} has been in the "${pipeline.name}" phase (${code}) for ${daysInPhase} days without advancing. Review needed.`,
        { daysInPhase, phase: pipeline.name, enteredDate: pipeline.enteredDate }),
    );
  }

  // Rule 3: Status changed to inactive (within last 7 days)
  if (pipeline.status === 'inactive') {
    const daysSinceEntry = daysBetween(pipeline.enteredDate, CURRENT_DATE);
    if (daysSinceEntry <= 7) {
      events.push(
        makeEvent(id, name, code, 'status-changed-inactive', 'high',
          `${name} moved to Inactive status`,
          `${name} was moved to Inactive status ${daysSinceEntry} day${daysSinceEntry === 1 ? '' : 's'} ago. Investigate cause and potential recovery path.`,
          { daysSinceEntry, enteredDate: pipeline.enteredDate }),
      );
    }
  }

  // Rule 4: License expiring < 30 days
  const licenseDaysRemaining = LICENSE_DAYS_REMAINING[index % 12];
  if (licenseDaysRemaining < 30) {
    events.push(
      makeEvent(id, name, code, 'license-expiring', 'high',
        `${name} license expiring in ${licenseDaysRemaining} days`,
        `${name}'s cannabis license expires in ${licenseDaysRemaining} days. Contact the account to verify renewal status.`,
        { licenseDaysRemaining }),
    );
  }

  // Rule 5: Payment overdue > 3 days
  const paymentOverdueDays = PAYMENT_OVERDUE_DAYS[index % 12];
  if (paymentOverdueDays > 3) {
    events.push(
      makeEvent(id, name, code, 'payment-overdue', 'medium',
        `${name} payment overdue by ${paymentOverdueDays} days`,
        `${name} has an outstanding payment that is ${paymentOverdueDays} days overdue. Follow up on collection.`,
        { paymentOverdueDays }),
    );
  }

  return events;
}

async function fetchPipelineEvents(): Promise<PipelineEvent[]> {
  // Simulated delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  const allEvents: PipelineEvent[] = [];

  accounts.forEach((account, index) => {
    const events = evaluateAccount(account, index);
    allEvents.push(...events);
  });

  // Sort by severity: critical > high > medium
  allEvents.sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]);

  return allEvents;
}

export function usePipelineEvents() {
  return useQuery({
    queryKey: ['pipeline', 'events'],
    queryFn: fetchPipelineEvents,
  });
}
