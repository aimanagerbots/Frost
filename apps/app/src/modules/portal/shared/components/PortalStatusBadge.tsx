'use client';

import { cn } from '@/lib/utils';

type BadgeVariant =
  // Order statuses
  | 'confirmed'
  | 'in-production'
  | 'packaged'
  | 'fulfilled'
  | 'shipped'
  | 'delivered'
  | 'paid'
  // Payment statuses
  | 'pending'
  | 'invoiced'
  | 'overdue'
  // Delivery statuses
  | 'scheduled'
  | 'in-transit'
  | 'rescheduled'
  // Store order statuses
  | 'new'
  | 'accepted'
  | 'preparing'
  | 'ready'
  | 'picked-up'
  | 'cancelled'
  | 'no-show'
  | 'declined'
  // Invoice
  | 'outstanding'
  | 'compliant'
  | 'approaching';

interface PortalStatusBadgeProps {
  status: BadgeVariant;
  className?: string;
}

const colorMap: Record<BadgeVariant, { bg: string; text: string; dot: string }> = {
  // Green family
  delivered:  { bg: 'bg-green-50',  text: 'text-green-700',  dot: 'bg-green-500' },
  paid:       { bg: 'bg-green-50',  text: 'text-green-700',  dot: 'bg-green-500' },
  'picked-up':{ bg: 'bg-green-50',  text: 'text-green-700',  dot: 'bg-green-500' },
  compliant:  { bg: 'bg-green-50',  text: 'text-green-700',  dot: 'bg-green-500' },
  ready:      { bg: 'bg-green-50',  text: 'text-green-700',  dot: 'bg-green-500' },
  accepted:   { bg: 'bg-green-50',  text: 'text-green-700',  dot: 'bg-green-500' },

  // Blue family
  confirmed:  { bg: 'bg-blue-50',   text: 'text-blue-700',   dot: 'bg-blue-500' },
  shipped:    { bg: 'bg-blue-50',   text: 'text-blue-700',   dot: 'bg-blue-500' },
  'in-transit':{ bg: 'bg-blue-50',  text: 'text-blue-700',   dot: 'bg-blue-500' },
  scheduled:  { bg: 'bg-blue-50',   text: 'text-blue-700',   dot: 'bg-blue-500' },

  // Amber/Yellow family
  'in-production': { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
  packaged:   { bg: 'bg-amber-50',  text: 'text-amber-700',  dot: 'bg-amber-500' },
  preparing:  { bg: 'bg-amber-50',  text: 'text-amber-700',  dot: 'bg-amber-500' },
  pending:    { bg: 'bg-amber-50',  text: 'text-amber-700',  dot: 'bg-amber-500' },
  invoiced:   { bg: 'bg-amber-50',  text: 'text-amber-700',  dot: 'bg-amber-500' },
  outstanding:{ bg: 'bg-amber-50',  text: 'text-amber-700',  dot: 'bg-amber-500' },
  approaching:{ bg: 'bg-amber-50',  text: 'text-amber-700',  dot: 'bg-amber-500' },
  new:        { bg: 'bg-amber-50',  text: 'text-amber-700',  dot: 'bg-amber-500' },

  // Red family
  overdue:    { bg: 'bg-red-50',    text: 'text-red-700',    dot: 'bg-red-500' },
  cancelled:  { bg: 'bg-red-50',    text: 'text-red-700',    dot: 'bg-red-500' },
  declined:   { bg: 'bg-red-50',    text: 'text-red-700',    dot: 'bg-red-500' },
  'no-show':  { bg: 'bg-red-50',    text: 'text-red-700',    dot: 'bg-red-500' },

  // Gray family
  fulfilled:  { bg: 'bg-gray-50',   text: 'text-gray-700',   dot: 'bg-gray-400' },
  rescheduled:{ bg: 'bg-gray-50',   text: 'text-gray-700',   dot: 'bg-gray-400' },
};

function formatLabel(status: string): string {
  return status
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function PortalStatusBadge({ status, className }: PortalStatusBadgeProps) {
  const colors = colorMap[status];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium',
        colors.bg,
        colors.text,
        className,
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', colors.dot)} />
      {formatLabel(status)}
    </span>
  );
}
