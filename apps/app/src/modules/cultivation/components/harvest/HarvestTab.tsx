'use client';

import { useState, useMemo } from 'react';
import { Scissors, Scale, Sprout } from 'lucide-react';
import { DataTable, StatusBadge, MetricCard, LoadingSkeleton } from '@/components';
import { useHarvestRecords } from '../../hooks';
import type { HarvestRecord } from '../../types';

const ACCENT = '#22C55E';

type StatusFilter = 'all' | 'upcoming' | 'drying' | 'complete';

const FILTER_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'drying', label: 'Drying' },
  { value: 'complete', label: 'Complete' },
];

const columns = [
  {
    header: 'Strain',
    accessor: 'strainName' as const,
    sortable: true,
  },
  {
    header: 'Harvest Date',
    accessor: 'harvestDate' as const,
    sortable: true,
  },
  {
    header: 'Plants',
    accessor: 'plantCount' as const,
  },
  {
    header: 'Wet Weight',
    accessor: 'wetWeight' as const,
    sortable: true,
    render: (row: HarvestRecord) => `${row.wetWeight.toLocaleString()} g`,
  },
  {
    header: 'Dry Weight',
    accessor: 'dryWeight' as const,
    sortable: true,
    render: (row: HarvestRecord) => `${row.dryWeight.toLocaleString()} g`,
  },
  {
    header: 'Dry Ratio',
    accessor: 'dryRatio' as const,
    render: (row: HarvestRecord) => `${row.dryRatio.toFixed(1)}%`,
    hideBelow: 'md' as const,
  },
  {
    header: 'Yield/Plant',
    accessor: 'yieldPerPlant' as const,
    render: (row: HarvestRecord) => `${row.yieldPerPlant.toFixed(1)} g`,
    hideBelow: 'md' as const,
  },
  {
    header: 'Status',
    accessor: 'status' as const,
    render: (row: HarvestRecord) => (
      <StatusBadge status={row.status} />
    ),
  },
];

export function HarvestTab() {
  const { data, isLoading } = useHarvestRecords();
  const [filter, setFilter] = useState<StatusFilter>('all');

  const filtered = useMemo(() => {
    if (!data) return [];
    if (filter === 'all') return data;
    return data.filter((r) => r.status === filter);
  }, [data, filter]);

  const metrics = useMemo(() => {
    if (!data || data.length === 0) return { total: 0, avgDryWeight: '0', avgYieldPerPlant: '0' };
    const total = data.length;
    const avgDryWeight = (data.reduce((sum, r) => sum + r.dryWeight, 0) / total).toFixed(1);
    const avgYieldPerPlant = (data.reduce((sum, r) => sum + r.yieldPerPlant, 0) / total).toFixed(1);
    return { total, avgDryWeight, avgYieldPerPlant };
  }, [data]);

  if (isLoading) return <LoadingSkeleton variant="list" />;

  return (
    <div className="space-y-4">
      {/* Summary Metrics */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <MetricCard
          icon={Scissors}
          label="Total Harvests"
          value={metrics.total}
          accentColor={ACCENT}
        />
        <MetricCard
          icon={Scale}
          label="Avg Dry Weight"
          value={`${metrics.avgDryWeight} g`}
          accentColor={ACCENT}
        />
        <MetricCard
          icon={Sprout}
          label="Avg Yield/Plant"
          value={`${metrics.avgYieldPerPlant} g`}
          accentColor={ACCENT}
        />
      </div>

      {/* Status Filter Bar */}
      <div className="flex gap-2">
        {FILTER_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setFilter(opt.value)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              filter === opt.value
                ? 'text-white'
                : 'bg-card text-text-muted hover:bg-card-hover hover:text-text-default'
            }`}
            style={filter === opt.value ? { backgroundColor: ACCENT } : undefined}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Data Table */}
      <DataTable
        data={filtered as unknown as Record<string, unknown>[]}
        columns={columns as Parameters<typeof DataTable>[0]['columns']}
        searchable
        searchPlaceholder="Search harvests..."
        pageSize={10}
        emptyState={{
          icon: Scissors,
          title: 'No harvests found',
          description: 'No harvest records match the current filter.',
          accentColor: ACCENT,
        }}
      />
    </div>
  );
}
