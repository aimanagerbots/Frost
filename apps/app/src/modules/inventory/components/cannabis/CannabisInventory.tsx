'use client';

import { useState } from 'react';
import { Warehouse } from 'lucide-react';
import { DataTable, StatusBadge, DrawerPanel, LoadingSkeleton } from '@/components';
import { useCannabisInventory } from '@/modules/inventory/hooks';
import { InventoryFilterBar } from './InventoryFilterBar';
import type { CannabisInventoryItem, InventoryFilter, ReadinessState } from '@/modules/inventory/types';

const ACCENT = '#8B5CF6';

const COA_VARIANT: Record<string, 'muted' | 'info' | 'warning' | 'success' | 'danger'> = {
  'not-tested': 'muted',
  pending: 'warning',
  passed: 'success',
  failed: 'danger',
};

const STATE_VARIANT: Record<string, 'info' | 'success' | 'warning' | 'muted'> = {
  growing: 'info', harvested: 'info', dried: 'info',
  bucked: 'info', trimmed: 'info', 'bulk-ready': 'warning',
  'coa-pending': 'warning', 'coa-passed': 'success',
  packaged: 'success', fulfilled: 'success', delivered: 'muted',
};

interface CannabisInventoryProps {
  initialState?: ReadinessState;
}

export function CannabisInventory({ initialState }: CannabisInventoryProps) {
  const [filters, setFilters] = useState<InventoryFilter>(
    initialState ? { readinessState: initialState } : {}
  );
  const [selected, setSelected] = useState<CannabisInventoryItem | null>(null);
  const { data: items, isLoading } = useCannabisInventory(filters);

  if (isLoading) return <LoadingSkeleton variant="table" />;

  const columns = [
    { header: 'SKU', accessor: 'sku' as const, sortable: true, hideBelow: 'lg' as const, render: (r: CannabisInventoryItem) => <span className="font-mono text-[11px] text-text-muted">{r.sku}</span> },
    { header: 'Product', accessor: 'productName' as const, sortable: true, render: (r: CannabisInventoryItem) => <span className="text-sm font-medium text-text-bright">{r.productName}</span> },
    { header: 'Category', accessor: 'category' as const, sortable: true, render: (r: CannabisInventoryItem) => <span className="rounded-full bg-elevated px-2 py-0.5 text-[10px] text-text-muted capitalize">{r.category}</span> },
    { header: 'Strain', accessor: 'strain' as const, sortable: true, hideBelow: 'lg' as const },
    { header: 'THC%', accessor: 'thc' as const, sortable: true, hideBelow: 'md' as const, render: (r: CannabisInventoryItem) => <span className="text-text-muted">{r.thc > 0 ? `${r.thc}%` : '—'}</span> },
    { header: 'CBD%', accessor: 'cbd' as const, sortable: true, hideBelow: 'lg' as const, render: (r: CannabisInventoryItem) => <span className="text-text-muted">{r.cbd > 0 ? `${r.cbd}%` : '—'}</span> },
    { header: 'State', accessor: 'readinessState' as const, sortable: true, render: (r: CannabisInventoryItem) => <StatusBadge variant={STATE_VARIANT[r.readinessState] ?? 'info'} label={r.readinessState.replace(/-/g, ' ')} size="sm" /> },
    { header: 'Qty', accessor: 'quantity' as const, sortable: true, render: (r: CannabisInventoryItem) => <span>{r.quantity.toLocaleString()} {r.unit}</span> },
    { header: 'Pkg Size', accessor: 'packageSize' as const, sortable: false, hideBelow: 'lg' as const, render: (r: CannabisInventoryItem) => <span className="text-text-muted text-xs">{r.packageSize ?? '—'}</span> },
    { header: 'Batch', accessor: 'batchNumber' as const, sortable: true, hideBelow: 'lg' as const, render: (r: CannabisInventoryItem) => <span className="font-mono text-[11px] text-text-muted">{r.batchNumber}</span> },
    { header: 'COA', accessor: 'coaStatus' as const, sortable: true, hideBelow: 'md' as const, render: (r: CannabisInventoryItem) => <StatusBadge variant={COA_VARIANT[r.coaStatus]} label={r.coaStatus.replace(/-/g, ' ')} size="sm" /> },
    { header: 'Location', accessor: 'location' as const, sortable: true, hideBelow: 'lg' as const },
  ];

  return (
    <div className="space-y-4">
      <InventoryFilterBar filters={filters} onFilterChange={setFilters} />

      <DataTable<CannabisInventoryItem>
        data={items ?? []}
        columns={columns}
        searchable
        searchPlaceholder="Search inventory..."
        onRowClick={setSelected}
        pageSize={20}
        emptyState={{ icon: Warehouse, title: 'No items found', description: 'Try adjusting your filters.', accentColor: ACCENT }}
      />

      {/* Detail Drawer */}
      <DrawerPanel open={!!selected} onClose={() => setSelected(null)} title={selected?.productName ?? ''} width="md">
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Detail label="SKU" value={selected.sku} />
              <Detail label="Batch" value={selected.batchNumber} />
              <Detail label="Category" value={selected.category} />
              <Detail label="Strain" value={selected.strain} />
              <Detail label="Type" value={selected.strainType} />
              <Detail label="Brand" value={selected.brand} />
              <Detail label="Package Size" value={selected.packageSize ?? '—'} />
              <Detail label="Location" value={selected.location} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Detail label="THC%" value={selected.thc > 0 ? `${selected.thc}%` : '—'} />
              <Detail label="CBD%" value={selected.cbd > 0 ? `${selected.cbd}%` : '—'} />
              <Detail label="Quantity" value={`${selected.quantity.toLocaleString()} ${selected.unit}`} />
              <Detail label="Value" value={`$${selected.value.toLocaleString()}`} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[10px] text-text-muted">Readiness State</span>
                <div className="mt-0.5"><StatusBadge variant={STATE_VARIANT[selected.readinessState] ?? 'info'} label={selected.readinessState.replace(/-/g, ' ')} /></div>
              </div>
              <div>
                <span className="text-[10px] text-text-muted">COA Status</span>
                <div className="mt-0.5"><StatusBadge variant={COA_VARIANT[selected.coaStatus]} label={selected.coaStatus.replace(/-/g, ' ')} /></div>
              </div>
            </div>
            <Detail label="Last Updated" value={selected.lastUpdated} />
          </div>
        )}
      </DrawerPanel>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-[10px] text-text-muted">{label}</span>
      <p className="text-sm text-text-default">{value}</p>
    </div>
  );
}
