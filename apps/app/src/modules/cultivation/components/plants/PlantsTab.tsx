'use client';

import { useState, useMemo } from 'react';
import { Sprout } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DataTable, StatusBadge, LoadingSkeleton } from '@/components';
import { usePlants } from '@/modules/cultivation/hooks';
import type { Plant, GrowStage, PlantHealth } from '@/modules/cultivation/types';
import type { DomainStatus } from '@/components';

/* ── Stage filter options ──────────────────────────────────────── */
const STAGE_OPTIONS: { value: string; label: string }[] = [
  { value: '', label: 'All Stages' },
  { value: 'clone', label: 'Clone' },
  { value: 'veg', label: 'Veg' },
  { value: 'flower', label: 'Flower' },
  { value: 'harvest', label: 'Harvest' },
  { value: 'dry', label: 'Dry' },
  { value: 'cure', label: 'Cure' },
];

const HEALTH_OPTIONS: { value: string; label: string }[] = [
  { value: '', label: 'All Health' },
  { value: 'healthy', label: 'Healthy' },
  { value: 'stressed', label: 'Stressed' },
  { value: 'sick', label: 'Sick' },
  { value: 'dead', label: 'Dead' },
];

/* ── Map GrowStage to a DomainStatus for StatusBadge ───────────── */
const STAGE_STATUS_MAP: Record<GrowStage, DomainStatus> = {
  clone: 'processing',
  propagation: 'processing',
  veg: 'active',
  flower: 'active',
  mother: 'active',
  maintenance: 'active',
  harvest: 'complete',
  dry: 'drying',
  cure: 'complete',
};

/* ── Stage display labels ──────────────────────────────────────── */
const STAGE_LABELS: Record<GrowStage, string> = {
  clone: 'Clone',
  propagation: 'Propagation',
  veg: 'Veg',
  flower: 'Flower',
  mother: 'Mother',
  maintenance: 'Maintenance',
  harvest: 'Harvest',
  dry: 'Dry',
  cure: 'Cure',
};

/* ── Source type display labels ─────────────────────────────────── */
const SOURCE_LABELS: Record<Plant['sourceType'], string> = {
  clone: 'Clone',
  seed: 'Seed',
  mother: 'Mother',
};

/* ── Health summary chip colors ────────────────────────────────── */
const HEALTH_CHIP_STYLES: Record<PlantHealth, string> = {
  healthy: 'bg-green-500/15 text-green-400',
  stressed: 'bg-amber-500/15 text-amber-400',
  sick: 'bg-red-500/15 text-red-400',
  dead: 'bg-white/[0.06] text-text-muted',
};

const SELECT_CLASS =
  'rounded-lg border border-default bg-base py-2 px-3 text-sm text-text-default focus:border-hover focus:outline-none';

export function PlantsTab() {
  const [stageFilter, setStageFilter] = useState('');
  const [healthFilter, setHealthFilter] = useState('');

  const filters = useMemo(
    () => ({
      ...(stageFilter ? { stage: stageFilter } : {}),
      ...(healthFilter ? { health: healthFilter } : {}),
    }),
    [stageFilter, healthFilter]
  );

  const { data: plants = [], isLoading } = usePlants(filters);

  /* ── Health counts (computed from current data) ───────────────── */
  const healthCounts = useMemo(() => {
    const counts: Record<PlantHealth, number> = { healthy: 0, stressed: 0, sick: 0, dead: 0 };
    plants.forEach((p) => {
      if (counts[p.health] !== undefined) counts[p.health]++;
    });
    return counts;
  }, [plants]);

  if (isLoading) return <LoadingSkeleton variant="table" />;

  const columns = [
    {
      header: 'Plant Tag',
      accessor: 'plantTag' as const,
      sortable: true,
      render: (row: Plant) => (
        <span className="font-mono text-xs tracking-tight text-text-default">
          {row.plantTag}
        </span>
      ),
    },
    {
      header: 'Strain',
      accessor: 'strainName' as const,
      sortable: true,
    },
    {
      header: 'Stage',
      accessor: 'stage' as const,
      sortable: true,
      render: (row: Plant) => (
        <StatusBadge
          status={STAGE_STATUS_MAP[row.stage]}
          label={STAGE_LABELS[row.stage]}
          size="sm"
        />
      ),
    },
    {
      header: 'Room',
      accessor: 'roomName' as const,
      sortable: true,
      hideBelow: 'md' as const,
    },
    {
      header: 'Health',
      accessor: 'health' as const,
      sortable: true,
      render: (row: Plant) => (
        <StatusBadge status={row.health as DomainStatus} size="sm" />
      ),
    },
    {
      header: 'Source',
      accessor: 'sourceType' as const,
      sortable: true,
      hideBelow: 'lg' as const,
      render: (row: Plant) => (
        <span className="text-text-muted">{SOURCE_LABELS[row.sourceType]}</span>
      ),
    },
    {
      header: 'Age',
      accessor: 'daysSinceTransplant' as const,
      sortable: true,
      hideBelow: 'md' as const,
      render: (row: Plant) => (
        <span className="tabular-nums text-text-muted">{row.daysSinceTransplant} days</span>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* ── Filter bar + summary chips ────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={stageFilter}
          onChange={(e) => setStageFilter(e.target.value)}
          className={cn(SELECT_CLASS, 'min-w-[140px]')}
        >
          {STAGE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <select
          value={healthFilter}
          onChange={(e) => setHealthFilter(e.target.value)}
          className={cn(SELECT_CLASS, 'min-w-[140px]')}
        >
          {HEALTH_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* ── Summary chips ─────────────────────────────────────── */}
        <div className="ml-auto flex items-center gap-2">
          {(Object.entries(healthCounts) as [PlantHealth, number][])
            .filter(([, count]) => count > 0)
            .map(([health, count]) => (
              <span
                key={health}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium',
                  HEALTH_CHIP_STYLES[health]
                )}
              >
                {count} {health.charAt(0).toUpperCase() + health.slice(1)}
              </span>
            ))}
        </div>
      </div>

      {/* ── Data table ────────────────────────────────────────────── */}
      <DataTable<Record<string, unknown>>
        data={plants as unknown as Record<string, unknown>[]}
        columns={columns as never}
        searchable
        searchPlaceholder="Search plants..."
        pageSize={15}
        emptyState={{
          icon: Sprout,
          title: 'No plants found',
          description: 'Adjust your filters or add new plants to the grow.',
          accentColor: '#22C55E',
        }}
      />
    </div>
  );
}
