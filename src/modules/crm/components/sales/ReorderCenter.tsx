'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { RefreshCw } from 'lucide-react';
import { MetricCard, DataTable, StatusBadge, LoadingSkeleton, EmptyState } from '@/components';
import { useReorderProposals } from '../../hooks';
import type { ReorderProposal } from '../../types';
import { ReorderProposalDrawer } from './ReorderProposalDrawer';

const CRM_ACCENT = '#F59E0B';

function formatCurrency(n: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(n);
}

function statusVariant(status: string) {
  switch (status) {
    case 'pending': return 'warning' as const;
    case 'approved': return 'info' as const;
    case 'sent': return 'info' as const;
    case 'ordered': return 'success' as const;
    case 'rejected': return 'danger' as const;
    default: return 'default' as const;
  }
}

function sourceVariant(source: string) {
  switch (source) {
    case 'vmi-velocity': return 'info' as const;
    case 'cadence-analysis': return 'warning' as const;
    default: return 'muted' as const;
  }
}

type FilterStatus = 'all' | 'pending' | 'approved' | 'sent' | 'ordered' | 'rejected';
type FilterSource = 'all' | 'vmi-velocity' | 'cadence-analysis' | 'manual';
type SortField = 'confidence' | 'totalValue' | 'daysSinceLastOrder';

export function ReorderCenter() {
  const { data: proposals, isLoading } = useReorderProposals();
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [filterSource, setFilterSource] = useState<FilterSource>('all');
  const [sortBy, setSortBy] = useState<SortField>('confidence');
  const [selectedProposal, setSelectedProposal] = useState<ReorderProposal | null>(null);
  const [localProposals, setLocalProposals] = useState<ReorderProposal[] | null>(null);

  const allProposals = useMemo(() => localProposals ?? proposals ?? [], [localProposals, proposals]);

  const filtered = useMemo(() => {
    let result = [...allProposals];
    if (filterStatus !== 'all') result = result.filter((p) => p.status === filterStatus);
    if (filterSource !== 'all') result = result.filter((p) => p.source === filterSource);
    result.sort((a, b) => b[sortBy] - a[sortBy]);
    return result;
  }, [allProposals, filterStatus, filterSource, sortBy]);

  const metrics = useMemo(() => {
    const pending = allProposals.filter((p) => p.status === 'pending');
    const avgConf = pending.length
      ? Math.round(pending.reduce((s, p) => s + p.confidence, 0) / pending.length)
      : 0;
    const totalValue = pending.reduce((s, p) => s + p.totalValue, 0);
    const ordered = allProposals.filter((p) => p.status === 'ordered').length;
    const total = allProposals.filter((p) => ['ordered', 'rejected'].includes(p.status)).length;
    const acceptRate = total ? Math.round((ordered / total) * 100) : 0;
    return { pendingCount: pending.length, totalValue, avgConf, acceptRate };
  }, [allProposals]);

  const handleApprove = useCallback(
    (id: string) => {
      const current = localProposals ?? proposals ?? [];
      setLocalProposals(current.map((p) => (p.id === id ? { ...p, status: 'approved' as const, modifiedAt: new Date().toISOString() } : p)));
      setSelectedProposal(null);
    },
    [localProposals, proposals],
  );

  const handleReject = useCallback(
    (id: string) => {
      const current = localProposals ?? proposals ?? [];
      setLocalProposals(current.map((p) => (p.id === id ? { ...p, status: 'rejected' as const, modifiedAt: new Date().toISOString() } : p)));
      setSelectedProposal(null);
    },
    [localProposals, proposals],
  );

  if (isLoading) return <LoadingSkeleton variant="table" />;

  if (!allProposals.length) {
    return (
      <EmptyState
        icon={RefreshCw}
        title="No Reorder Proposals"
        description="No reorder proposals have been generated yet."
        accentColor={CRM_ACCENT}
      />
    );
  }

  const columns: { header: string; accessor: string | ((row: Record<string, unknown>) => string); sortable?: boolean; render?: (row: Record<string, unknown>) => React.ReactNode }[] = [
    {
      header: 'Account',
      accessor: 'accountName' as const,
      sortable: true,
      render: (row) => (
        <span className="font-medium text-text-bright">{row.accountName as string}</span>
      ),
    },
    {
      header: 'Products',
      accessor: ((row: Record<string, unknown>) => {
        const products = row.proposedProducts as ReorderProposal['proposedProducts'];
        return `${products.length} items — ${products[0]?.name || ''}`;
      }) as (row: Record<string, unknown>) => string,
      render: (row) => {
        const products = row.proposedProducts as ReorderProposal['proposedProducts'];
        return (
          <div>
            <span className="text-text-default">{products.length} items</span>
            <div className="truncate text-xs text-text-muted">{products[0]?.name}</div>
          </div>
        );
      },
    },
    {
      header: 'Value',
      accessor: 'totalValue' as const,
      sortable: true,
      render: (row) => (
        <span className="font-medium text-text-bright">{formatCurrency(row.totalValue as number)}</span>
      ),
    },
    {
      header: 'Confidence',
      accessor: 'confidence' as const,
      sortable: true,
      render: (row) => {
        const conf = row.confidence as number;
        const color = conf >= 80 ? 'var(--success)' : conf >= 60 ? 'var(--warning)' : 'var(--danger)';
        return (
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-16 overflow-hidden rounded-full bg-elevated">
              <div className="h-full rounded-full" style={{ width: `${conf}%`, backgroundColor: color }} />
            </div>
            <span style={{ color }} className="text-xs font-semibold">{conf}%</span>
          </div>
        );
      },
    },
    {
      header: 'Source',
      accessor: 'source' as const,
      render: (row) => (
        <StatusBadge variant={sourceVariant(row.source as string)} label={(row.source as string).replace(/-/g, ' ')} size="sm" />
      ),
    },
    {
      header: 'Days',
      accessor: 'daysSinceLastOrder' as const,
      sortable: true,
    },
    {
      header: 'Status',
      accessor: 'status' as const,
      render: (row) => (
        <StatusBadge variant={statusVariant(row.status as string)} label={row.status as string} size="sm" />
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Metrics */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Pending Review" value={String(metrics.pendingCount)} accentColor={CRM_ACCENT} />
        <MetricCard label="Total Proposal Value" value={formatCurrency(metrics.totalValue)} accentColor="#3B82F6" />
        <MetricCard label="Avg Confidence" value={`${metrics.avgConf}%`} accentColor="#8B5CF6" />
        <MetricCard label="Acceptance Rate" value={`${metrics.acceptRate}%`} accentColor="#22C55E" />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
          className="rounded-lg border border-default bg-card px-3 py-1.5 text-sm text-text-default outline-none"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="sent">Sent</option>
          <option value="ordered">Ordered</option>
          <option value="rejected">Rejected</option>
        </select>
        <select
          value={filterSource}
          onChange={(e) => setFilterSource(e.target.value as FilterSource)}
          className="rounded-lg border border-default bg-card px-3 py-1.5 text-sm text-text-default outline-none"
        >
          <option value="all">All Sources</option>
          <option value="vmi-velocity">VMI Velocity</option>
          <option value="cadence-analysis">Cadence Analysis</option>
          <option value="manual">Manual</option>
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortField)}
          className="rounded-lg border border-default bg-card px-3 py-1.5 text-sm text-text-default outline-none"
        >
          <option value="confidence">Sort: Confidence</option>
          <option value="totalValue">Sort: Value</option>
          <option value="daysSinceLastOrder">Sort: Urgency</option>
        </select>
      </div>

      {/* Data table */}
      <DataTable
        data={filtered as unknown as Record<string, unknown>[]}
        columns={columns}
        onRowClick={(row) => setSelectedProposal(row as unknown as ReorderProposal)}
        searchable
        searchPlaceholder="Search proposals..."
      />

      {/* Detail drawer */}
      <ReorderProposalDrawer
        proposal={selectedProposal}
        open={!!selectedProposal}
        onClose={() => setSelectedProposal(null)}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
}
