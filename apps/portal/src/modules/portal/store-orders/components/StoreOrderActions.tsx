'use client';

import { Check, X, Play, PackageCheck, UserX } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { StoreOrder } from '@/modules/portal/shared/types';

interface StoreOrderActionsProps {
  order: StoreOrder;
  onAction: (action: string, orderId: string) => void;
  size?: 'sm' | 'md';
}

const SIZE_MAP = {
  sm: 'px-2.5 py-1 text-xs gap-1',
  md: 'px-3.5 py-1.5 text-sm gap-1.5',
} as const;

const ICON_SIZE_MAP = {
  sm: 'h-3 w-3',
  md: 'h-4 w-4',
} as const;

interface ActionDef {
  label: string;
  action: string;
  icon: typeof Check;
  variant: 'green' | 'red' | 'blue';
}

const VARIANT_CLASSES = {
  green: 'bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 border-emerald-500/30',
  red: 'bg-red-500/15 text-red-400 hover:bg-red-500/25 border-red-500/30',
  blue: 'bg-blue-500/15 text-blue-400 hover:bg-blue-500/25 border-blue-500/30',
} as const;

function getActionsForStatus(status: StoreOrder['status']): ActionDef[] {
  switch (status) {
    case 'new':
      return [
        { label: 'Accept', action: 'accept', icon: Check, variant: 'green' },
        { label: 'Decline', action: 'decline', icon: X, variant: 'red' },
      ];
    case 'accepted':
      return [
        { label: 'Start Preparing', action: 'start-preparing', icon: Play, variant: 'blue' },
      ];
    case 'preparing':
      return [
        { label: 'Mark Ready', action: 'mark-ready', icon: PackageCheck, variant: 'green' },
      ];
    case 'ready':
      return [
        { label: 'Picked Up', action: 'picked-up', icon: Check, variant: 'green' },
        { label: 'No Show', action: 'no-show', icon: UserX, variant: 'red' },
      ];
    default:
      return [];
  }
}

export function StoreOrderActions({
  order,
  onAction,
  size = 'md',
}: StoreOrderActionsProps) {
  const actions = getActionsForStatus(order.status);

  if (actions.length === 0) return null;

  return (
    <div className="flex items-center gap-2">
      {actions.map((actionDef) => {
        const Icon = actionDef.icon;
        return (
          <button
            key={actionDef.action}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onAction(actionDef.action, order.id);
            }}
            className={cn(
              'inline-flex items-center rounded-lg border font-medium transition-colors',
              SIZE_MAP[size],
              VARIANT_CLASSES[actionDef.variant]
            )}
          >
            <Icon className={ICON_SIZE_MAP[size]} />
            {actionDef.label}
          </button>
        );
      })}
    </div>
  );
}
