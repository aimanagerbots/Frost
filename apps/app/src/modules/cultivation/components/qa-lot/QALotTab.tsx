'use client';

import { useState, useMemo } from 'react';
import { DataTable, StatusBadge, LoadingSkeleton, ErrorState } from '@/components';
import { useQALots } from '../../hooks';
import type { QALotStatus } from '../../types';
import { FlaskConical } from 'lucide-react';

const CULTIVATION_ACCENT = '#22C55E';

const STATUS_FILTERS: { label: string; value: QALotStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'In Testing', value: 'in-testing' },
  { label: 'Passed', value: 'passed' },
  { label: 'Failed', value: 'failed' },
  { label: 'Released', value: 'released' },
];

const STATUS_CHIP_STYLES: Record<QALotStatus, { bg: string; text: string }> = {
  pending: { bg: 'bg-amber-500/15', text: 'text-amber-400' },
  'in-testing': { bg: 'bg-blue-500/15', text: 'text-blue-400' },
  passed: { bg: 'bg-green-500/15', text: 'text-green-400' },
  failed: { bg: 'bg-red-500/15', text: 'text-red-400' },
  released: { bg: 'bg-green-500/15', text: 'text-green-400' },
};

const STATUS_LABELS: Record<QALotStatus, string> = {
  pending: 'Pending',
  'in-testing': 'In Testing',
  passed: 'Passed',
  failed: 'Failed',
  released: 'Released',
};

function formatDate(date?: string): string {
  if (!date) return '\u2014';
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function QALotTab() {
  const [activeFilter, setActiveFilter] = useState<QALotStatus | 'all'>('all');
  const { data: lots, isLoading, isError, refetch } = useQALots();

  const filteredLots = useMemo(() => {
    if (!lots) return [];
    if (activeFilter === 'all') return lots;
    return lots.filter((lot) => lot.status === activeFilter);
  }, [lots, activeFilter]);

  const statusCounts = useMemo(() => {
    if (!lots) return {} as Record<QALotStatus, number>;
    const counts: Record<string, number> = {};
    for (const lot of lots) {
      counts[lot.status] = (counts[lot.status] || 0) + 1;
    }
    return counts as Record<QALotStatus, number>;
  }, [lots]);

  if (isLoading) return <LoadingSkeleton variant="table" />;
  if (isError) return <ErrorState onRetry={() => refetch()} />;
  if (!lots) return null;

  const columns = [
    {
      header: 'Lot Number',
      accessor: 'lotNumber' as const,
      sortable: true,
      render: (row: Record<string, unknown>) => (
        <span className="font-medium text-text-bright">{row.lotNumber as string}</span>
      ),
    },
    {
      header: 'Strain',
      accessor: 'strainName' as const,
      sortable: true,
    },
    {
      header: 'Harvest Date',
      accessor: 'harvestDate' as const,
      sortable: true,
      render: (row: Record<string, unknown>) => formatDate(row.harvestDate as string),
    },
    {
      header: 'Batch Size',
      accessor: 'batchSize' as const,
      sortable: false,
      hideBelow: 'md' as const,
      render: (row: Record<string, unknown>) => (
        <span className="font-mono">
          {row.batchSize as number} {row.unit as string}
        </span>
      ),
    },
    {
      header: 'Lab',
      accessor: 'labName' as const,
      hideBelow: 'md' as const,
      render: (row: Record<string, unknown>) => (
        <span className="text-text-muted">{(row.labName as string) || '\u2014'}</span>
      ),
    },
    {
      header: 'Submitted',
      accessor: 'submittedDate' as const,
      hideBelow: 'lg' as const,
      render: (row: Record<string, unknown>) => (
        <span className="text-text-muted">{formatDate(row.submittedDate as string | undefined)}</span>
      ),
    },
    {
      header: 'Results',
      accessor: 'resultsDate' as const,
      hideBelow: 'lg' as const,
      render: (row: Record<string, unknown>) => (
        <span className="text-text-muted">{formatDate(row.resultsDate as string | undefined)}</span>
      ),
    },
    {
      header: 'Status',
      accessor: 'status' as const,
      sortable: true,
      render: (row: Record<string, unknown>) => (
        <StatusBadge status={row.status as QALotStatus} size="sm" />
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Status summary chips */}
      <div className="flex flex-wrap items-center gap-2">
        {(Object.keys(statusCounts) as QALotStatus[]).map((status) => {
          const styles = STATUS_CHIP_STYLES[status];
          return (
            <span
              key={status}
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${styles.bg} ${styles.text}`}
            >
              {statusCounts[status]} {STATUS_LABELS[status]}
            </span>
          );
        })}
      </div>

      {/* Status filter bar */}
      <div className="flex flex-wrap items-center gap-2">
        {STATUS_FILTERS.map((filter) => {
          const isActive = activeFilter === filter.value;
          return (
            <button
              key={filter.value}
              onClick={() => setActiveFilter(filter.value)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                isActive
                  ? 'text-white'
                  : 'border border-default bg-card text-text-muted hover:bg-card-hover hover:text-text-default'
              }`}
              style={isActive ? { backgroundColor: CULTIVATION_ACCENT } : undefined}
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      {/* Data table */}
      <DataTable
        data={(filteredLots as unknown as Record<string, unknown>[]) ?? []}
        columns={columns}
        searchable
        searchPlaceholder="Search QA lots..."
        emptyState={{
          icon: FlaskConical,
          title: 'No QA lots found',
          description: 'No lots match your current filter.',
          accentColor: CULTIVATION_ACCENT,
        }}
        pageSize={10}
      />
    </div>
  );
}
