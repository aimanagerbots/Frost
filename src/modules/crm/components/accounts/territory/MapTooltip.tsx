'use client';

import type { TerritoryAccount } from '@/modules/crm/types';
import { StatusBadge } from '@/components';

function healthColor(score: number): string {
  if (score >= 80) return '#00E5A0';
  if (score >= 60) return '#38BDF8';
  if (score >= 40) return '#FBBF24';
  return '#FB7185';
}

function healthVariant(score: number): 'success' | 'info' | 'warning' | 'danger' {
  if (score >= 80) return 'success';
  if (score >= 60) return 'info';
  if (score >= 40) return 'warning';
  return 'danger';
}

interface MapTooltipProps {
  account: TerritoryAccount;
  repName: string;
  x: number;
  y: number;
}

export function MapTooltip({ account, repName, x, y }: MapTooltipProps) {
  return (
    <div
      className="pointer-events-none absolute z-50 w-56 rounded-xl border border-default bg-card p-3 shadow-xl"
      style={{ left: x + 12, top: y - 20 }}
    >
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm font-semibold text-bright">{account.name}</p>
      </div>
      <div className="space-y-1.5 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-muted">Health</span>
          <div className="flex items-center gap-1.5">
            <div
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: healthColor(account.health) }}
            />
            <StatusBadge variant={healthVariant(account.health)} label={String(account.health)} size="sm" />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted">30-Day Revenue</span>
          <span className="font-medium text-default">
            ${account.revenue30d.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted">Assigned Rep</span>
          <span className="text-default">{repName}</span>
        </div>
      </div>
    </div>
  );
}

export { healthColor };
