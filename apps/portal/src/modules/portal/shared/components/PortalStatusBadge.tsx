import { cn } from '@/lib/utils';

type BadgeVariant =
  | 'delivered'
  | 'paid'
  | 'picked-up'
  | 'compliant'
  | 'ready'
  | 'accepted'
  | 'confirmed'
  | 'shipped'
  | 'in-transit'
  | 'scheduled'
  | 'in-production'
  | 'packaged'
  | 'preparing'
  | 'pending'
  | 'invoiced'
  | 'outstanding'
  | 'approaching'
  | 'new'
  | 'overdue'
  | 'cancelled'
  | 'declined'
  | 'no-show'
  | 'fulfilled'
  | 'rescheduled';

interface PortalStatusBadgeProps {
  status: BadgeVariant;
  className?: string;
}

const GREEN_STATUSES = new Set<BadgeVariant>([
  'delivered',
  'paid',
  'picked-up',
  'compliant',
  'ready',
  'accepted',
]);

const BLUE_STATUSES = new Set<BadgeVariant>([
  'confirmed',
  'shipped',
  'in-transit',
  'scheduled',
]);

const AMBER_STATUSES = new Set<BadgeVariant>([
  'in-production',
  'packaged',
  'preparing',
  'pending',
  'invoiced',
  'outstanding',
  'approaching',
  'new',
]);

const RED_STATUSES = new Set<BadgeVariant>([
  'overdue',
  'cancelled',
  'declined',
  'no-show',
]);

function getVariantClasses(status: BadgeVariant): {
  badge: string;
  dot: string;
} {
  if (GREEN_STATUSES.has(status)) {
    return {
      badge: 'bg-green-500/15 text-green-400',
      dot: 'bg-green-500',
    };
  }
  if (BLUE_STATUSES.has(status)) {
    return {
      badge: 'bg-blue-500/15 text-blue-400',
      dot: 'bg-blue-500',
    };
  }
  if (AMBER_STATUSES.has(status)) {
    return {
      badge: 'bg-amber-500/15 text-amber-400',
      dot: 'bg-amber-500',
    };
  }
  if (RED_STATUSES.has(status)) {
    return {
      badge: 'bg-red-500/15 text-red-400',
      dot: 'bg-red-500',
    };
  }
  // Gray family: fulfilled, rescheduled, fallback
  return {
    badge: 'bg-white/[0.06] text-text-muted',
    dot: 'bg-white/20',
  };
}

function formatLabel(status: string): string {
  return status
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function PortalStatusBadge({
  status,
  className,
}: PortalStatusBadgeProps) {
  const { badge, dot } = getVariantClasses(status);

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
        badge,
        className
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', dot)} />
      {formatLabel(status)}
    </span>
  );
}
