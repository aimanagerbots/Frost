'use client';

import { Package } from 'lucide-react';
import { DataTable } from '@/components';
import type { CartLineItem } from '@/modules/sales/types';

const ACCENT = '#F59E0B';

interface CartLineItemsProps {
  lineItems: CartLineItem[];
}

type LineItemRow = CartLineItem & Record<string, unknown>;

const columns = [
  {
    header: 'Product',
    accessor: 'productName' as const,
    sortable: true,
    render: (row: LineItemRow) => (
      <span className="font-medium text-text-default">{row.productName}</span>
    ),
  },
  {
    header: 'Strain',
    accessor: 'strain' as const,
    sortable: true,
    hideBelow: 'md' as const,
  },
  {
    header: 'Qty',
    accessor: 'quantity' as const,
    sortable: true,
    render: (row: LineItemRow) => (
      <span className="tabular-nums">{row.quantity}</span>
    ),
  },
  {
    header: 'Unit Price',
    accessor: 'unitPrice' as const,
    sortable: true,
    hideBelow: 'sm' as const,
    render: (row: LineItemRow) => (
      <span className="tabular-nums">
        ${(row.unitPrice as number).toFixed(2)}
      </span>
    ),
  },
  {
    header: 'Line Total',
    accessor: 'lineTotal' as const,
    sortable: true,
    render: (row: LineItemRow) => (
      <span className="tabular-nums font-medium">
        ${(row.lineTotal as number).toLocaleString('en-US', { minimumFractionDigits: 2 })}
      </span>
    ),
  },
];

export function CartLineItems({ lineItems }: CartLineItemsProps) {
  return (
    <DataTable<LineItemRow>
      data={lineItems as LineItemRow[]}
      columns={columns}
      pageSize={20}
      emptyState={{
        icon: Package,
        title: 'No Line Items',
        description: 'This cart has no items yet.',
        accentColor: ACCENT,
      }}
    />
  );
}
