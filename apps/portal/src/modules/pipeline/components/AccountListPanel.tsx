'use client';

import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { PIPELINE_PHASE_LABELS } from '@/modules/crm/types';
import { PipelineBadge } from './PipelineBadge';
import type { PipelineCellData, PipelineStatus, PipelinePhase } from '../types';
import { accounts } from '@/mocks/crm';

interface AccountListPanelProps {
  status: PipelineStatus;
  phase: PipelinePhase;
  cell: PipelineCellData;
  onClose: () => void;
}

const STATUS_COLORS: Record<PipelineStatus, string> = {
  active: '#22C55E',
  inactive: '#3B82F6',
  recovery: '#EF4444',
};

export function AccountListPanel({ status, phase, cell, onClose }: AccountListPanelProps) {
  const router = useRouter();
  const prefix = status === 'active' ? 'A' : status === 'inactive' ? 'I' : 'R';
  const code = `${prefix}${phase}`;
  const label = PIPELINE_PHASE_LABELS[status][phase];
  const color = STATUS_COLORS[status];

  const fullAccounts = cell.accounts.map((a) => {
    const full = accounts.find((acc) => acc.id === a.id);
    return {
      ...a,
      lastOrderDate: full?.lastOrderDate ?? null,
      assignedRepId: full?.assignedRepId ?? '',
      enteredDate: full?.pipeline?.enteredDate ?? '',
    };
  });

  function daysSince(dateStr: string): number {
    if (!dateStr) return 0;
    const diff = new Date('2026-03-07').getTime() - new Date(dateStr).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }

  return (
    <div className="rounded-xl border border-default bg-card p-4 md:p-6" style={{ borderTopColor: color }}>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <PipelineBadge code={code} size="md" />
          <div>
            <h3 className="text-sm font-semibold text-text-bright">
              {label}
            </h3>
            <p className="text-xs text-text-muted">
              {cell.count} account{cell.count !== 1 ? 's' : ''} &middot; ${(cell.totalRevenue / 1000).toFixed(1)}k/mo
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="rounded-lg p-1.5 text-text-muted transition-colors hover:bg-elevated hover:text-text-default"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {fullAccounts.length === 0 ? (
        <div className="py-8 text-center text-sm text-text-muted">No accounts in this stage</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-default text-left text-text-muted">
                <th className="pb-2 pr-4 font-medium">Account</th>
                <th className="pb-2 pr-4 font-medium">Revenue/mo</th>
                <th className="hidden pb-2 pr-4 font-medium md:table-cell">Days in Stage</th>
                <th className="hidden pb-2 pr-4 font-medium md:table-cell">Health</th>
                <th className="hidden pb-2 font-medium lg:table-cell">Last Order</th>
              </tr>
            </thead>
            <tbody>
              {fullAccounts.map((acct) => (
                <tr
                  key={acct.id}
                  className="cursor-pointer border-b border-default/50 transition-colors hover:bg-elevated/50"
                  onClick={() => router.push(`/crm?account=${acct.id}`)}
                >
                  <td className="py-2.5 pr-4 font-medium text-text-bright">{acct.name}</td>
                  <td className="py-2.5 pr-4 text-text-default">
                    ${(acct.thirtyDayRevenue / 1000).toFixed(1)}k
                  </td>
                  <td className="hidden py-2.5 pr-4 text-text-muted md:table-cell">
                    {daysSince(acct.enteredDate)}d
                  </td>
                  <td className="hidden py-2.5 pr-4 md:table-cell">
                    <span className={acct.healthScore >= 70 ? 'text-emerald-400' : acct.healthScore >= 50 ? 'text-amber-400' : 'text-red-400'}>
                      {acct.healthScore}
                    </span>
                  </td>
                  <td className="hidden py-2.5 text-text-muted lg:table-cell">
                    {acct.lastOrderDate ?? 'Never'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
