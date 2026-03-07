'use client';

import { useState, useMemo, type MouseEvent } from 'react';
import type { TerritoryData, TerritoryAccount } from '@/modules/crm/types';
import { healthColor } from './MapTooltip';

// Simplified Washington State outline (lat/lng)
const WA_OUTLINE: [number, number][] = [
  [48.99, -117.03], // NE corner
  [48.99, -122.76], // N border
  [49.00, -123.32], // NW island area
  [48.38, -124.69], // Olympic Peninsula NW
  [47.96, -124.73], // Cape Flattery area
  [46.94, -124.11], // Westport area
  [46.27, -124.02], // Long Beach
  [46.08, -123.87], // Columbia River mouth
  [45.58, -122.76], // Portland area (S border)
  [45.57, -117.03], // SE corner
];

// SVG viewBox bounds
const MIN_LNG = -125.0;
const MAX_LNG = -116.5;
const MIN_LAT = 45.3;
const MAX_LAT = 49.3;
const SVG_W = 800;
const SVG_H = 500;

function lngToX(lng: number): number {
  return ((lng - MIN_LNG) / (MAX_LNG - MIN_LNG)) * SVG_W;
}

function latToY(lat: number): number {
  return ((MAX_LAT - lat) / (MAX_LAT - MIN_LAT)) * SVG_H;
}

function pointsToPath(points: [number, number][]): string {
  return points
    .map(([lat, lng], i) => `${i === 0 ? 'M' : 'L'}${lngToX(lng)},${latToY(lat)}`)
    .join(' ') + ' Z';
}

function boundsToPath(bounds: { lat: number; lng: number }[][]): string {
  return bounds
    .map((poly) =>
      poly
        .map((p, i) => `${i === 0 ? 'M' : 'L'}${lngToX(p.lng)},${latToY(p.lat)}`)
        .join(' ') + ' Z'
    )
    .join(' ');
}

interface WashingtonMapProps {
  territories: TerritoryData[];
  selectedRepId: string | null;
  scaleByRevenue: boolean;
  healthFilter: Set<string>;
  vmiFilter: boolean | null;
  onHoverAccount: (account: TerritoryAccount | null, repName: string, x: number, y: number) => void;
  onClickAccount: (accountId: string) => void;
}

export function WashingtonMap({
  territories,
  selectedRepId,
  scaleByRevenue,
  healthFilter,
  vmiFilter,
  onHoverAccount,
  onClickAccount,
}: WashingtonMapProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Filter accounts based on health tier and VMI
  const visibleTerritories = useMemo(() => {
    return territories.map((t) => ({
      ...t,
      accounts: t.accounts.filter((a) => {
        // Health tier filter
        const tier = a.health >= 80 ? 'healthy' : a.health >= 60 ? 'watch' : a.health >= 40 ? 'risk' : 'critical';
        if (healthFilter.size > 0 && !healthFilter.has(tier)) return false;
        // VMI filter
        if (vmiFilter !== null && a.vmiEnrolled !== vmiFilter) return false;
        return true;
      }),
    }));
  }, [territories, healthFilter, vmiFilter]);

  const maxRevenue = useMemo(() => {
    const all = territories.flatMap((t) => t.accounts);
    return Math.max(...all.map((a) => a.revenue30d), 1);
  }, [territories]);

  const handleDotMouseEnter = (
    e: MouseEvent,
    account: TerritoryAccount,
    repName: string,
  ) => {
    setHoveredId(account.id);
    const rect = (e.currentTarget as SVGElement).closest('svg')?.getBoundingClientRect();
    if (rect) {
      onHoverAccount(account, repName, e.clientX - rect.left, e.clientY - rect.top);
    }
  };

  const handleDotMouseLeave = () => {
    setHoveredId(null);
    onHoverAccount(null, '', 0, 0);
  };

  const stateOutlinePath = pointsToPath(WA_OUTLINE);

  return (
    <svg
      viewBox={`0 0 ${SVG_W} ${SVG_H}`}
      className="h-full w-full"
      style={{ maxHeight: '450px' }}
    >
      {/* State outline */}
      <path
        d={stateOutlinePath}
        fill="#1A1F2E"
        stroke="#2A3040"
        strokeWidth={2}
      />

      {/* Territory regions */}
      {visibleTerritories
        .filter((t) => t.bounds.length > 0)
        .map((t) => (
          <path
            key={`territory-${t.repId}`}
            d={boundsToPath(t.bounds)}
            fill={t.color}
            fillOpacity={selectedRepId === null || selectedRepId === t.repId ? 0.12 : 0.03}
            stroke={t.color}
            strokeWidth={selectedRepId === t.repId ? 2 : 1}
            strokeOpacity={0.4}
            strokeDasharray={selectedRepId === t.repId ? 'none' : '4,4'}
          />
        ))}

      {/* Account dots */}
      {visibleTerritories
        .filter((t) => selectedRepId === null || selectedRepId === t.repId)
        .flatMap((t) =>
          t.accounts.map((account) => {
            const x = lngToX(account.lng);
            const y = latToY(account.lat);
            const baseR = scaleByRevenue
              ? 4 + (account.revenue30d / maxRevenue) * 10
              : 6;
            const isHovered = hoveredId === account.id;

            return (
              <g key={account.id}>
                {/* Glow on hover */}
                {isHovered && (
                  <circle
                    cx={x}
                    cy={y}
                    r={baseR + 4}
                    fill={healthColor(account.health)}
                    fillOpacity={0.25}
                  />
                )}
                <circle
                  cx={x}
                  cy={y}
                  r={isHovered ? baseR + 2 : baseR}
                  fill={healthColor(account.health)}
                  fillOpacity={0.9}
                  stroke="#0A0E17"
                  strokeWidth={1.5}
                  className="cursor-pointer transition-all"
                  onMouseEnter={(e) => handleDotMouseEnter(e, account, t.repName)}
                  onMouseLeave={handleDotMouseLeave}
                  onClick={() => onClickAccount(account.id)}
                />
              </g>
            );
          }),
        )}
    </svg>
  );
}
