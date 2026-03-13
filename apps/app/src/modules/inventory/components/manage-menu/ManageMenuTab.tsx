'use client';

import { useState } from 'react';
import { useManageMenu } from '@/modules/inventory/hooks';
import { LoadingSkeleton } from '@/components';
import { InvStatusBadge } from '../InventoryStatusBadge';
import type { ManageMenuFilterTab } from '@/modules/inventory/types';

const ACCENT = '#8B5CF6';

const FILTER_TABS: { id: ManageMenuFilterTab; label: string }[] = [
  { id: 'all',                  label: 'All' },
  { id: 'available-for-sale',   label: 'Avail. For Sale' },
  { id: 'not-for-sale',         label: 'Not For Sale' },
  { id: 'available-on-portal',  label: 'Avail. On Retail Portal' },
  { id: 'more-categories',      label: 'More Categories' },
  { id: 'active',               label: 'Active' },
  { id: 'discontinued',         label: 'Discontinued' },
];

const COLUMNS = [
  'Product Name', 'Status', 'Price', 'Units For Sale', 'Units Allocated',
  'Units On Backorder', 'Units On Hold', 'Units In Stock', 'Last Adjusted',
];

export function ManageMenuTab() {
  const [activeTab, setActiveTab] = useState<ManageMenuFilterTab>('all');
  const { data: rows, isLoading } = useManageMenu(activeTab);

  if (isLoading) return <LoadingSkeleton variant="table" />;

  return (
    <div className="space-y-3">
      <div className="flex gap-1 overflow-x-auto rounded-lg border border-default bg-base p-1 scrollbar-none">
        {FILTER_TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="whitespace-nowrap rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors"
            style={
              activeTab === tab.id
                ? { backgroundColor: ACCENT + '20', color: ACCENT }
                : { color: 'var(--color-text-muted)' }
            }
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-lg bg-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-default">
                {COLUMNS.map(h => (
                  <th key={h} className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(rows ?? []).map(row => {
                const hasStock = row.totalInStock > 0;
                const isForSale = row.availableForSale > 0;
                return (
                  <tr
                    key={row.id}
                    className="border-b border-default transition-colors hover:bg-card-hover"
                    style={
                      !hasStock
                        ? { backgroundColor: 'rgba(239,68,68,0.04)' }
                        : isForSale
                        ? { backgroundColor: 'rgba(139,92,246,0.03)' }
                        : undefined
                    }
                  >
                    <td className="max-w-[260px] px-4 py-2 text-[13px] font-medium text-text-default">
                      <span className="line-clamp-1">{row.productName}</span>
                    </td>
                    <td className="px-4 py-2">
                      <InvStatusBadge status={row.status} />
                    </td>
                    <td className="px-4 py-2 text-right text-[13px] tabular-nums text-text-default">${row.unitPrice}</td>
                    <td className="px-4 py-2 text-right text-[13px] tabular-nums">
                      <span style={{ color: isForSale ? '#22c55e' : 'var(--color-text-muted)' }}>
                        {row.availableForSale}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-right text-[13px] tabular-nums text-text-default">{row.allocated}</td>
                    <td className="px-4 py-2 text-right text-[13px] tabular-nums">
                      <span style={{ color: row.unitsOnBackorder > 0 ? '#f59e0b' : 'var(--color-text-muted)' }}>
                        {row.unitsOnBackorder}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-right text-[13px] tabular-nums text-text-default">{row.onHold}</td>
                    <td className="px-4 py-2 text-right text-[13px] font-semibold tabular-nums text-text-default">{row.totalInStock}</td>
                    <td className="px-4 py-2 text-[13px] tabular-nums text-text-muted">{row.lastAdjusted}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {!rows?.length && (
          <div className="py-12 text-center text-sm text-text-muted">No products found.</div>
        )}
      </div>
    </div>
  );
}
