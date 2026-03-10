'use client';

import { useState, useCallback } from 'react';
import { Map as MapIcon, Eye, EyeOff, Flame, Heart, Users } from 'lucide-react';
import { MetricCard, LoadingSkeleton, EmptyState } from '@/components';
import { useTerritoryData, useTerritoryMetrics } from '@/modules/crm/hooks/copilot-territory-hooks';
import { WashingtonMap, type ColorMode } from './territory/WashingtonMap';
import { TerritoryPanel } from './territory/TerritoryPanel';
import { ACCENT as CRM_ACCENT } from '@/design/colors';

const HEALTH_TIERS = [
  { key: 'healthy', label: 'Healthy (80+)', color: '#00E5A0' },
  { key: 'watch', label: 'Watch (60-79)', color: '#38BDF8' },
  { key: 'risk', label: 'At Risk (40-59)', color: '#5BB8E6' },
  { key: 'critical', label: 'Critical (<40)', color: '#FB7185' },
];

export function TerritoryMap() {
  const { data: territories, isLoading: terrLoading } = useTerritoryData();
  const { data: metrics, isLoading: metricsLoading } = useTerritoryMetrics();

  const [selectedRepId, setSelectedRepId] = useState<string | null>(null);
  const [scaleByRevenue, setScaleByRevenue] = useState(false);
  const [healthFilter, setHealthFilter] = useState<Set<string>>(new Set());
  const [vmiFilter, setVmiFilter] = useState<boolean | null>(null);
  const [colorMode, setColorMode] = useState<ColorMode>('health');
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const [flyTo, setFlyTo] = useState<{ lat: number; lng: number; zoom?: number } | null>(null);

  const handleClickAccount = useCallback(
    (accountId: string) => {
      setSelectedAccountId(accountId);
      if (territories) {
        for (const t of territories) {
          const account = t.accounts.find((a) => a.id === accountId);
          if (account) {
            setFlyTo({ lat: account.lat, lng: account.lng, zoom: 12 });
            break;
          }
        }
      }
    },
    [territories],
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
    return (
      <EmptyState
        icon={MapIcon}
        title="No territory data"
        description="Territory data is not available"
        accentColor={CRM_ACCENT}
      />
    );
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
      <div className="flex flex-wrap items-center gap-3 rounded-xl bg-card p-3">
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
              ? 'border-[#5BB8E6]/30 bg-[#5BB8E6]/10 text-[#5BB8E6]'
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
              ? 'border-[#5BB8E6]/30 bg-[#5BB8E6]/10 text-[#5BB8E6]'
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

        <div className="h-4 w-px bg-default" />

        {/* Color mode toggle */}
        <div className="flex items-center rounded-lg border border-default overflow-hidden">
          <button
            onClick={() => setColorMode('health')}
            className={`flex items-center gap-1 px-2.5 py-1 text-[11px] transition-colors ${
              colorMode === 'health'
                ? 'bg-[#00E5A0]/15 text-[#00E5A0] font-medium'
                : 'text-text-muted hover:text-text-default hover:bg-card'
            }`}
          >
            <Heart className="h-3 w-3" />
            Health
          </button>
          <div className="h-4 w-px bg-default" />
          <button
            onClick={() => setColorMode('territory')}
            className={`flex items-center gap-1 px-2.5 py-1 text-[11px] transition-colors ${
              colorMode === 'territory'
                ? 'bg-[#3B82F6]/15 text-[#3B82F6] font-medium'
                : 'text-text-muted hover:text-text-default hover:bg-card'
            }`}
          >
            <Users className="h-3 w-3" />
            Territory
          </button>
        </div>

        {/* Heatmap toggle */}
        <button
          onClick={() => setShowHeatmap((p) => !p)}
          className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] transition-colors ${
            showHeatmap
              ? 'border-[#F59E0B]/30 bg-[#F59E0B]/10 text-[#F59E0B]'
              : 'border-default bg-base text-text-muted'
          }`}
        >
          <Flame className="h-3 w-3" />
          Revenue Heatmap
        </button>
      </div>

      {/* Map + Panel */}
      <div
        className="flex rounded-xl bg-card overflow-hidden"
        style={{ height: 540 }}
      >
        {/* Map area */}
        <div className="relative flex-1">
          <WashingtonMap
            territories={territories}
            selectedRepId={selectedRepId}
            scaleByRevenue={scaleByRevenue}
            healthFilter={healthFilter}
            vmiFilter={vmiFilter}
            colorMode={colorMode}
            showHeatmap={showHeatmap}
            onHoverAccount={() => {}}
            onClickAccount={handleClickAccount}
            selectedAccountId={selectedAccountId}
            flyTo={flyTo}
          />

          {/* Legend */}
          <div className="absolute bottom-4 left-4 rounded-xl bg-card/90 p-2.5 backdrop-blur-sm z-10">
            {colorMode === 'health' ? (
              <>
                <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                  Health
                </p>
                <div className="space-y-1">
                  {HEALTH_TIERS.map((tier) => (
                    <div
                      key={tier.key}
                      className="flex items-center gap-1.5 text-[10px] text-text-muted"
                    >
                      <div
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: tier.color }}
                      />
                      {tier.label}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                  Reps
                </p>
                <div className="space-y-1">
                  {territories
                    .filter((t) => t.bounds.length > 0)
                    .map((t) => (
                      <div
                        key={t.repId}
                        className="flex items-center gap-1.5 text-[10px] text-text-muted"
                      >
                        <div
                          className="h-2.5 w-2.5 rounded"
                          style={{ backgroundColor: t.color, opacity: 0.7 }}
                        />
                        {t.repName}
                      </div>
                    ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Side panel */}
        <TerritoryPanel
          territories={territories}
          selectedRepId={selectedRepId}
          selectedAccountId={selectedAccountId}
          onSelectRep={setSelectedRepId}
          onSelectAccount={handleClickAccount}
        />
      </div>
    </div>
  );
}
