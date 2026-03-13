'use client';

import { cn } from '@/lib/utils';

/* ── Semantic variant system (backward-compatible) ── */
const VARIANT_STYLES = {
  default: { bg: 'bg-elevated', text: 'text-text-default', dot: 'bg-default' },
  success: { bg: 'bg-success/15', text: 'text-success', dot: 'bg-success' },
  warning: { bg: 'bg-warning/15', text: 'text-warning', dot: 'bg-warning' },
  danger: { bg: 'bg-danger/15', text: 'text-danger', dot: 'bg-danger' },
  info: { bg: 'bg-info/15', text: 'text-info', dot: 'bg-info' },
  muted: { bg: 'bg-elevated', text: 'text-text-muted', dot: 'bg-muted' },
} as const;

type BadgeVariant = keyof typeof VARIANT_STYLES;

/* ── Domain-aware status system (portal-style color families) ── */
type DomainStatus =
  | 'delivered' | 'paid' | 'picked-up' | 'compliant' | 'ready'
  | 'accepted' | 'active' | 'complete' | 'approved' | 'verified' | 'allocated'
  | 'released' | 'passed' | 'healthy' | 'reviewed'
  | 'confirmed' | 'shipped' | 'in-transit' | 'scheduled' | 'processing' | 'open'
  | 'in-testing' | 'collected'
  | 'in-production' | 'packaged' | 'preparing' | 'pending' | 'invoiced' | 'submitted'
  | 'outstanding' | 'approaching' | 'new' | 'review' | 'planned' | 'results-ready'
  | 'stressed' | 'pending-review' | 'upcoming'
  | 'overdue' | 'cancelled' | 'declined' | 'no-show' | 'failed' | 'expired' | 'rejected'
  | 'sick' | 'dead' | 'flagged'
  | 'fulfilled' | 'rescheduled' | 'draft' | 'archived' | 'inactive'
  | 'drying' | 'empty' | 'cleaning' | 'transition';

const GREEN_STATUSES = new Set<DomainStatus>([
  'delivered', 'paid', 'picked-up', 'compliant', 'ready',
  'accepted', 'active', 'complete', 'approved', 'verified', 'allocated',
  'released', 'passed', 'healthy', 'reviewed',
]);

const BLUE_STATUSES = new Set<DomainStatus>([
  'confirmed', 'shipped', 'in-transit', 'scheduled', 'processing', 'open',
  'in-testing', 'collected',
]);

const AMBER_STATUSES = new Set<DomainStatus>([
  'in-production', 'packaged', 'preparing', 'pending', 'invoiced', 'submitted',
  'outstanding', 'approaching', 'new', 'review', 'planned', 'results-ready',
  'stressed', 'pending-review', 'drying', 'upcoming',
]);

const RED_STATUSES = new Set<DomainStatus>([
  'overdue', 'cancelled', 'declined', 'no-show', 'failed', 'expired', 'rejected',
  'sick', 'dead', 'flagged',
]);

function getStatusStyles(status: DomainStatus): { bg: string; text: string; dot: string } {
  if (GREEN_STATUSES.has(status)) {
    return { bg: 'bg-green-500/15', text: 'text-green-400', dot: 'bg-green-500' };
  }
  if (BLUE_STATUSES.has(status)) {
    return { bg: 'bg-blue-500/15', text: 'text-blue-400', dot: 'bg-blue-500' };
  }
  if (AMBER_STATUSES.has(status)) {
    return { bg: 'bg-amber-500/15', text: 'text-amber-400', dot: 'bg-amber-500' };
  }
  if (RED_STATUSES.has(status)) {
    return { bg: 'bg-red-500/15', text: 'text-red-400', dot: 'bg-red-500' };
  }
  return { bg: 'bg-white/[0.06]', text: 'text-text-muted', dot: 'bg-white/20' };
}

function formatStatusLabel(status: string): string {
  return status
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

/* ── Component ── */
interface StatusBadgeProps {
  /** Semantic variant (backward-compatible) */
  variant?: BadgeVariant;
  /** Domain-aware status — overrides variant when provided */
  status?: DomainStatus;
  /** Explicit label text. When using `status`, auto-formatted if omitted. */
  label?: string;
  size?: 'xs' | 'sm' | 'md';
  pulse?: boolean;
  dot?: boolean;
  className?: string;
}

const SIZE_CLASSES = {
  xs: 'px-2 py-0.5 text-[10px]',
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
} as const;

export type { DomainStatus, BadgeVariant };

export function StatusBadge({
  variant = 'default',
  status,
  label,
  size = 'md',
  pulse = false,
  dot = false,
  className,
}: StatusBadgeProps) {
  // Domain-aware status takes precedence
  const styles = status ? getStatusStyles(status) : VARIANT_STYLES[variant];
  const displayLabel = label ?? (status ? formatStatusLabel(status) : '');
  // When using domain status, always show the dot
  const showDot = status ? true : dot;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium',
        styles.bg,
        styles.text,
        SIZE_CLASSES[size],
        className
      )}
    >
      {showDot && (
        <span className="relative flex h-1.5 w-1.5">
          {pulse && (
            <span
              className={cn(
                'absolute inline-flex h-full w-full animate-ping rounded-full opacity-75',
                styles.dot
              )}
            />
          )}
          <span
            className={cn(
              'relative inline-flex h-1.5 w-1.5 rounded-full',
              styles.dot
            )}
          />
        </span>
      )}
      {displayLabel}
    </span>
  );
}
