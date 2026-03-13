'use client';

import { StatusBadge } from '@/components';
import type { DomainStatus, BadgeVariant } from '@/components/StatusBadge';

/**
 * Renders a StatusBadge for any inventory status string,
 * mapping non-DomainStatus values to explicit variant + label.
 */
export function InvStatusBadge({ status }: { status: string | null | undefined }) {
  if (!status || status === '—') return <span className="text-xs text-text-muted">—</span>;

  // Map non-DomainStatus values to variant + label
  const overrides: Record<string, { variant: BadgeVariant; label: string }> = {
    'passed':      { variant: 'success',  label: 'Passed' },
    'not-for-sale':{ variant: 'muted',    label: 'Not For Sale' },
    'discontinued':{ variant: 'muted',    label: 'Discontinued' },
    'partial':     { variant: 'warning',  label: 'Partial' },
    'fulfilled':   { variant: 'success',  label: 'Fulfilled' },
    'upcoming':    { variant: 'info',     label: 'Upcoming' },
    'planned':     { variant: 'default',  label: 'Planned' },
    'in-progress': { variant: 'info',     label: 'In Progress' },
    'in-testing':  { variant: 'info',     label: 'In Testing' },
    'submitted':   { variant: 'info',     label: 'Submitted' },
    'available':   { variant: 'success',  label: 'Available' },
    'excluded':    { variant: 'danger',   label: 'Excluded' },
    'out-of-stock':{ variant: 'danger',   label: 'Out of Stock' },
    'low':         { variant: 'warning',  label: 'Low' },
    'critical':    { variant: 'danger',   label: 'Critical' },
    'on-order':    { variant: 'info',     label: 'On Order' },
    'in-stock':    { variant: 'success',  label: 'In Stock' },
    'at-capacity': { variant: 'danger',   label: 'At Capacity' },
  };

  const override = overrides[status];
  if (override) {
    return <StatusBadge variant={override.variant} label={override.label} />;
  }

  // Fall through to domain-aware status
  return <StatusBadge status={status as DomainStatus} />;
}
