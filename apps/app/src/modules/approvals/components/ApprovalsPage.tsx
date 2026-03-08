'use client';

import { useState, useMemo } from 'react';
import { ShieldCheck, ChevronDown, ChevronUp, Eye } from 'lucide-react';
import {
  SectionHeader,
  MetricCard,
  StatusBadge,
  DataTable,
  LoadingSkeleton,
  ErrorState,
  EmptyState,
} from '@/components';
import { useApprovalRequests } from '../hooks/useApprovalRequests';
import type { ApprovalRequest } from '../types';
import { ACCENT as APPROVALS_ACCENT } from '@/design/colors';


const PRIORITY_VARIANT: Record<ApprovalRequest['priority'], 'danger' | 'warning' | 'info'> = {
  urgent: 'danger',
  normal: 'warning',
  low: 'info',
};

const STATUS_VARIANT: Record<ApprovalRequest['status'], 'warning' | 'success' | 'danger' | 'info'> = {
  pending: 'warning',
  approved: 'success',
  rejected: 'danger',
  modified: 'info',
};

const TYPE_LABELS: Record<ApprovalRequest['type'], string> = {
  email: 'Email',
  order: 'Order',
  'schedule-change': 'Schedule',
  'price-adjustment': 'Pricing',
  'task-assignment': 'Task',
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function getReviewTime(created: string, reviewed?: string): string {
  if (!reviewed) return '-';
  const diff = new Date(reviewed).getTime() - new Date(created).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 60) return `${mins}m`;
  return `${Math.round(mins / 60)}h ${mins % 60}m`;
}

export function ApprovalsPage() {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [agentFilter, setAgentFilter] = useState<string>('all');
  const [expandedPreview, setExpandedPreview] = useState<string | null>(null);
  const [localStatuses, setLocalStatuses] = useState<Record<string, ApprovalRequest['status']>>({});

  const { data: requests, isLoading, error, refetch } = useApprovalRequests();

  const filteredRequests = useMemo(() => {
    if (!requests) return [];
    return requests.filter((r) => {
      const effectiveStatus = localStatuses[r.id] ?? r.status;
      if (statusFilter !== 'all' && effectiveStatus !== statusFilter) return false;
      if (typeFilter !== 'all' && r.type !== typeFilter) return false;
      if (priorityFilter !== 'all' && r.priority !== priorityFilter) return false;
      if (agentFilter !== 'all' && r.agentId !== agentFilter) return false;
      return true;
    });
  }, [requests, statusFilter, typeFilter, priorityFilter, agentFilter, localStatuses]);

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <LoadingSkeleton variant="text" />
        <LoadingSkeleton variant="card" count={4} />
        <LoadingSkeleton variant="card" count={6} />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to load approvals"
        message={error.message}
        onRetry={refetch}
      />
    );
  }

  if (!requests?.length) {
    return (
      <div className="space-y-6 p-6">
        <SectionHeader
          icon={ShieldCheck}
          title="Approvals"
          subtitle="Review and approve AI agent actions"
          accentColor={APPROVALS_ACCENT}
        />
        <EmptyState
          icon={ShieldCheck}
          title="No approval requests"
          description="There are no pending or historical approval requests. Requests will appear here when agents propose actions."
          accentColor={APPROVALS_ACCENT}
        />
      </div>
    );
  }

  const allWithLocal = (requests ?? []).map((r) => ({
    ...r,
    status: localStatuses[r.id] ?? r.status,
  }));

  const pendingCount = allWithLocal.filter((r) => r.status === 'pending').length;
  const approvedToday = allWithLocal.filter(
    (r) => r.status === 'approved' && r.reviewedAt?.startsWith('2026-03-07')
  ).length;
  const rejectedToday = allWithLocal.filter(
    (r) => r.status === 'rejected' && r.reviewedAt?.startsWith('2026-03-07')
  ).length;

  const reviewedItems = allWithLocal.filter((r) => r.reviewedAt);
  const avgReviewMins =
    reviewedItems.length > 0
      ? Math.round(
          reviewedItems.reduce((sum, r) => {
            const diff =
              new Date(r.reviewedAt!).getTime() - new Date(r.createdAt).getTime();
            return sum + diff / 60000;
          }, 0) / reviewedItems.length
        )
      : 0;
  const avgReviewTime = avgReviewMins < 60 ? `${avgReviewMins}m` : `${Math.floor(avgReviewMins / 60)}h`;

  const pendingItems = filteredRequests
    .filter((r) => (localStatuses[r.id] ?? r.status) === 'pending')
    .map((r) => ({ ...r, status: localStatuses[r.id] ?? r.status }));

  const resolvedItems = filteredRequests
    .filter((r) => (localStatuses[r.id] ?? r.status) !== 'pending')
    .map((r) => ({ ...r, status: localStatuses[r.id] ?? r.status }));

  const handleApprove = (id: string) => {
    setLocalStatuses((prev) => ({ ...prev, [id]: 'approved' }));
  };

  const handleModify = (id: string) => {
    setLocalStatuses((prev) => ({ ...prev, [id]: 'modified' }));
  };

  const handleReject = (id: string) => {
    setLocalStatuses((prev) => ({ ...prev, [id]: 'rejected' }));
  };

  const uniqueAgents = Array.from(
    new Map((requests ?? []).map((r) => [r.agentId, r.agentName])).entries()
  );

  const historyColumns = [
    {
      header: 'Date',
      accessor: 'createdAt' as const,
      sortable: true,
      render: (row: ApprovalRequest) => (
        <span className="text-xs text-text-muted">{formatDate(row.createdAt)}</span>
      ),
    },
    {
      header: 'Agent',
      accessor: 'agentName' as const,
      render: (row: ApprovalRequest) => (
        <span className="text-sm text-text-default">{row.agentName.replace('Frost ', '')}</span>
      ),
    },
    {
      header: 'Type',
      accessor: 'type' as const,
      render: (row: ApprovalRequest) => (
        <StatusBadge label={TYPE_LABELS[row.type]} variant="default" size="sm" />
      ),
    },
    {
      header: 'Title',
      accessor: 'title' as const,
      render: (row: ApprovalRequest) => (
        <span className="text-sm text-text-default">{row.title}</span>
      ),
    },
    {
      header: 'Status',
      accessor: 'status' as const,
      render: (row: ApprovalRequest) => {
        const effectiveStatus = localStatuses[row.id] ?? row.status;
        return (
          <StatusBadge
            label={effectiveStatus.charAt(0).toUpperCase() + effectiveStatus.slice(1)}
            variant={STATUS_VARIANT[effectiveStatus]}
            size="sm"
          />
        );
      },
    },
    {
      header: 'Reviewer',
      accessor: 'reviewedBy' as const,
      render: (row: ApprovalRequest) => (
        <span className="text-sm text-text-muted">{row.reviewedBy ?? '-'}</span>
      ),
    },
    {
      header: 'Review Time',
      accessor: 'reviewedAt' as const,
      render: (row: ApprovalRequest) => (
        <span className="text-xs text-text-muted">
          {getReviewTime(row.createdAt, row.reviewedAt)}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6 p-6">
      <SectionHeader
        icon={ShieldCheck}
        title="Approvals"
        subtitle="Review and approve AI agent actions"
        accentColor={APPROVALS_ACCENT}
        stats={[
          { label: 'Pending', value: pendingCount },
          { label: 'Resolved', value: allWithLocal.length - pendingCount },
        ]}
      />

      {/* Metrics */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Pending"
          value={pendingCount}
          accentColor={pendingCount > 5 ? '#EF4444' : APPROVALS_ACCENT}
          trend={{
            value: pendingCount > 5 ? 15 : -10,
            direction: pendingCount > 5 ? 'up' : 'down',
          }}
        />
        <MetricCard
          label="Approved Today"
          value={approvedToday}
          accentColor="#5BB8E6"
          trend={{ value: 5, direction: 'up' }}
        />
        <MetricCard
          label="Rejected Today"
          value={rejectedToday}
          accentColor="#EF4444"
          trend={{ value: 0, direction: 'flat' }}
        />
        <MetricCard
          label="Avg Review Time"
          value={avgReviewTime}
          accentColor={APPROVALS_ACCENT}
          trend={{ value: -8, direction: 'down' }}
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-default bg-elevated px-3 py-2 text-sm text-text-default focus:outline-none focus:ring-1 focus:ring-[#5BB8E6]"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="modified">Modified</option>
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="rounded-lg border border-default bg-elevated px-3 py-2 text-sm text-text-default focus:outline-none focus:ring-1 focus:ring-[#5BB8E6]"
        >
          <option value="all">All Types</option>
          <option value="email">Email</option>
          <option value="order">Order</option>
          <option value="schedule-change">Schedule Change</option>
          <option value="price-adjustment">Price Adjustment</option>
          <option value="task-assignment">Task Assignment</option>
        </select>
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="rounded-lg border border-default bg-elevated px-3 py-2 text-sm text-text-default focus:outline-none focus:ring-1 focus:ring-[#5BB8E6]"
        >
          <option value="all">All Priority</option>
          <option value="urgent">Urgent</option>
          <option value="normal">Normal</option>
          <option value="low">Low</option>
        </select>
        <select
          value={agentFilter}
          onChange={(e) => setAgentFilter(e.target.value)}
          className="rounded-lg border border-default bg-elevated px-3 py-2 text-sm text-text-default focus:outline-none focus:ring-1 focus:ring-[#5BB8E6]"
        >
          <option value="all">All Agents</option>
          {uniqueAgents.map(([id, name]) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))}
        </select>
      </div>

      {/* Pending Queue */}
      {pendingItems.length > 0 && (
        <div>
          <h2 className="mb-4 text-lg font-semibold text-text-bright">
            Pending Queue ({pendingItems.length})
          </h2>
          <div className="space-y-3">
            {pendingItems.map((request) => (
              <div
                key={request.id}
                className="rounded-xl border border-default bg-card p-4 transition-colors hover:bg-accent-hover"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge
                        label={request.agentName.replace('Frost ', '')}
                        variant="info"
                        size="sm"
                      />
                      <StatusBadge
                        label={TYPE_LABELS[request.type]}
                        variant="default"
                        size="sm"
                      />
                      <StatusBadge
                        label={request.priority.charAt(0).toUpperCase() + request.priority.slice(1)}
                        variant={PRIORITY_VARIANT[request.priority]}
                        size="sm"
                      />
                    </div>
                    <h3 className="mt-2 text-sm font-semibold text-text-bright">
                      {request.title}
                    </h3>
                    <p className="mt-1 text-xs text-text-muted">{request.description}</p>
                    <div className="mt-2 flex items-center gap-3 text-xs text-text-muted">
                      <span>Target: {request.target}</span>
                      <span>{formatDate(request.createdAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Preview Toggle */}
                <button
                  onClick={() =>
                    setExpandedPreview(
                      expandedPreview === request.id ? null : request.id
                    )
                  }
                  className="mt-3 flex items-center gap-1 text-xs font-medium text-text-muted transition-colors hover:text-text-default"
                >
                  <Eye className="h-3.5 w-3.5" />
                  {expandedPreview === request.id ? 'Hide' : 'Show'} Preview
                  {expandedPreview === request.id ? (
                    <ChevronUp className="h-3 w-3" />
                  ) : (
                    <ChevronDown className="h-3 w-3" />
                  )}
                </button>

                {expandedPreview === request.id && (
                  <div className="mt-2 rounded-lg bg-elevated p-3">
                    <pre className="whitespace-pre-wrap text-xs leading-relaxed text-text-default">
                      {request.preview}
                    </pre>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="mt-3 flex items-center gap-2 border-t border-default pt-3">
                  <button
                    onClick={() => handleApprove(request.id)}
                    className="rounded-lg bg-success/20 px-3 py-1.5 text-xs font-medium text-success transition-colors hover:bg-success/30"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleModify(request.id)}
                    className="rounded-lg bg-warning/20 px-3 py-1.5 text-xs font-medium text-warning transition-colors hover:bg-warning/30"
                  >
                    Modify
                  </button>
                  <button
                    onClick={() => handleReject(request.id)}
                    className="rounded-lg bg-danger/20 px-3 py-1.5 text-xs font-medium text-danger transition-colors hover:bg-danger/30"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* History */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-text-bright">History</h2>
        <DataTable
          data={resolvedItems}
          columns={historyColumns}
          searchable
          searchPlaceholder="Search resolved approvals..."
          pageSize={10}
          emptyState={{
            title: 'No resolved approvals',
            description: 'Resolved approvals will appear here.',
            accentColor: APPROVALS_ACCENT,
          }}
        />
      </div>
    </div>
  );
}
