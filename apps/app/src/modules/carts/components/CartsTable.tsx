'use client';

import { ShoppingCart } from 'lucide-react';
import { DataTable, StatusBadge } from '@/components';
import { useCarts } from '../hooks';
import type { Cart } from '@/modules/sales/types';

const ACCENT = '#F59E0B';

interface CartsTableProps {
  onSelectCart: (cart: Cart) => void;
}

const columns = [
  {
    header: 'Cart Name',
    accessor: 'name' as const,
    sortable: true,
    render: (row: Cart) => (
      <span className="font-medium text-text-default">{row.name}</span>
    ),
  },
  {
    header: 'Client',
    accessor: 'clientName' as const,
    sortable: true,
  },
  {
    header: 'Items',
    accessor: 'itemCount' as const,
    sortable: true,
    hideBelow: 'md' as const,
    render: (row: Cart) => (
      <span className="tabular-nums">{row.itemCount}</span>
    ),
  },
  {
    header: 'Total',
    accessor: 'total' as const,
    sortable: true,
    hideBelow: 'sm' as const,
    render: (row: Cart) => (
      <span className="tabular-nums font-medium">
        ${row.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
      </span>
    ),
  },
  {
    header: 'Status',
    accessor: 'status' as const,
    sortable: true,
    render: (row: Cart) => <StatusBadge status={row.status} />,
  },
];

export function CartsTable({ onSelectCart }: CartsTableProps) {
  const { data: carts = [], isLoading } = useCarts();

  return (
    <DataTable<Cart & Record<string, unknown>>
      data={carts as (Cart & Record<string, unknown>)[]}
      columns={columns as Parameters<typeof DataTable<Cart & Record<string, unknown>>>[0]['columns']}
      searchable
      searchPlaceholder="Search carts..."
      onRowClick={(row) => onSelectCart(row as unknown as Cart)}
      loading={isLoading}
      pageSize={20}
      emptyState={{
        icon: ShoppingCart,
        title: 'No Open Carts',
        description: 'There are no active carts right now.',
        accentColor: ACCENT,
      }}
    />
  );
}
