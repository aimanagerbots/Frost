'use client';

import { useState, useCallback } from 'react';
import { Map, Eye, EyeOff } from 'lucide-react';
import { MetricCard, LoadingSkeleton, EmptyState } from '@/components';
import type { TerritoryAccount } from '@/modules/crm/types';
import { useTerritoryData, useTerritoryMetrics } from '@/modules/crm/hooks/copilot-territory-hooks';
import { WashingtonMap } from './territory/WashingtonMap';
import { TerritoryPanel } from './territory/TerritoryPanel';
import { MapTooltip } from './territory/MapTooltip';

const CRM_ACCENT = '#F59E0B';

const HEALTH_TIERS = [
  { key: 'healthy', label: 'Healthy (80+)', color: '#00E5A0' },
  { key: 'watch', label: 'Watch (60-79)', color: '#38BDF8' },
  { key: 'risk', label: 'At Risk (40-59)', color: '#FBBF24' },
  { key: 'critical', label: 'Critical (<40)', color: '#FB7185' },
];

interface TooltipState {
  account: TerritoryAccount | null;
  repName: string;
  x: number;
  y: number;
}

export function TerritoryMap() {
  const { data: territories, isLoading: terrLoading } = useTerritoryData();
  const { data: metrics, isLoading: metricsLoading } = useTerritoryMetrics();

  const [selectedRepId, setSelectedRepId] = useState<string | null>(null);
  const [scaleByRevenue, setScaleByRevenue] = useState(false);
  const [healthFilter, setHealthFilter] = useState<Set<string>>(new Set());
  const [vmiFilter, setVmiFilter] = useState<boolean | null>(null);
  const [tooltip, setTooltip] = useState<TooltipState>({
    account: null,
    repName: '',
    x: 0,
    y: 0,
  });

  const handleHoverAccount = useCallback(
    (account: TerritoryAccount | null, repName: string, x: number, y: number) => {
      setTooltip({ account, repName, x, y });
    },
    [],
  );

  const toggleHealthTier = (tier: string) => {
    setHealthFilter((prev) => {
      const next = new Set(prev);
      if (next.has(tier)) next.delete(tier);
      else next.add(tier);
      return next;
    });
  };

  if (terrLoading || metricsLoading) {
    return <LoadingSkeleton variant="chart" count={2} />;
  }

  if (!territories || territories.length === 0) {
    return <EmptyState icon={Map} title="No territory data" description="Territory data is not available" accentColor={CRM_ACCENT} />;
  }

  return (
    <div className="space-y-4">
      {/* Metrics row */}
      {metrics && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {metrics.map((m) => (
            <MetricCard
              key={m.repId}
              label={m.repName}
              value={`$${(m.totalRevenue / 1000).toFixed(1)}k`}
              accentColor={
                territories.find((t) => t.repId === m.repId)?.color ?? CRM_ACCENT
              }
              trend={{
                value: m.atRiskCount,
                direction: m.atRiskCount > 0 ? 'down' : 'up',
              }}
              className="cursor-pointer"
              onClick={() =>
                setSelectedRepId((prev) =>
                  prev === m.repId ? null : m.repId,
                )
              }
            />
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-default bg-card p-3">
        <span className="text-xs font-medium text-text-muted">Filters:</span>

        {/* Health tier toggles */}
        {HEALTH_TIERS.map((tier) => (
          <button
            key={tier.key}
            onClick={() => toggleHealthTier(tier.key)}
            className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] transition-colors ${
              healthFilter.size === 0 || healthFilter.has(tier.key)
                ? 'border-default bg-base text-text-default'
                : 'border-transparent bg-transparent text-text-muted/50'
            }`}
          >
            <div
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: tier.color }}
            />
            {tier.label}
          </button>
        ))}

        <div className="h-4 w-px bg-default" />

        {/* VMI toggle */}
        <button
          onClick={() =>
            setVmiFilter((prev) =>
              prev === null ? true : prev === true ? false : null,
            )
          }
          className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] transition-colors ${
            vmiFilter !== null
              ? 'border-[#F59E0B]/30 bg-[#F59E0B]/10 text-[#F59E0B]'
              : 'border-default bg-base text-text-muted'
          }`}
        >
          {vmiFilter === true ? 'VMI Only' : vmiFilter === false ? 'Non-VMI' : 'VMI: All'}
        </button>

        {/* Scale toggle */}
        <button
          onClick={() => setScaleByRevenue((p) => !p)}
          className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] transition-colors ${
            scaleByRevenue
              ? 'border-[#F59E0B]/30 bg-[#F59E0B]/10 text-[#F59E0B]'
              : 'border-default bg-base text-text-muted'
          }`}
        >
          {scaleByRevenue ? (
            <Eye className="h-3 w-3" />
          ) : (
            <EyeOff className="h-3 w-3" />
          )}
          Scale by Revenue
        </button>
      </div>

      {/* Map + Panel */}
      <div className="flex rounded-xl border border-default bg-card overflow-hidden">
        {/* Map area */}
        <div className="relative flex-1 p-4">
          <WashingtonMap
            territories={territories}
            selectedRepId={selectedRepId}
            scaleByRevenue={scaleByRevenue}
            healthFilter={healthFilter}
            vmiFilter={vmiFilter}
            onHoverAccount={handleHoverAccount}
            onClickAccount={() => {}}
          />

          {/* Tooltip */}
          {tooltip.account && (
            <MapTooltip
              account={tooltip.account}
              repName={tooltip.repName}
              x={tooltip.x}
              y={tooltip.y}
            />
          )}

          {/* Legend */}
          <div className="absolute bottom-4 left-4 rounded-lg border border-default bg-card/90 p-2.5 backdrop-blur-sm">
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
              Health
            </p>
            <div className="space-y-1">
              {HEALTH_TIERS.map((tier) => (
                <div key={tier.key} className="flex items-center gap-1.5 text-[10px] text-text-muted">
                  <div
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: tier.color }}
                  />
                  {tier.label}
                </div>
              ))}
            </div>
            <div className="mt-2 border-t border-default pt-1.5">
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                Reps
              </p>
              {territories
                .filter((t) => t.bounds.length > 0)
                .map((t) => (
                  <div key={t.repId} className="flex items-center gap-1.5 text-[10px] text-text-muted">
                    <div
                      className="h-2.5 w-2.5 rounded"
                      style={{ backgroundColor: t.color, opacity: 0.5 }}
                    />
                    {t.repName}
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Side panel */}
        <TerritoryPanel
          territories={territories}
          selectedRepId={selectedRepId}
          onSelectRep={setSelectedRepId}
          onSelectAccount={() => {}}
        />
      </div>
    </div>
  );
}
