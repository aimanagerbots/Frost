'use client';

import { useState, useMemo } from 'react';
import { DataTable, StatusBadge, LoadingSkeleton } from '@/components';
import type { DomainStatus } from '@/components';
import { useQASamples } from '../../hooks';
import type { QASampleStatus, QATestType } from '../../types';
import { FlaskConical } from 'lucide-react';

const CULTIVATION_ACCENT = '#22C55E';

type StatusFilter = 'all' | QASampleStatus;

const STATUS_FILTERS: { label: string; value: StatusFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Collected', value: 'collected' },
  { label: 'Submitted', value: 'submitted' },
  { label: 'In Testing', value: 'in-testing' },
  { label: 'Results Ready', value: 'results-ready' },
  { label: 'Reviewed', value: 'reviewed' },
];

const STATUS_DOMAIN_MAP: Record<QASampleStatus, DomainStatus> = {
  collected: 'collected',
  submitted: 'pending',
  'in-testing': 'in-testing',
  'results-ready': 'results-ready',
  reviewed: 'reviewed',
};

const TEST_TYPE_LABELS: Record<QATestType, string> = {
  potency: 'potency',
  terpenes: 'terpenes',
  pesticides: 'pesticides',
  microbials: 'microbials',
  'heavy-metals': 'heavy metals',
  'residual-solvents': 'residual solvents',
  moisture: 'moisture',
};

export function QASampleTab() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const { data: samples, isLoading } = useQASamples();

  const filtered = useMemo(() => {
    if (!samples) return [];
    if (statusFilter === 'all') return samples;
    return samples.filter((s) => s.status === statusFilter);
  }, [samples, statusFilter]);

  if (isLoading) return <LoadingSkeleton variant="table" />;
  if (!samples) return null;

  const columns = [
    {
      header: 'Sample ID',
      accessor: 'sampleId' as const,
      sortable: true,
      render: (row: Record<string, unknown>) => (
        <span className="font-medium text-text-bright">{row.sampleId as string}</span>
      ),
    },
    {
      header: 'Lot #',
      accessor: 'lotNumber' as const,
      render: (row: Record<string, unknown>) => (
        <span className="font-mono text-text-default">{row.lotNumber as string}</span>
      ),
    },
    {
      header: 'Lab',
      accessor: 'labName' as const,
    },
    {
      header: 'Test Types',
      accessor: 'testTypes' as const,
      render: (row: Record<string, unknown>) => (
        <div className="flex flex-wrap gap-1">
          {(row.testTypes as QATestType[]).map((t) => (
            <span
              key={t}
              className="inline-flex items-center gap-1 rounded-full bg-elevated px-2 py-0.5 text-[10px] text-text-muted"
            >
              {TEST_TYPE_LABELS[t]}
            </span>
          ))}
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: 'status' as const,
      sortable: true,
      render: (row: Record<string, unknown>) => (
        <StatusBadge
          status={STATUS_DOMAIN_MAP[row.status as QASampleStatus]}
          size="sm"
        />
      ),
    },
    {
      header: 'Collected',
      accessor: 'collectedDate' as const,
      hideBelow: 'md' as const,
    },
    {
      header: 'THC',
      accessor: 'thc' as const,
      hideBelow: 'md' as const,
      render: (row: Record<string, unknown>) => (
        <span className="font-mono text-text-default">
          {row.thc != null ? `${row.thc as number}%` : '\u2014'}
        </span>
      ),
    },
    {
      header: 'CBD',
      accessor: 'cbd' as const,
      hideBelow: 'md' as const,
      render: (row: Record<string, unknown>) => (
        <span className="font-mono text-text-default">
          {row.cbd != null ? `${row.cbd as number}%` : '\u2014'}
        </span>
      ),
    },
    {
      header: 'Pass/Fail',
      accessor: 'passedAll' as const,
      render: (row: Record<string, unknown>) => {
        if (row.passedAll === undefined || row.passedAll === null) {
          return <span className="text-text-muted">{'\u2014'}</span>;
        }
        return (
          <StatusBadge
            status={row.passedAll ? 'passed' : 'failed'}
            size="sm"
          />
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Status filter bar */}
      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setStatusFilter(f.value)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              statusFilter === f.value
                ? 'text-white'
                : 'border border-default bg-card text-text-muted hover:text-text-default'
            }`}
            style={
              statusFilter === f.value
                ? { backgroundColor: CULTIVATION_ACCENT }
                : undefined
            }
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Data Table */}
      <DataTable
        data={(filtered as unknown as Record<string, unknown>[]) ?? []}
        columns={columns}
        searchable
        searchPlaceholder="Search samples..."
        emptyState={{
          icon: FlaskConical,
          title: 'No QA samples found',
          description: 'No samples match your current filter.',
          accentColor: CULTIVATION_ACCENT,
        }}
        pageSize={10}
      />
    </div>
  );
}
