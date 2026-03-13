'use client';

import { useState, useMemo } from 'react';
import { DataTable, StatusBadge, LoadingSkeleton } from '@/components';
import type { DomainStatus } from '@/components';
import { useDisposalRecords } from '../../hooks';
import type { DisposalReason, DisposalMethod } from '../../types';
import { Trash2 } from 'lucide-react';

const CULTIVATION_ACCENT = '#22C55E';

type ComplianceFilter = 'all' | 'compliant' | 'pending-review' | 'flagged';

const COMPLIANCE_FILTERS: { label: string; value: ComplianceFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Compliant', value: 'compliant' },
  { label: 'Pending Review', value: 'pending-review' },
  { label: 'Flagged', value: 'flagged' },
];

const COMPLIANCE_STATUS_MAP: Record<string, DomainStatus> = {
  compliant: 'compliant',
  'pending-review': 'pending-review',
  flagged: 'flagged',
};

const REASON_LABELS: Record<DisposalReason, string> = {
  'failed-qa': 'Failed QA',
  'pest-contamination': 'Pest Contamination',
  mold: 'Mold',
  expired: 'Expired',
  damaged: 'Damaged',
  regulatory: 'Regulatory',
  other: 'Other',
};

const METHOD_LABELS: Record<DisposalMethod, string> = {
  compost: 'Compost',
  incineration: 'Incineration',
  rendering: 'Rendering',
  other: 'Other',
};

function formatWeight(grams: number): string {
  if (grams >= 1000) {
    return `${(grams / 1000).toFixed(1)} kg`;
  }
  return `${grams} g`;
}

export function DisposalTab() {
  const [complianceFilter, setComplianceFilter] = useState<ComplianceFilter>('all');
  const { data: records, isLoading } = useDisposalRecords();

  const filtered = useMemo(() => {
    if (!records) return [];
    if (complianceFilter === 'all') return records;
    return records.filter((r) => r.complianceStatus === complianceFilter);
  }, [records, complianceFilter]);

  const totalCount = records?.length ?? 0;
  const totalWeightKg = useMemo(() => {
    if (!records) return 0;
    return records.reduce((sum, r) => sum + r.weightGrams, 0) / 1000;
  }, [records]);

  if (isLoading) return <LoadingSkeleton variant="table" />;
  if (!records) return null;

  const columns = [
    {
      header: 'Item',
      accessor: 'itemDescription' as const,
      sortable: true,
      render: (row: Record<string, unknown>) => (
        <span className="font-medium text-text-bright">{row.itemDescription as string}</span>
      ),
    },
    {
      header: 'Reason',
      accessor: 'reason' as const,
      render: (row: Record<string, unknown>) => (
        <span className="text-text-default">
          {REASON_LABELS[row.reason as DisposalReason]}
        </span>
      ),
    },
    {
      header: 'Method',
      accessor: 'method' as const,
      render: (row: Record<string, unknown>) => (
        <span className="text-text-default">
          {METHOD_LABELS[row.method as DisposalMethod]}
        </span>
      ),
    },
    {
      header: 'Weight',
      accessor: 'weightGrams' as const,
      sortable: true,
      render: (row: Record<string, unknown>) => (
        <span className="font-mono text-text-default">
          {formatWeight(row.weightGrams as number)}
        </span>
      ),
    },
    {
      header: 'Date',
      accessor: 'disposalDate' as const,
      sortable: true,
    },
    {
      header: 'Witness',
      accessor: 'witness' as const,
      hideBelow: 'md' as const,
    },
    {
      header: 'METRC Tag',
      accessor: 'metrcTag' as const,
      hideBelow: 'lg' as const,
      render: (row: Record<string, unknown>) => (
        <span className="font-mono text-text-default">
          {(row.metrcTag as string) ?? '\u2014'}
        </span>
      ),
    },
    {
      header: 'Compliance',
      accessor: 'complianceStatus' as const,
      render: (row: Record<string, unknown>) => (
        <StatusBadge
          status={COMPLIANCE_STATUS_MAP[row.complianceStatus as string]}
          size="sm"
        />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="flex flex-wrap gap-4">
        <div className="rounded-xl border border-default bg-card px-5 py-3">
          <p className="text-xs text-text-muted">Total Disposals</p>
          <p className="mt-1 text-xl font-semibold text-text-bright">{totalCount}</p>
        </div>
        <div className="rounded-xl border border-default bg-card px-5 py-3">
          <p className="text-xs text-text-muted">Total Weight Disposed</p>
          <p className="mt-1 text-xl font-semibold text-text-bright">
            {totalWeightKg.toFixed(1)} kg
          </p>
        </div>
      </div>

      {/* Compliance filter bar */}
      <div className="flex flex-wrap gap-2">
        {COMPLIANCE_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setComplianceFilter(f.value)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              complianceFilter === f.value
                ? 'text-white'
                : 'border border-default bg-card text-text-muted hover:text-text-default'
            }`}
            style={
              complianceFilter === f.value
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
        searchPlaceholder="Search disposal records..."
        emptyState={{
          icon: Trash2,
          title: 'No disposal records found',
          description: 'No records match your current filter.',
          accentColor: CULTIVATION_ACCENT,
        }}
        pageSize={10}
      />
    </div>
  );
}
