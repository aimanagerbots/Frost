'use client';

import { useMemo, useState } from 'react';
import { Users, MapPin, Navigation, Route, ChevronDown, ChevronUp } from 'lucide-react';
import type { TerritoryData, TerritoryAccount } from '@/modules/crm/types';
import { StatusBadge } from '@/components';
import { haversineDistance } from '@/lib/map-config';

function healthVariant(score: number): 'success' | 'info' | 'warning' | 'danger' {
  if (score >= 80) return 'success';
  if (score >= 60) return 'info';
  if (score >= 40) return 'warning';
  return 'danger';
}

interface TerritoryPanelProps {
  territories: TerritoryData[];
  selectedRepId: string | null;
  selectedAccountId?: string | null;
  onSelectRep: (repId: string | null) => void;
  onSelectAccount: (accountId: string) => void;
}

export function TerritoryPanel({
  territories,
  selectedRepId,
  selectedAccountId,
  onSelectRep,
  onSelectAccount,
}: TerritoryPanelProps) {
  const [showRoute, setShowRoute] = useState(false);

  const allAccounts = useMemo(
    () => territories.flatMap((t) => t.accounts),
    [territories],
  );

  const filteredAccounts = selectedRepId
    ? territories.find((t) => t.repId === selectedRepId)?.accounts ?? []
    : allAccounts;

  /* Nearby accounts (within 15 miles of selected) */
  const selectedAccount = selectedAccountId
    ? allAccounts.find((a) => a.id === selectedAccountId)
    : null;

  const nearbyAccounts = useMemo(() => {
    if (!selectedAccount) return [];
    return allAccounts
      .filter((a) => a.id !== selectedAccount.id)
      .map((a) => ({
        ...a,
        distance: haversineDistance(
          selectedAccount.lat,
          selectedAccount.lng,
          a.lat,
          a.lng,
        ),
      }))
      .filter((a) => a.distance <= 15)
      .sort((a, b) => a.distance - b.distance);
  }, [selectedAccount, allAccounts]);

  /* Route planning: order accounts by closest-first from selected */
  const routeAccounts = useMemo(() => {
    if (!selectedRepId && !selectedAccount) return [];

    const repAccounts = selectedRepId
      ? territories.find((t) => t.repId === selectedRepId)?.accounts ?? []
      : allAccounts;

    if (repAccounts.length === 0) return [];

    // Greedy nearest-neighbor route starting from selectedAccount or first account
    const start = selectedAccount ?? repAccounts[0];
    const remaining = [...repAccounts.filter((a) => a.id !== start.id)];
    const ordered: (TerritoryAccount & { distance: number })[] = [
      { ...start, distance: 0 },
    ];

    let current = start;
    while (remaining.length > 0) {
      let nearestIdx = 0;
      let nearestDist = Infinity;
      for (let i = 0; i < remaining.length; i++) {
        const d = haversineDistance(
          current.lat,
          current.lng,
          remaining[i].lat,
          remaining[i].lng,
        );
        if (d < nearestDist) {
          nearestDist = d;
          nearestIdx = i;
        }
      }
      const next = remaining.splice(nearestIdx, 1)[0];
      ordered.push({ ...next, distance: nearestDist });
      current = next;
    }

    return ordered;
  }, [selectedRepId, selectedAccount, territories, allAccounts]);

  const totalRouteDistance = useMemo(
    () => routeAccounts.reduce((sum, a) => sum + a.distance, 0),
    [routeAccounts],
  );

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
                ? 'bg-[#5BB8E6]/10 text-[#5BB8E6]'
                : 'text-text-muted hover:bg-card hover:text-text-default'
            }`}
          >
            <Users className="h-3.5 w-3.5" />
            All Territories
            <span className="ml-auto text-[10px] opacity-70">
              {allAccounts.length}
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
                    ? 'bg-[#5BB8E6]/10 text-[#5BB8E6]'
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

      {/* Nearby accounts — shown when an account is selected */}
      {selectedAccount && nearbyAccounts.length > 0 && (
        <div className="border-b border-default p-3">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
            <Navigation className="mr-1 inline h-3 w-3" />
            Nearby ({nearbyAccounts.length} within 15 mi)
          </p>
          <div className="space-y-1 max-h-[140px] overflow-y-auto">
            {nearbyAccounts.slice(0, 8).map((account) => (
              <button
                key={account.id}
                onClick={() => onSelectAccount(account.id)}
                className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs transition-colors ${
                  selectedAccountId === account.id
                    ? 'bg-[#F59E0B]/10 text-[#F59E0B]'
                    : 'text-text-muted hover:bg-card hover:text-text-default'
                }`}
              >
                <MapPin className="h-3 w-3 shrink-0" />
                <span className="flex-1 truncate">{account.name}</span>
                <span className="text-[10px] tabular-nums text-white/30">
                  {account.distance.toFixed(1)} mi
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Route planner — collapsible */}
      {(selectedRepId || selectedAccount) && routeAccounts.length > 1 && (
        <div className="border-b border-default">
          <button
            onClick={() => setShowRoute((p) => !p)}
            className="flex w-full items-center gap-2 px-3 py-2.5 text-xs text-text-muted hover:text-text-default transition-colors"
          >
            <Route className="h-3.5 w-3.5 text-[#F59E0B]" />
            <span className="flex-1 text-left font-medium">
              Route Plan ({routeAccounts.length} stops, {totalRouteDistance.toFixed(1)} mi)
            </span>
            {showRoute ? (
              <ChevronUp className="h-3.5 w-3.5" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5" />
            )}
          </button>
          {showRoute && (
            <div className="px-3 pb-3 space-y-0.5">
              {routeAccounts.map((account, i) => (
                <button
                  key={account.id}
                  onClick={() => onSelectAccount(account.id)}
                  className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs transition-colors ${
                    selectedAccountId === account.id
                      ? 'bg-[#F59E0B]/10 text-[#F59E0B]'
                      : 'text-text-muted hover:bg-card hover:text-text-default'
                  }`}
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#F59E0B]/15 text-[10px] font-bold text-[#F59E0B] shrink-0">
                    {i + 1}
                  </span>
                  <span className="flex-1 truncate">{account.name}</span>
                  {i > 0 && (
                    <span className="text-[10px] tabular-nums text-white/30">
                      +{account.distance.toFixed(1)} mi
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

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
                className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs transition-colors ${
                  selectedAccountId === account.id
                    ? 'bg-[#F59E0B]/10 text-[#F59E0B]'
                    : 'text-text-muted hover:bg-card hover:text-text-default'
                }`}
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
