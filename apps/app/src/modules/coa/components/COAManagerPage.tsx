'use client';

import { useState, useMemo } from 'react';
import { FlaskConical, FileSearch } from 'lucide-react';
import { SectionHeader, MetricCard, DataTable, StatusBadge, LoadingSkeleton, ErrorState } from '@/components';
import { useCOASubmissions, useCOAMetrics } from '../hooks';
import { COADrawer } from './COADrawer';
import type { COAStatus, COASubmission } from '../types';
import { ACCENT } from '@/design/colors';


const STATUS_PIPELINE: { key: COAStatus; label: string }[] = [
  { key: 'submitted', label: 'Submitted' },
  { key: 'in-testing', label: 'In Testing' },
  { key: 'passed', label: 'Passed' },
  { key: 'failed', label: 'Failed' },
  { key: 'remediation', label: 'Remediation' },
];

const statusVariant = (s: COAStatus) => {
  const map: Record<COAStatus, 'info' | 'warning' | 'success' | 'danger' | 'muted'> = {
    submitted: 'info',
    'in-testing': 'warning',
    passed: 'success',
    failed: 'danger',
    remediation: 'muted',
  };
  return map[s];
};

const categoryColor = (cat: string) => {
  const map: Record<string, string> = {
    flower: '#5BB8E6',
    preroll: '#5BB8E6',
    vaporizer: '#5BB8E6',
    concentrate: '#EF4444',
    edible: '#5BB8E6',
    beverage: '#5BB8E6',
  };
  return map[cat] ?? '#5BB8E6';
};

export function COAManagerPage() {
  const [selectedStatus, setSelectedStatus] = useState<COAStatus | null>(null);
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>(null);

  const { data: submissions, isLoading: subsLoading, error: subsError, refetch: refetchSubs } = useCOASubmissions(
    selectedStatus ? { status: selectedStatus } : undefined
  );
  const { data: metrics, isLoading: metricsLoading, error: metricsError, refetch: refetchMetrics } = useCOAMetrics();
  const { data: allSubmissions, error: allSubsError, refetch: refetchAllSubs } = useCOASubmissions();

  const pipelineCounts = useMemo(() => {
    if (!allSubmissions) return new Map<COAStatus, number>();
    const counts = new Map<COAStatus, number>();
    for (const s of allSubmissions) {
      counts.set(s.status, (counts.get(s.status) || 0) + 1);
    }
    return counts;
  }, [allSubmissions]);

  const selectedSubmission = useMemo(
    () => submissions?.find((s) => s.id === selectedSubmissionId) ?? null,
    [submissions, selectedSubmissionId]
  );

  if (metricsLoading) return <LoadingSkeleton variant="card" count={3} />;
  if (subsError || metricsError || allSubsError) return <ErrorState title="Failed to load COA data" message={(subsError || metricsError || allSubsError)?.message} onRetry={() => { refetchSubs(); refetchMetrics(); refetchAllSubs(); }} />;

  const columns = [
    {
      header: 'Batch #',
      accessor: 'batchNumber' as const,
      sortable: true,
      render: (row: COASubmission) => (
        <span className="font-mono text-sm">{row.batchNumber}</span>
      ),
    },
    {
      header: 'Product',
      accessor: 'productName' as const,
      sortable: true,
    },
    {
      header: 'Category',
      accessor: 'category' as const,
      render: (row: COASubmission) => (
        <span
          className="inline-block rounded-full px-2 py-0.5 text-xs font-medium"
          style={{
            backgroundColor: `${categoryColor(row.category)}20`,
            color: categoryColor(row.category),
          }}
        >
          {row.category}
        </span>
      ),
    },
    {
      header: 'Strain',
      accessor: 'strainName' as const,
      sortable: true,
    },
    {
      header: 'Lab',
      accessor: 'labName' as const,
      sortable: true,
    },
    {
      header: 'Submitted',
      accessor: 'submittedDate' as const,
      sortable: true,
    },
    {
      header: 'Expected',
      accessor: 'expectedReturn' as const,
      sortable: true,
    },
    {
      header: 'Status',
      accessor: 'status' as const,
      sortable: true,
      render: (row: COASubmission) => (
        <StatusBadge
          label={row.status.replace(/-/g, ' ')}
          variant={statusVariant(row.status)}
          size="sm"
        />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <SectionHeader icon={FlaskConical} title="COA Manager" accentColor={ACCENT} />

      {/* Metrics Row */}
      {metrics && (
        <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          <MetricCard label="Total Submissions" value={metrics.totalSubmissions} accentColor={ACCENT} />
          <MetricCard label="Pending Results" value={metrics.pendingResults} accentColor={ACCENT} />
          <MetricCard label="Pass Rate" value={`${metrics.passRate}%`} accentColor={ACCENT} trend={{ value: 3, direction: 'up' }} />
          <MetricCard label="Avg Turnaround" value={`${metrics.avgTurnaround}d`} accentColor={ACCENT} />
          <MetricCard
            label="Failed This Month"
            value={metrics.failedThisMonth}
            accentColor={metrics.failedThisMonth > 0 ? '#EF4444' : ACCENT}
          />
        </div>
      )}

      {/* Status Pipeline */}
      <div className="rounded-xl bg-card p-4">
        <h3 className="text-sm font-medium text-text-muted mb-3">Testing Pipeline</h3>
        <div className="flex items-center gap-1 overflow-x-auto">
          {STATUS_PIPELINE.map((stage, i) => {
            const count = pipelineCounts.get(stage.key) || 0;
            const isActive = selectedStatus === stage.key;

            return (
              <div key={stage.key} className="flex items-center">
                {/* Branch visual for passed/failed */}
                {stage.key === 'passed' && (
                  <span className="text-text-muted mr-1 text-xs">↗</span>
                )}
                {stage.key === 'failed' && (
                  <span className="text-text-muted mr-1 text-xs">↘</span>
                )}
                <button
                  onClick={() => setSelectedStatus(isActive ? null : stage.key)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors whitespace-nowrap"
                  style={{
                    backgroundColor: isActive ? `${ACCENT}20` : undefined,
                    borderColor: isActive ? ACCENT : 'transparent',
                    borderWidth: 1,
                    color: isActive ? ACCENT : undefined,
                  }}
                >
                  <span className={isActive ? 'font-semibold' : 'text-text-muted'}>{stage.label}</span>
                  <span
                    className="rounded-full px-2 py-0.5 text-xs font-medium"
                    style={{
                      backgroundColor: isActive ? `${ACCENT}30` : 'var(--bg-elevated)',
                      color: isActive ? ACCENT : 'var(--text-text-muted)',
                    }}
                  >
                    {count}
                  </span>
                </button>
                {i < 1 && <span className="text-text-muted ml-1">→</span>}
                {stage.key === 'failed' && <span className="text-text-muted ml-1">→</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Submissions Table */}
      <DataTable
        data={submissions ?? []}
        columns={columns}
        searchable
        searchPlaceholder="Search batches, products, strains, labs..."
        onRowClick={(row) => setSelectedSubmissionId(row.id)}
        loading={subsLoading}
        emptyState={{
          icon: FileSearch,
          title: 'No submissions found',
          description: selectedStatus
            ? `No submissions with status "${selectedStatus}"`
            : 'No COA submissions to display',
          accentColor: ACCENT,
        }}
      />

      {/* Drawer */}
      <COADrawer
        submission={selectedSubmission}
        open={!!selectedSubmissionId}
        onClose={() => setSelectedSubmissionId(null)}
      />
    </div>
  );
}
