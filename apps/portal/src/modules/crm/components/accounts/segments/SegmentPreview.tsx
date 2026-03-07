'use client';

import { DataTable, StatusBadge } from '@/components';

function healthVariant(score: number): 'success' | 'info' | 'warning' | 'danger' {
  if (score >= 80) return 'success';
  if (score >= 60) return 'info';
  if (score >= 40) return 'warning';
  return 'danger';
}

interface PreviewAccount {
  id: string;
  name: string;
  health: number;
  revenue30d: number;
  city: string;
  [key: string]: unknown;
}

interface SegmentPreviewProps {
  accounts: PreviewAccount[];
  totalCount: number;
  totalRevenue: number;
}

export function SegmentPreview({ accounts, totalCount, totalRevenue }: SegmentPreviewProps) {
  const columns = [
    {
      header: 'Account',
      accessor: 'name' as const,
      sortable: true,
    },
    {
      header: 'City',
      accessor: 'city' as const,
      sortable: true,
    },
    {
      header: 'Health',
      accessor: 'health' as const,
      sortable: true,
      render: (row: PreviewAccount) => (
        <StatusBadge variant={healthVariant(row.health)} label={String(row.health)} size="sm" />
      ),
    },
    {
      header: '30-Day Revenue',
      accessor: 'revenue30d' as const,
      sortable: true,
      render: (row: PreviewAccount) => (
        <span className="tabular-nums">${row.revenue30d.toLocaleString()}</span>
      ),
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4 text-xs text-text-muted">
        <span>
          <span className="font-medium text-text-default">{totalCount}</span> accounts match
        </span>
        <span>
          Total revenue: <span className="font-medium text-text-default">${totalRevenue.toLocaleString()}</span>
        </span>
      </div>
      <DataTable
        data={accounts}
        columns={columns}
        pageSize={5}
        emptyState={{
          title: 'No accounts match',
          description: 'Adjust criteria to find matching accounts',
          accentColor: '#F59E0B',
        }}
      />
    </div>
  );
}
