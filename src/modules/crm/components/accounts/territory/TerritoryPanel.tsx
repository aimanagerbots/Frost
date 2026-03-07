'use client';

import { Users, MapPin } from 'lucide-react';
import type { TerritoryData } from '@/modules/crm/types';
import { StatusBadge } from '@/components';

function healthVariant(score: number): 'success' | 'info' | 'warning' | 'danger' {
  if (score >= 80) return 'success';
  if (score >= 60) return 'info';
  if (score >= 40) return 'warning';
  return 'danger';
}

interface TerritoryPanelProps {
  territories: TerritoryData[];
  selectedRepId: string | null;
  onSelectRep: (repId: string | null) => void;
  onSelectAccount: (accountId: string) => void;
}

export function TerritoryPanel({
  territories,
  selectedRepId,
  onSelectRep,
  onSelectAccount,
}: TerritoryPanelProps) {
  const filteredAccounts = selectedRepId
    ? territories.find((t) => t.repId === selectedRepId)?.accounts ?? []
    : territories.flatMap((t) => t.accounts);

  return (
    <div className="flex w-[300px] shrink-0 flex-col border-l border-default bg-base">
      {/* Rep selector */}
      <div className="border-b border-default p-3">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
          Territory Rep
        </p>
        <div className="space-y-1">
          <button
            onClick={() => onSelectRep(null)}
            className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs transition-colors ${
              selectedRepId === null
                ? 'bg-[#F59E0B]/10 text-[#F59E0B]'
                : 'text-text-muted hover:bg-card hover:text-text-default'
            }`}
          >
            <Users className="h-3.5 w-3.5" />
            All Territories
            <span className="ml-auto text-[10px] opacity-70">
              {territories.reduce((s, t) => s + t.accounts.length, 0)}
            </span>
          </button>
          {territories
            .filter((t) => t.bounds.length > 0)
            .map((t) => (
              <button
                key={t.repId}
                onClick={() => onSelectRep(t.repId)}
                className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs transition-colors ${
                  selectedRepId === t.repId
                    ? 'bg-[#F59E0B]/10 text-[#F59E0B]'
                    : 'text-text-muted hover:bg-card hover:text-text-default'
                }`}
              >
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: t.color }}
                />
                {t.repName}
                <span className="ml-auto text-[10px] opacity-70">
                  {t.accounts.length}
                </span>
              </button>
            ))}
        </div>
      </div>

      {/* Account list */}
      <div className="flex-1 overflow-y-auto p-3">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
          Accounts ({filteredAccounts.length})
        </p>
        <div className="space-y-1">
          {filteredAccounts
            .sort((a, b) => b.revenue30d - a.revenue30d)
            .map((account) => (
              <button
                key={account.id}
                onClick={() => onSelectAccount(account.id)}
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs text-text-muted hover:bg-card hover:text-text-default transition-colors"
              >
                <MapPin className="h-3 w-3 shrink-0" />
                <span className="flex-1 truncate">{account.name}</span>
                <StatusBadge
                  variant={healthVariant(account.health)}
                  label={String(account.health)}
                  size="sm"
                />
                <span className="w-16 text-right text-[10px] tabular-nums">
                  ${account.revenue30d >= 1000
                    ? `${(account.revenue30d / 1000).toFixed(1)}k`
                    : account.revenue30d.toLocaleString()}
                </span>
              </button>
            ))}
        </div>
      </div>
    </div>
  );
}
