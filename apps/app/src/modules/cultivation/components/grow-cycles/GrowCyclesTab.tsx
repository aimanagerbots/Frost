'use client';

import { useState, useMemo, useCallback } from 'react';
import { cn } from '@/lib/utils';
import {
  DataTable,
  DrawerPanel,
  StatusBadge,
  MetricCard,
  LoadingSkeleton,
} from '@/components';
import type { DomainStatus } from '@/components';
import { useGrowCycles, useCultivationMetrics } from '../../hooks';
import type { GrowCycle, GrowCycleStatus, GrowStage } from '../../types';
import {
  Sprout,
  Flower2,
  Scissors,
  Scale,
  CalendarDays,
  Clock,
  Home,
  Dna,
  FileText,
  RefreshCw,
} from 'lucide-react';

const CULTIVATION_ACCENT = '#22C55E';

// ─── Stage → StatusBadge mapping ─────────────────────────────

const STAGE_LABELS: Record<GrowStage, string> = {
  clone: 'Clone',
  veg: 'Vegetative',
  flower: 'Flowering',
  harvest: 'Harvest',
  dry: 'Drying',
  cure: 'Curing',
  propagation: 'Propagation',
  mother: 'Mother',
  maintenance: 'Maintenance',
};

const STAGE_VARIANT: Record<GrowStage, 'success' | 'warning' | 'info' | 'muted' | 'danger'> = {
  clone: 'info',
  veg: 'info',
  flower: 'warning',
  harvest: 'success',
  dry: 'muted',
  cure: 'muted',
  propagation: 'info',
  mother: 'success',
  maintenance: 'muted',
};

// ─── Status filter options ───────────────────────────────────

type FilterValue = 'all' | GrowCycleStatus;

const FILTER_OPTIONS: { value: FilterValue; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
  { value: 'planned', label: 'Planned' },
  { value: 'cancelled', label: 'Cancelled' },
];

// ─── Helpers ─────────────────────────────────────────────────

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

/** Map GrowCycleStatus → DomainStatus (StatusBadge expects 'complete' not 'completed') */
function toDomainStatus(s: GrowCycleStatus): DomainStatus {
  const map: Record<GrowCycleStatus, DomainStatus> = {
    active: 'active',
    completed: 'complete',
    planned: 'planned',
    cancelled: 'cancelled',
  };
  return map[s];
}

function stageProgress(stage: GrowStage): number {
  const order: GrowStage[] = ['clone', 'propagation', 'mother', 'veg', 'flower', 'harvest', 'dry', 'cure', 'maintenance'];
  const idx = order.indexOf(stage);
  if (idx === -1) return 0;
  return Math.round(((idx + 1) / order.length) * 100);
}

// ─── Component ───────────────────────────────────────────────

export function GrowCyclesTab() {
  const { data: cycles, isLoading: cyclesLoading } = useGrowCycles();
  const { data: metrics, isLoading: metricsLoading } = useCultivationMetrics();
  const [activeFilter, setActiveFilter] = useState<FilterValue>('all');
  const [selectedCycle, setSelectedCycle] = useState<GrowCycle | null>(null);

  const filtered = useMemo(() => {
    if (!cycles) return [];
    if (activeFilter === 'all') return cycles;
    return cycles.filter((c) => c.status === activeFilter);
  }, [cycles, activeFilter]);

  const handleRowClick = useCallback((row: Record<string, unknown>) => {
    setSelectedCycle(row as unknown as GrowCycle);
  }, []);

  if (cyclesLoading || metricsLoading) return <LoadingSkeleton variant="table" />;

  const columns = [
    {
      header: 'Name',
      accessor: ((row: Record<string, unknown>) =>
        `${row.roomName} - ${row.strainName}`) as (row: Record<string, unknown>) => unknown,
      sortable: true,
      render: (row: Record<string, unknown>) => (
        <div className="min-w-0">
          <p className="truncate font-medium text-text-bright">
            {row.roomName as string}
          </p>
          <p className="truncate text-xs text-text-muted">{row.strainName as string}</p>
        </div>
      ),
    },
    {
      header: 'Planted',
      accessor: 'startDate' as const,
      sortable: true,
      hideBelow: 'md' as const,
      render: (row: Record<string, unknown>) => (
        <span className="text-text-default">{formatDate(row.startDate as string)}</span>
      ),
    },
    {
      header: 'Room',
      accessor: 'roomName' as const,
      sortable: true,
      hideBelow: 'lg' as const,
    },
    {
      header: 'Plants',
      accessor: 'plantCount' as const,
      sortable: true,
      render: (row: Record<string, unknown>) => (
        <span className="font-mono text-text-bright">{row.plantCount as number}</span>
      ),
    },
    {
      header: 'Strain',
      accessor: 'strainName' as const,
      sortable: true,
      hideBelow: 'lg' as const,
    },
    {
      header: 'Stage',
      accessor: 'currentStage' as const,
      sortable: true,
      render: (row: Record<string, unknown>) => {
        const stage = row.currentStage as GrowStage;
        return (
          <StatusBadge
            variant={STAGE_VARIANT[stage]}
            label={STAGE_LABELS[stage]}
            size="sm"
            dot
          />
        );
      },
    },
    {
      header: 'Status',
      accessor: 'status' as const,
      sortable: true,
      render: (row: Record<string, unknown>) => (
        <StatusBadge status={toDomainStatus(row.status as GrowCycleStatus)} size="sm" />
      ),
    },
    {
      header: 'Exp. Harvest',
      accessor: 'expectedHarvestDate' as const,
      sortable: true,
      hideBelow: 'md' as const,
      render: (row: Record<string, unknown>) => (
        <span className="text-text-default">{formatDate(row.expectedHarvestDate as string)}</span>
      ),
    },
    {
      header: 'Progress',
      accessor: ((row: Record<string, unknown>) =>
        `${row.dayInStage}/${row.totalDays}`) as (row: Record<string, unknown>) => unknown,
      hideBelow: 'md' as const,
      render: (row: Record<string, unknown>) => {
        const dayInStage = row.dayInStage as number;
        const totalDays = row.totalDays as number;
        const pct = totalDays > 0 ? Math.min(100, Math.round((dayInStage / totalDays) * 100)) : 0;
        return (
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-16 overflow-hidden rounded-full bg-white/[0.06]">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${pct}%`, backgroundColor: CULTIVATION_ACCENT }}
              />
            </div>
            <span className="whitespace-nowrap text-xs text-text-muted">
              {dayInStage}d / {totalDays}d
            </span>
          </div>
        );
      },
    },
  ];

  // Compute metrics for the 4 cards
  const vegPlants = metrics?.plantsInVeg ?? 0;
  const flowerPlants = metrics?.plantsInFlower ?? 0;
  const harvestInProgress = cycles
    ? cycles.filter((c) => c.status === 'active' && c.currentStage === 'harvest').length
    : 0;
  const totalHarvestedLb = cycles
    ? cycles.filter((c) => c.status === 'completed').reduce((sum, c) => sum + c.plantCount * 0.11, 0)
    : 0;

  return (
    <div className="space-y-6">
      {/* ── Metrics Row ─────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <MetricCard
          label="Vegetative Plants"
          value={vegPlants}
          accentColor={CULTIVATION_ACCENT}
          icon={Sprout}
        />
        <MetricCard
          label="Flowering Plants"
          value={flowerPlants}
          accentColor={CULTIVATION_ACCENT}
          icon={Flower2}
        />
        <MetricCard
          label="Harvest In Progress"
          value={harvestInProgress}
          accentColor={CULTIVATION_ACCENT}
          icon={Scissors}
        />
        <MetricCard
          label="Total Harvested (lb)"
          value={totalHarvestedLb.toFixed(1)}
          accentColor={CULTIVATION_ACCENT}
          icon={Scale}
        />
      </div>

      {/* ── Filter Bar ──────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-2">
        {FILTER_OPTIONS.map((opt) => {
          const isActive = activeFilter === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => setActiveFilter(opt.value)}
              className={cn(
                'rounded-lg px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors',
                isActive
                  ? 'text-white'
                  : 'bg-white/[0.04] text-text-muted hover:bg-white/[0.08] hover:text-text-default'
              )}
              style={isActive ? { backgroundColor: CULTIVATION_ACCENT } : undefined}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {/* ── Data Table ──────────────────────────────────────── */}
      <DataTable
        data={(filtered as unknown as Record<string, unknown>[]) ?? []}
        columns={columns}
        searchable
        searchPlaceholder="Search grow cycles..."
        onRowClick={handleRowClick}
        emptyState={{
          icon: RefreshCw,
          title: 'No grow cycles',
          description: 'No grow cycles match your current filters.',
          accentColor: CULTIVATION_ACCENT,
        }}
        pageSize={10}
      />

      {/* ── Detail Drawer ───────────────────────────────────── */}
      <DrawerPanel
        open={!!selectedCycle}
        onClose={() => setSelectedCycle(null)}
        title={
          selectedCycle
            ? `${selectedCycle.roomName} — ${selectedCycle.strainName}`
            : 'Cycle Detail'
        }
        width="md"
      >
        {selectedCycle && <CycleDrawerContent cycle={selectedCycle} />}
      </DrawerPanel>
    </div>
  );
}

// ─── Drawer content ──────────────────────────────────────────

function CycleDrawerContent({ cycle }: { cycle: GrowCycle }) {
  const pct =
    cycle.totalDays > 0
      ? Math.min(100, Math.round((cycle.dayInStage / cycle.totalDays) * 100))
      : 0;

  const progressPct = stageProgress(cycle.currentStage);

  return (
    <div className="space-y-5">
      {/* Status + Stage */}
      <div className="flex items-center gap-3">
        <StatusBadge status={toDomainStatus(cycle.status)} size="sm" />
        <StatusBadge
          variant={STAGE_VARIANT[cycle.currentStage]}
          label={STAGE_LABELS[cycle.currentStage]}
          size="sm"
          dot
        />
      </div>

      {/* Stage Progress */}
      <div className="rounded-xl border border-default bg-elevated p-4">
        <h3 className="mb-3 text-sm font-semibold text-text-bright">Stage Progress</h3>
        <div className="mb-2 flex items-center justify-between text-xs text-text-muted">
          <span>Clone</span>
          <span>Cure</span>
        </div>
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPct}%`, backgroundColor: CULTIVATION_ACCENT }}
          />
        </div>
        <p className="mt-2 text-center text-xs text-text-muted">
          Currently in <span className="font-medium text-text-bright">{STAGE_LABELS[cycle.currentStage]}</span>
          {' '}&mdash; Day {cycle.dayInStage} of {cycle.totalDays}
        </p>
      </div>

      {/* Day Progress Bar */}
      <div className="rounded-xl border border-default bg-elevated p-4">
        <h3 className="mb-3 text-sm font-semibold text-text-bright">Day Progress</h3>
        <div className="h-2 w-full overflow-hidden rounded-full bg-white/[0.06]">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${pct}%`, backgroundColor: CULTIVATION_ACCENT }}
          />
        </div>
        <p className="mt-2 text-center text-xs font-medium text-text-muted">
          {pct}% complete
        </p>
      </div>

      {/* Details Grid */}
      <div className="rounded-xl border border-default bg-elevated p-4">
        <h3 className="mb-3 text-sm font-semibold text-text-bright">Details</h3>
        <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2.5 text-sm">
          <span className="flex items-center gap-1.5 text-text-muted">
            <Home className="h-3.5 w-3.5" /> Room
          </span>
          <span className="text-right font-medium text-text-bright">{cycle.roomName}</span>

          <span className="flex items-center gap-1.5 text-text-muted">
            <Dna className="h-3.5 w-3.5" /> Strain
          </span>
          <span className="text-right font-medium text-text-bright">{cycle.strainName}</span>

          <span className="flex items-center gap-1.5 text-text-muted">
            <Sprout className="h-3.5 w-3.5" /> Plants
          </span>
          <span className="text-right font-mono font-medium text-text-bright">{cycle.plantCount}</span>

          <span className="flex items-center gap-1.5 text-text-muted">
            <CalendarDays className="h-3.5 w-3.5" /> Start Date
          </span>
          <span className="text-right font-medium text-text-bright">{formatDate(cycle.startDate)}</span>

          <span className="flex items-center gap-1.5 text-text-muted">
            <Scissors className="h-3.5 w-3.5" /> Exp. Harvest
          </span>
          <span className="text-right font-medium text-text-bright">{formatDate(cycle.expectedHarvestDate)}</span>

          <span className="flex items-center gap-1.5 text-text-muted">
            <Clock className="h-3.5 w-3.5" /> Day in Stage
          </span>
          <span className="text-right font-mono font-medium text-text-bright">
            {cycle.dayInStage} / {cycle.totalDays}
          </span>
        </div>
      </div>

      {/* Notes */}
      {cycle.notes && (
        <div className="rounded-xl border border-default bg-elevated p-4">
          <h3 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-text-bright">
            <FileText className="h-3.5 w-3.5" /> Notes
          </h3>
          <p className="text-sm leading-relaxed text-text-default">{cycle.notes}</p>
        </div>
      )}
    </div>
  );
}
