'use client';

import { useState, useMemo } from 'react';
import { FileSearch } from 'lucide-react';
import { MetricCard, DataTable, StatusBadge, DrawerPanel, LoadingSkeleton } from '@/components';
import { useCOASubmissions, useLabPartners } from '@/modules/inventory/hooks';
import { LabPartnerCards } from './LabPartnerCards';
import type { COASubmission } from '@/modules/inventory/types';
import { ACCENT } from '@/design/colors';


type COAStatusFilter = COASubmission['status'] | null;

const statusVariant = (s: COASubmission['status']): 'info' | 'warning' | 'success' | 'danger' => ({
  submitted: 'info' as const,
  'in-testing': 'warning' as const,
  passed: 'success' as const,
  failed: 'danger' as const,
})[s];

export function COAManager() {
  const [statusFilter, setStatusFilter] = useState<COAStatusFilter>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data: submissions, isLoading: subsLoading } = useCOASubmissions(
    statusFilter ? { status: statusFilter } : undefined
  );
  const { data: allSubmissions } = useCOASubmissions();
  const { data: partners, isLoading: partnersLoading } = useLabPartners();

  const metrics = useMemo(() => {
    if (!allSubmissions) return null;
    const pending = allSubmissions.filter((s) => s.status === 'submitted' || s.status === 'in-testing').length;
    const passed = allSubmissions.filter((s) => s.status === 'passed').length;
    const failed = allSubmissions.filter((s) => s.status === 'failed').length;
    const total = allSubmissions.length;
    return {
      totalPending: pending,
      avgTurnaround: 4.2,
      passRate: total > 0 ? Math.round((passed / (passed + failed)) * 100) : 0,
      failedBatches: failed,
      expiringCOAs: 2,
    };
  }, [allSubmissions]);

  const selected = useMemo(
    () => submissions?.find((s) => s.id === selectedId) ?? null,
    [submissions, selectedId]
  );

  const statusCounts = useMemo(() => {
    if (!allSubmissions) return new Map<string, number>();
    const m = new Map<string, number>();
    for (const s of allSubmissions) m.set(s.status, (m.get(s.status) || 0) + 1);
    return m;
  }, [allSubmissions]);

  if (subsLoading || partnersLoading) return <LoadingSkeleton variant="card" count={3} />;

  const columns = [
    { header: 'Batch #', accessor: 'batchNumber' as const, sortable: true, render: (r: COASubmission) => <span className="font-mono text-sm">{r.batchNumber}</span> },
    { header: 'Product', accessor: 'productName' as const, sortable: true },
    { header: 'Category', accessor: 'category' as const, sortable: true, hideBelow: 'md' as const, render: (r: COASubmission) => <span className="capitalize text-text-muted text-xs">{r.category}</span> },
    { header: 'Strain', accessor: 'strain' as const, sortable: true, hideBelow: 'lg' as const },
    { header: 'Lab', accessor: 'labName' as const, sortable: true, hideBelow: 'md' as const },
    { header: 'Submitted', accessor: 'dateSubmitted' as const, sortable: true, hideBelow: 'lg' as const },
    { header: 'Expected', accessor: 'dateExpected' as const, sortable: true, hideBelow: 'lg' as const },
    { header: 'Status', accessor: 'status' as const, sortable: true, render: (r: COASubmission) => <StatusBadge label={r.status.replace(/-/g, ' ')} variant={statusVariant(r.status)} size="sm" /> },
  ];

  const STATUS_TABS: { key: COASubmission['status']; label: string }[] = [
    { key: 'submitted', label: 'Submitted' },
    { key: 'in-testing', label: 'In Testing' },
    { key: 'passed', label: 'Passed' },
    { key: 'failed', label: 'Failed' },
  ];

  return (
    <div className="space-y-5">
      {/* Dashboard Metrics */}
      {metrics && (
        <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          <MetricCard label="Pending Testing" value={metrics.totalPending} accentColor={ACCENT} />
          <MetricCard label="Avg Turnaround" value={`${metrics.avgTurnaround}d`} accentColor={ACCENT} />
          <MetricCard label="Pass Rate (30d)" value={`${metrics.passRate}%`} accentColor={ACCENT} trend={{ value: 3, direction: 'up' }} />
          <MetricCard label="Failed Batches" value={metrics.failedBatches} accentColor={metrics.failedBatches > 0 ? '#FB7185' : ACCENT} />
          <MetricCard label="Expiring COAs (30d)" value={metrics.expiringCOAs} accentColor={metrics.expiringCOAs > 0 ? '#5BB8E6' : ACCENT} />
        </div>
      )}

      {/* Status Filters */}
      <div className="flex items-center gap-1 overflow-x-auto rounded-xl border border-default bg-card p-2">
        <button
          onClick={() => setStatusFilter(null)}
          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${!statusFilter ? 'bg-elevated text-text-bright' : 'text-text-muted hover:text-text-default'}`}
        >
          All ({allSubmissions?.length ?? 0})
        </button>
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setStatusFilter(statusFilter === tab.key ? null : tab.key)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${statusFilter === tab.key ? 'bg-elevated text-text-bright' : 'text-text-muted hover:text-text-default'}`}
          >
            {tab.label} ({statusCounts.get(tab.key) || 0})
          </button>
        ))}
      </div>

      {/* Submissions Table */}
      <DataTable<COASubmission>
        data={submissions ?? []}
        columns={columns}
        searchable
        searchPlaceholder="Search batches, products, strains, labs..."
        onRowClick={(row) => setSelectedId(row.id)}
        emptyState={{ icon: FileSearch, title: 'No submissions found', description: 'No COA submissions match your filters.', accentColor: ACCENT }}
      />

      {/* Lab Partners */}
      {partners && <LabPartnerCards partners={partners} />}

      {/* Detail Drawer */}
      <DrawerPanel open={!!selectedId} onClose={() => setSelectedId(null)} title={selected ? `COA — ${selected.batchNumber}` : ''} width="md">
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div><span className="text-[10px] text-text-muted">Product</span><p className="text-sm text-text-default">{selected.productName}</p></div>
              <div><span className="text-[10px] text-text-muted">Strain</span><p className="text-sm text-text-default">{selected.strain}</p></div>
              <div><span className="text-[10px] text-text-muted">Category</span><p className="text-sm text-text-default capitalize">{selected.category}</p></div>
              <div><span className="text-[10px] text-text-muted">Lab</span><p className="text-sm text-text-default">{selected.labName}</p></div>
              <div><span className="text-[10px] text-text-muted">Submitted</span><p className="text-sm text-text-default">{selected.dateSubmitted}</p></div>
              <div><span className="text-[10px] text-text-muted">Expected</span><p className="text-sm text-text-default">{selected.dateExpected}</p></div>
            </div>
            <div>
              <span className="text-[10px] text-text-muted">Status</span>
              <div className="mt-0.5"><StatusBadge variant={statusVariant(selected.status)} label={selected.status.replace(/-/g, ' ')} /></div>
            </div>
            {selected.results && (
              <div className="space-y-3 border-t border-default pt-3">
                <h4 className="text-xs font-medium text-text-bright">Test Results</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div><span className="text-[10px] text-text-muted">THC</span><p className="text-sm font-medium text-text-default">{selected.results.thc}%</p></div>
                  <div><span className="text-[10px] text-text-muted">CBD</span><p className="text-sm font-medium text-text-default">{selected.results.cbd}%</p></div>
                  <div><span className="text-[10px] text-text-muted">Total Terpenes</span><p className="text-sm text-text-default">{selected.results.totalTerpenes}%</p></div>
                  <div><span className="text-[10px] text-text-muted">Moisture</span><p className="text-sm text-text-default">{selected.results.moisture}%</p></div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {(['pesticides', 'heavyMetals', 'residualSolvents', 'contaminants'] as const).map((test) => (
                    <div key={test} className="flex items-center gap-1.5">
                      <StatusBadge variant={selected.results![test] === 'pass' ? 'success' : 'danger'} label={selected.results![test]} size="sm" />
                      <span className="text-[10px] text-text-muted capitalize">{test.replace(/([A-Z])/g, ' $1')}</span>
                    </div>
                  ))}
                </div>
                {selected.results.failureReasons && selected.results.failureReasons.length > 0 && (
                  <div className="rounded-lg bg-[#FB7185]/10 border border-[#FB7185]/20 p-3">
                    <p className="text-xs font-medium text-[#FB7185] mb-1">Failure Reasons</p>
                    {selected.results.failureReasons.map((reason, i) => (
                      <p key={i} className="text-xs text-text-default">{reason}</p>
                    ))}
                  </div>
                )}
              </div>
            )}
            {selected.expirationDate && (
              <div><span className="text-[10px] text-text-muted">COA Expires</span><p className="text-sm text-text-default">{selected.expirationDate}</p></div>
            )}
          </div>
        )}
      </DrawerPanel>
    </div>
  );
}
