'use client';

import { Package } from 'lucide-react';
import { DataTable, StatusBadge } from '@/components';
import { useNonCannabisInventory } from '../hooks';
import type { NonCannabisInventory } from '../types';

const ACCENT = '#84CC16';

const STATUS_VARIANT: Record<string, 'success' | 'warning' | 'danger' | 'muted'> = {
  'in-stock': 'success',
  low: 'warning',
  critical: 'danger',
  'out-of-stock': 'muted',
};

type InvRow = NonCannabisInventory & Record<string, unknown>;

const columns = [
  {
    header: 'Material',
    accessor: 'name' as const,
    sortable: true,
    render: (row: InvRow) => <span className="font-medium text-text-bright">{row.name}</span>,
  },
  {
    header: 'Type',
    accessor: 'type' as const,
    sortable: true,
    render: (row: InvRow) => (
      <span className="inline-flex items-center rounded-full bg-elevated px-2 py-0.5 text-xs text-text-muted">
        {row.type}
      </span>
    ),
  },
  {
    header: 'Size',
    accessor: 'size' as const,
    sortable: true,
  },
  {
    header: 'Stock',
    accessor: 'currentStock' as const,
    sortable: true,
    render: (row: InvRow) => (
      <span className={row.status === 'critical' || row.status === 'out-of-stock' ? 'text-danger font-medium' : row.status === 'low' ? 'text-warning' : 'text-text-default'}>
        {row.currentStock.toLocaleString()}
      </span>
    ),
  },
  {
    header: 'Reorder At',
    accessor: 'reorderPoint' as const,
    sortable: true,
  },
  {
    header: 'Status',
    accessor: 'status' as const,
    sortable: true,
    render: (row: InvRow) => (
      <StatusBadge variant={STATUS_VARIANT[row.status] ?? 'default'} label={row.status} size="sm" />
    ),
  },
  {
    header: 'Cost/Unit',
    accessor: 'costPerUnit' as const,
    sortable: true,
    render: (row: InvRow) => <span>${row.costPerUnit.toFixed(2)}</span>,
  },
  {
    header: 'Supplier',
    accessor: 'supplier' as const,
    sortable: true,
  },
];

export function MaterialsInventory() {
  const { data: inventory, isLoading } = useNonCannabisInventory();

  // Sort critical/out-of-stock first
  const sorted = [...(inventory ?? [])].sort((a, b) => {
    const order = { 'out-of-stock': 0, critical: 1, low: 2, 'in-stock': 3 };
    return (order[a.status] ?? 4) - (order[b.status] ?? 4);
  });

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold text-text-bright">Non-Cannabis Inventory</h2>
      <DataTable<InvRow>
        data={sorted as InvRow[]}
        columns={columns}
        searchable
        searchPlaceholder="Search materials..."
        loading={isLoading}
        pageSize={10}
        emptyState={{
          icon: Package,
          title: 'No inventory items',
          description: 'Non-cannabis inventory will appear here.',
          accentColor: ACCENT,
        }}
      />
    </div>
  );
}
