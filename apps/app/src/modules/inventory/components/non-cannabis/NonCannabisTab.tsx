'use client';

import { useState } from 'react';
import { X, Save, Search } from 'lucide-react';
import { useNonCannabisInventory } from '@/modules/inventory/hooks';
import { LoadingSkeleton } from '@/components';
import { InvStatusBadge } from '../InventoryStatusBadge';

const ACCENT = '#8B5CF6';

const CATEGORY_TABS: { key: string; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'containers', label: 'Containers' },
  { key: 'labels', label: 'Labels' },
  { key: 'packaging', label: 'Packaging' },
  { key: 'other', label: 'Other' },
];

const inputCls = 'h-9 w-full rounded-lg border border-default bg-elevated px-3 text-[13px] text-text-default placeholder:text-text-muted focus:border-[#8B5CF6] focus:outline-none';
const selectCls = 'h-9 w-full appearance-none rounded-lg border border-default bg-elevated px-3 text-[13px] text-text-default focus:border-[#8B5CF6] focus:outline-none';

export function NonCannabisTab() {
  const { data: items, isLoading } = useNonCannabisInventory();
  const [categoryTab, setCategoryTab] = useState('all');
  const [search, setSearch] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [form, setForm] = useState({
    name: '', category: '', sku: '', currentStock: '', unit: '',
    reorderPoint: '', reorderQty: '', supplier: '', unitCost: '',
  });

  if (isLoading) return <LoadingSkeleton variant="table" />;

  const filtered = (items ?? []).filter(item => {
    if (categoryTab !== 'all' && item.category !== categoryTab) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!item.name.toLowerCase().includes(q) && !item.sku.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  return (
    <div className="space-y-3">
      {/* Action button row */}
      <div className="flex items-center justify-between">
        <p className="text-[13px] text-text-muted">{filtered.length} items</p>
        <button
          onClick={() => setDrawerOpen(true)}
          className="flex h-8 items-center gap-1.5 rounded-lg border px-3 text-[13px] font-medium hover:bg-card"
          style={{ borderColor: ACCENT, color: ACCENT }}
        >
          + Add Item
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1 overflow-x-auto rounded-lg border border-default bg-base p-1">
          {CATEGORY_TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setCategoryTab(tab.key)}
              className="rounded-md px-3 py-1.5 text-[13px] font-medium whitespace-nowrap transition-colors"
              style={categoryTab === tab.key
                ? { backgroundColor: ACCENT + '20', color: ACCENT }
                : { color: 'var(--color-text-muted)' }}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or SKU…"
              className="h-8 w-52 rounded-lg border border-default bg-elevated pl-8 pr-3 text-[13px] text-text-default placeholder:text-text-muted focus:border-[#8B5CF6] focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg bg-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-default">
                {['Item Name', 'Category', 'SKU', 'Current Stock', 'Unit', 'Reorder Point', 'Reorder Qty', 'Supplier', 'Unit Cost', 'Last Ordered', 'Status'].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-text-muted">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(item => {
                const belowReorder = item.currentStock < item.reorderPoint;
                return (
                  <tr
                    key={item.id}
                    className="border-b border-default transition-colors hover:bg-card-hover"
                    style={belowReorder ? { backgroundColor: 'rgba(239,68,68,0.04)' } : undefined}
                  >
                    <td className="px-4 py-2 text-[13px] font-medium text-text-default">{item.name}</td>
                    <td className="px-4 py-2 text-[13px] capitalize text-text-muted">{item.category}</td>
                    <td className="px-4 py-2 font-mono text-[13px] text-text-muted">{item.sku}</td>
                    <td className="px-4 py-2 text-right text-[13px] tabular-nums text-text-default">{item.currentStock.toLocaleString()}</td>
                    <td className="px-4 py-2 text-[13px] text-text-muted">{item.unit}</td>
                    <td className="px-4 py-2 text-right text-[13px] tabular-nums text-text-muted">{item.reorderPoint.toLocaleString()}</td>
                    <td className="px-4 py-2 text-right text-[13px] tabular-nums text-text-muted">{item.reorderQuantity.toLocaleString()}</td>
                    <td className="px-4 py-2 text-[13px] text-text-muted">{item.supplier}</td>
                    <td className="px-4 py-2 text-right text-[13px] tabular-nums text-text-muted">${item.unitCost.toFixed(2)}</td>
                    <td className="px-4 py-2 text-[13px] text-text-muted">{item.lastOrdered}</td>
                    <td className="px-4 py-2"><InvStatusBadge status={item.status} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {!filtered.length && (
          <div className="py-12 text-center text-sm text-text-muted">No non-cannabis items found.</div>
        )}
      </div>

      {/* Add Item Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
          <div className="flex h-full w-full max-w-md flex-col border-l border-default bg-card shadow-2xl">
            <div className="flex items-center justify-between border-b border-default px-6 py-4">
              <h3 className="text-sm font-semibold text-text-default">Add Non-Cannabis Item</h3>
              <button onClick={() => setDrawerOpen(false)} className="text-text-muted hover:text-text-default">
                <X size={16} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-xs text-text-muted">Name <span style={{ color: ACCENT }}>*</span></label>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Item name…" className={inputCls} />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-text-muted">Category <span style={{ color: ACCENT }}>*</span></label>
                  <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className={selectCls}>
                    <option value="">Select…</option>
                    <option value="containers">Containers</option>
                    <option value="labels">Labels</option>
                    <option value="packaging">Packaging</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs text-text-muted">SKU</label>
                  <input value={form.sku} onChange={e => setForm(f => ({ ...f, sku: e.target.value }))} placeholder="PKG-XXX" className={inputCls} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-xs text-text-muted">Current Stock</label>
                    <input type="number" value={form.currentStock} onChange={e => setForm(f => ({ ...f, currentStock: e.target.value }))} placeholder="0" className={inputCls} />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-text-muted">Unit</label>
                    <input value={form.unit} onChange={e => setForm(f => ({ ...f, unit: e.target.value }))} placeholder="units" className={inputCls} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-xs text-text-muted">Reorder Point</label>
                    <input type="number" value={form.reorderPoint} onChange={e => setForm(f => ({ ...f, reorderPoint: e.target.value }))} placeholder="0" className={inputCls} />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-text-muted">Reorder Qty</label>
                    <input type="number" value={form.reorderQty} onChange={e => setForm(f => ({ ...f, reorderQty: e.target.value }))} placeholder="0" className={inputCls} />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-xs text-text-muted">Supplier</label>
                  <input value={form.supplier} onChange={e => setForm(f => ({ ...f, supplier: e.target.value }))} placeholder="Supplier name…" className={inputCls} />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-text-muted">Unit Cost</label>
                  <input type="number" step="0.01" value={form.unitCost} onChange={e => setForm(f => ({ ...f, unitCost: e.target.value }))} placeholder="0.00" className={inputCls} />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 border-t border-default px-6 py-4">
              <button
                onClick={() => setDrawerOpen(false)}
                className="flex h-9 items-center gap-1.5 rounded-lg px-4 text-xs font-medium text-white"
                style={{ backgroundColor: ACCENT }}
              >
                <Save size={14} />
                Save Item
              </button>
              <button onClick={() => setDrawerOpen(false)} className="flex h-9 items-center gap-1.5 rounded-lg border border-default px-4 text-xs text-text-muted hover:text-text-default">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
