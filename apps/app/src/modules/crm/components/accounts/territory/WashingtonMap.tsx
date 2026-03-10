'use client';

import { useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import type { MapPin, PolygonLayer, HeatmapPoint } from '@/components';
import type { TerritoryData, TerritoryAccount } from '@/modules/crm/types';
import { healthColor } from './MapTooltip';

const FrostMap = dynamic(
  () => import('@/components/FrostMap').then((m) => m.FrostMap),
  { ssr: false, loading: () => <div className="h-full w-full animate-pulse rounded-xl bg-card" /> },
);

/* ---------- color mode ---------- */

export type ColorMode = 'health' | 'territory';

/* ---------- props ---------- */

interface WashingtonMapProps {
  territories: TerritoryData[];
  selectedRepId: string | null;
  scaleByRevenue: boolean;
  healthFilter: Set<string>;
  vmiFilter: boolean | null;
  colorMode: ColorMode;
  showHeatmap?: boolean;
  onHoverAccount: (account: TerritoryAccount | null, repName: string, x: number, y: number) => void;
  onClickAccount: (accountId: string) => void;
  selectedAccountId?: string | null;
  hoveredAccountId?: string | null;
  flyTo?: { lat: number; lng: number; zoom?: number } | null;
}

/* ---------- component ---------- */

export function WashingtonMap({
  territories,
  selectedRepId,
  scaleByRevenue,
  healthFilter,
  vmiFilter,
  colorMode,
  showHeatmap = false,
  onClickAccount,
  selectedAccountId = null,
  hoveredAccountId = null,
  flyTo,
}: WashingtonMapProps) {
  /* filter accounts by health tier & VMI */
  const visibleTerritories = useMemo(() => {
    return territories.map((t) => ({
      ...t,
      accounts: t.accounts.filter((a) => {
        const tier =
          a.health >= 80
            ? 'healthy'
            : a.health >= 60
              ? 'watch'
              : a.health >= 40
                ? 'risk'
                : 'critical';
        if (healthFilter.size > 0 && !healthFilter.has(tier)) return false;
        if (vmiFilter !== null && a.vmiEnrolled !== vmiFilter) return false;
        return true;
      }),
    }));
  }, [territories, healthFilter, vmiFilter]);

  /* convert territory accounts → MapPin[] */
  const pins: MapPin[] = useMemo(() => {
    const repColorMap = new Map(territories.map((t) => [t.repId, t.color]));

    return visibleTerritories
      .filter((t) => selectedRepId === null || selectedRepId === t.repId)
      .flatMap((t) =>
        t.accounts.map((account) => ({
          id: account.id,
          lat: account.lat,
          lng: account.lng,
          name: account.name,
          color:
            colorMode === 'health'
              ? healthColor(account.health)
              : repColorMap.get(t.repId) ?? '#5BB8E6',
          size: scaleByRevenue ? undefined : undefined,
          data: {
            health: account.health,
            revenue30d: account.revenue30d,
            status: account.status,
            vmiEnrolled: account.vmiEnrolled,
            repId: t.repId,
            repName: t.repName,
            repColor: t.color,
          },
        })),
      );
  }, [visibleTerritories, selectedRepId, colorMode, scaleByRevenue, territories]);

  /* build polygon layers for territory boundaries */
  const polygonLayers: PolygonLayer[] = useMemo(() => {
    if (colorMode !== 'territory') return [];

    return territories
      .filter((t) => t.bounds.length > 0)
      .filter((t) => selectedRepId === null || selectedRepId === t.repId)
      .map((t) => ({
        id: `territory-${t.repId}`,
        coordinates: t.bounds.map((ring) =>
          [...ring, ring[0]].map((p) => [p.lng, p.lat] as [number, number]),
        ),
        fillColor: t.color,
        fillOpacity:
          selectedRepId === null || selectedRepId === t.repId ? 0.12 : 0.03,
        strokeColor: t.color,
        strokeWidth: selectedRepId === t.repId ? 2.5 : 1.5,
        label: t.repName,
      }));
  }, [territories, selectedRepId, colorMode]);

  /* build heatmap data from account revenue */
  const heatmapData: HeatmapPoint[] = useMemo(() => {
    if (!showHeatmap) return [];
    const maxRevenue = Math.max(
      ...territories.flatMap((t) => t.accounts.map((a) => a.revenue30d)),
      1,
    );
    return territories
      .filter((t) => selectedRepId === null || selectedRepId === t.repId)
      .flatMap((t) =>
        t.accounts.map((a) => ({
          lat: a.lat,
          lng: a.lng,
          weight: a.revenue30d / maxRevenue,
        })),
      );
  }, [territories, selectedRepId, showHeatmap]);

  /* popup renderer */
  const renderPopup = useCallback(
    (pin: MapPin, onClose: () => void) => {
      const d = pin.data ?? {};
      const health = d.health as number;
      const revenue = d.revenue30d as number;
      const repName = d.repName as string;
      const status = d.status as string;
      const vmi = d.vmiEnrolled as boolean;

      return (
        <div className="bg-[#0A0E17] border border-white/[0.12] rounded-2xl p-4 min-w-[240px] max-w-[280px] shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            className="absolute top-2.5 right-2.5 w-6 h-6 flex items-center justify-center rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-white/40 hover:text-white/70 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
          </button>

          <h3 className="text-sm font-semibold text-white/90 pr-6 leading-tight">
            {pin.name}
          </h3>

          <div className="mt-3 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-white/35">Health</span>
              <div className="flex items-center gap-1.5">
                <div
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: healthColor(health) }}
                />
                <span className="font-medium text-white/80">{health}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/35">30-Day Revenue</span>
              <span className="font-medium text-white/80">
                ${revenue?.toLocaleString() ?? '—'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/35">Rep</span>
              <span className="text-white/70">{repName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/35">Status</span>
              <span className={`capitalize font-medium ${
                status === 'active' ? 'text-emerald-400' :
                status === 'at-risk' ? 'text-amber-400' :
                status === 'churning' ? 'text-red-400' :
                'text-white/50'
              }`}>
                {status}
              </span>
            </div>
            {vmi && (
              <div className="mt-1">
                <span className="text-[10px] font-semibold text-[#5BB8E6] bg-[#5BB8E6]/10 px-2 py-0.5 rounded-full">
                  VMI Enrolled
                </span>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
              onClickAccount(pin.id);
            }}
            className="w-full mt-3 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-[#F59E0B]/15 border border-[#F59E0B]/25 text-xs font-medium text-[#F59E0B] hover:bg-[#F59E0B]/25 transition-all"
          >
            View Account
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
          </button>
        </div>
      );
    },
    [onClickAccount],
  );

  return (
    <FrostMap
      pins={pins}
      selectedId={selectedAccountId}
      hoveredId={hoveredAccountId}
      onPinClick={(id) => onClickAccount(id)}
      flyTo={flyTo}
      renderPopup={renderPopup}
      cluster={true}
      polygonLayers={polygonLayers}
      heatmapData={heatmapData}
      showHeatmap={showHeatmap}
      className="h-full w-full min-h-[450px]"
    />
  );
}
