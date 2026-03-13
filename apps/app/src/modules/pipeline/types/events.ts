'use client';

export type PipelineEventType =
  | 'health-below-threshold'
  | 'phase-stale'
  | 'status-changed-inactive'
  | 'license-expiring'
  | 'payment-overdue';

export interface PipelineEvent {
  id: string;
  type: PipelineEventType;
  accountId: string;
  accountName: string;
  pipelineCode: string;
  severity: 'critical' | 'high' | 'medium';
  title: string;
  description: string;
  triggeredAt: string;
  metadata: Record<string, unknown>;
}

export interface PipelineEventRule {
  type: PipelineEventType;
  label: string;
  description: string;
  severity: 'critical' | 'high' | 'medium';
}

export const PIPELINE_EVENT_RULES: PipelineEventRule[] = [
  { type: 'health-below-threshold', label: 'Health Score Below 40', description: 'Account health score dropped below threshold', severity: 'critical' },
  { type: 'phase-stale', label: 'Phase Stale > 30 Days', description: 'Account has been in the same pipeline phase for over 30 days', severity: 'medium' },
  { type: 'status-changed-inactive', label: 'Status Changed to Inactive', description: 'Account pipeline status changed to Inactive', severity: 'high' },
  { type: 'license-expiring', label: 'License Expiring < 30 Days', description: 'Account cannabis license expiring within 30 days', severity: 'high' },
  { type: 'payment-overdue', label: 'Payment Overdue > 3 Days', description: 'Account has a payment overdue by more than 3 days', severity: 'medium' },
];
