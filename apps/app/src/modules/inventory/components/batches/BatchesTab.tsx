'use client';

import { useState } from 'react';
import { Search, ChevronDown, Download, Archive, Camera } from 'lucide-react';
import { useBatches } from '@/modules/inventory/hooks';
import { LoadingSkeleton } from '@/components';
import { InvStatusBadge } from '../InventoryStatusBadge';
import type { BatchFilterTab } from '@/modules/inventory/types';

const ACCENT = '#8B5CF6';

const FILTER_TABS: { id: BatchFilterTab; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'available-for-sale', label: 'Available For Sale' },
  { id: 'not-for-sale', label: 'Not For Sale' },
  { id: 'excluded', label: 'Excluded' },
];

export function BatchesTab() {
  const [activeTab, setActiveTab] = useState<BatchFilterTab>('all');
  const [productFilter, setProductFilter] = useState('');
  const [barcodeFilter, setBarcodeFilter] = useState('');
  const { data: batches, isLoading } = useBatches(activeTab);

  if (isLoading) return <LoadingSkeleton variant="table" />;

  // Client-side filtering for text inputs
  const filtered = (batches ?? []).filter(b => {
    if (productFilter && !b.productName.toLowerCase().includes(productFilter.toLowerCase())) return false;
    if (barcodeFilter && !b.barcode.toLowerCase().includes(barcodeFilter.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-3">
      {/* Action buttons row */}
      <div className="flex items-center justify-end gap-2">
        <button className="flex h-8 items-center gap-1.5 rounded-lg border px-3 text-[13px] hover:bg-card" style={{ borderColor: ACCENT, color: ACCENT }}>
          <Download size={13} />
          Export Batches
        </button>
        <button className="flex h-8 items-center gap-1.5 rounded-lg border px-3 text-[13px] hover:bg-card" style={{ borderColor: ACCENT, color: ACCENT }}>
          <Archive size={13} />
          Depleted
        </button>
        <button className="flex h-8 w-8 items-center justify-center rounded-lg border hover:bg-card" style={{ borderColor: ACCENT, color: ACCENT }}>
          <Camera size={13} />
        </button>
      </div>

      {/* Filter tabs */}
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

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Filter Products text input */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-muted" />
          <input
            value={productFilter}
            onChange={e => setProductFilter(e.target.value)}
            placeholder="Filter Products…"
            className="h-8 w-44 rounded-lg border border-default bg-card pl-8 pr-3 text-[13px] text-text-default placeholder:text-text-muted focus:border-[#8B5CF6] focus:outline-none"
          />
        </div>

        {/* Filter Barcodes text input */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-muted" />
          <input
            value={barcodeFilter}
            onChange={e => setBarcodeFilter(e.target.value)}
            placeholder="Filter Barcodes…"
            className="h-8 w-44 rounded-lg border border-default bg-card pl-8 pr-3 text-[13px] text-text-default placeholder:text-text-muted focus:border-[#8B5CF6] focus:outline-none"
          />
        </div>

        {/* Locations/Licenses dropdown */}
        <button className="flex h-8 items-center gap-1.5 rounded-lg border border-default bg-card px-3 text-[13px] text-text-muted hover:text-text-default">
          Locations/Licenses
          <ChevronDown size={13} />
        </button>

        {/* Rooms dropdown */}
        <button className="flex h-8 items-center gap-1.5 rounded-lg border border-default bg-card px-3 text-[13px] text-text-muted hover:text-text-default">
          Rooms
          <ChevronDown size={13} />
        </button>
      </div>

      <div className="overflow-hidden rounded-lg bg-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-default">
                {['Barcode', 'Product', 'Room', 'Batch Date', 'QA Status', 'For Sale', 'On Hold', 'Allocated', 'In Stock', 'Status'].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(b => (
                <tr key={b.id} className="border-b border-default transition-colors hover:bg-card-hover">
                  <td className="px-4 py-2 font-mono text-[13px] text-text-muted">{b.barcode}</td>
                  <td className="max-w-[220px] px-4 py-2 text-[13px] font-medium text-text-default">
                    <span className="line-clamp-1">{b.productName}</span>
                  </td>
                  <td className="px-4 py-2 text-[13px] text-text-muted">{b.room}</td>
                  <td className="px-4 py-2 text-[13px] text-text-muted">{b.batchDate}</td>
                  <td className="px-4 py-2">
                    {b.qaStatus
                      ? <InvStatusBadge status={b.qaStatus} />
                      : <span className="text-[13px] text-text-muted">—</span>}
                  </td>
                  <td className="px-4 py-2 text-right text-[13px] tabular-nums text-text-default">{b.unitsForSale}</td>
                  <td className="px-4 py-2 text-right text-[13px] tabular-nums text-text-default">{b.unitsOnHold}</td>
                  <td className="px-4 py-2 text-right text-[13px] tabular-nums text-text-default">{b.unitsAllocated}</td>
                  <td className="px-4 py-2 text-right text-[13px] font-semibold tabular-nums text-text-default">{b.unitsInStock}</td>
                  <td className="px-4 py-2">
                    <InvStatusBadge status={b.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!filtered.length && (
          <div className="py-12 text-center text-[13px] text-text-muted">No batches found.</div>
        )}
      </div>
    </div>
  );
}
