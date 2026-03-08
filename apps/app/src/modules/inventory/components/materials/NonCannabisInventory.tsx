'use client';

import { Package } from 'lucide-react';
import { DataTable, StatusBadge, LoadingSkeleton } from '@/components';
import { useNonCannabisInventory } from '@/modules/inventory/hooks';
import type { NonCannabisItem } from '@/modules/inventory/types';

const statusVariant = (s: NonCannabisItem['status']) => {
  const map: Record<NonCannabisItem['status'], 'success' | 'warning' | 'danger' | 'info' | 'muted'> = {
    'in-stock': 'success', low: 'warning', critical: 'danger', 'on-order': 'info', 'out-of-stock': 'muted',
  };
  return map[s];
};

const columns = [
  { header: 'Item', accessor: 'name' as const, sortable: true, render: (r: NonCannabisItem) => <span className="text-sm font-medium text-text-bright">{r.name}</span> },
  { header: 'Category', accessor: 'category' as const, sortable: true, render: (r: NonCannabisItem) => <span className="capitalize text-text-muted text-xs">{r.category}</span> },
  { header: 'SKU', accessor: 'sku' as const, sortable: true, hideBelow: 'lg' as const, render: (r: NonCannabisItem) => <span className="font-mono text-[11px] text-text-muted">{r.sku}</span> },
  { header: 'Stock', accessor: 'currentStock' as const, sortable: true, render: (r: NonCannabisItem) => <span>{r.currentStock.toLocaleString()} {r.unit}</span> },
  { header: 'Reorder Pt', accessor: 'reorderPoint' as const, sortable: true, hideBelow: 'md' as const, render: (r: NonCannabisItem) => <span className="text-text-muted">{r.reorderPoint.toLocaleString()}</span> },
  { header: 'Reorder Qty', accessor: 'reorderQuantity' as const, sortable: true, hideBelow: 'lg' as const, render: (r: NonCannabisItem) => <span className="text-text-muted">{r.reorderQuantity.toLocaleString()}</span> },
  { header: 'Supplier', accessor: 'supplier' as const, sortable: true, hideBelow: 'md' as const },
  { header: 'Last Ordered', accessor: 'lastOrdered' as const, sortable: true, hideBelow: 'lg' as const },
  { header: 'Status', accessor: 'status' as const, sortable: true, render: (r: NonCannabisItem) => <StatusBadge variant={statusVariant(r.status)} label={r.status.replace(/-/g, ' ')} size="sm" /> },
  { header: 'Unit Cost', accessor: 'unitCost' as const, sortable: true, hideBelow: 'lg' as const, render: (r: NonCannabisItem) => <span className="text-text-muted">${r.unitCost.toFixed(2)}</span> },
  { header: 'Total Value', accessor: 'currentStock' as const, sortable: false, hideBelow: 'lg' as const, render: (r: NonCannabisItem) => <span className="font-medium text-text-bright">${(r.currentStock * r.unitCost).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span> },
];

export function NonCannabisInventory() {
  const { data: items, isLoading } = useNonCannabisInventory();

  if (isLoading) return <LoadingSkeleton variant="table" />;

  return (
    <DataTable<NonCannabisItem>
      data={items ?? []}
      columns={columns}
      searchable
      searchPlaceholder="Search materials..."
      pageSize={20}
      emptyState={{ icon: Package, title: 'No materials found', description: 'Non-cannabis materials will appear here.', accentColor: '#5BB8E6' }}
    />
  );
}
