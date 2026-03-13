'use client';

import { DataTable, StatusBadge, LoadingSkeleton } from '@/components';
import { useLastOrderedByAccount } from '../hooks';
import type { LastOrderedRow, AgingStatus } from '../hooks';
import { AlertTriangle } from 'lucide-react';

const AGING_VARIANT: Record<AgingStatus, 'success' | 'info' | 'warning' | 'danger'> = {
  recent: 'success',
  normal: 'info',
  aging: 'warning',
  overdue: 'danger',
};

const AGING_LABEL: Record<AgingStatus, string> = {
  recent: 'Recent',
  normal: 'Normal',
  aging: 'Aging',
  overdue: 'Overdue',
};

const columns = [
  {
    header: 'Account Name',
    accessor: 'accountName' as const,
    sortable: true,
  },
  {
    header: 'Last Order Date',
    accessor: 'lastOrderDate' as const,
    sortable: true,
    hideBelow: 'md' as const,
  },
  {
    header: 'Days Since',
    accessor: 'daysSince' as const,
    sortable: true,
    render: (row: LastOrderedRow) => (
      <span className="font-mono text-text-bright">{row.daysSince}</span>
    ),
  },
  {
    header: 'Status',
    accessor: 'status' as const,
    sortable: true,
    render: (row: LastOrderedRow) => (
      <StatusBadge variant={AGING_VARIANT[row.status]} label={AGING_LABEL[row.status]} />
    ),
  },
  {
    header: 'Assigned Rep',
    accessor: 'assignedRep' as const,
    sortable: true,
    hideBelow: 'lg' as const,
  },
];

export function LastOrderedTable() {
  const { data, isLoading } = useLastOrderedByAccount();

  if (isLoading || !data) {
    return <LoadingSkeleton variant="table" />;
  }

  const overdueCount = data.filter((r) => r.status === 'overdue').length;

  return (
    <div className="space-y-3">
      {overdueCount > 0 && (
        <div className="flex items-center gap-2 rounded-lg bg-red-500/10 px-4 py-2.5 text-sm text-red-400">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>
            <strong>{overdueCount}</strong> account{overdueCount !== 1 ? 's' : ''} overdue (30+ days since last order)
          </span>
        </div>
      )}
      <DataTable
        data={data as unknown as Record<string, unknown>[]}
        columns={columns as Parameters<typeof DataTable>[0]['columns']}
        searchable
        searchPlaceholder="Search accounts..."
        pageSize={15}
      />
    </div>
  );
}
