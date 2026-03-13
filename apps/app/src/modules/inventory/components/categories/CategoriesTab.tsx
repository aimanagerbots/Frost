'use client';

import { useState } from 'react';
import { X, Save, Pencil, Plus } from 'lucide-react';
import { useInventoryCategories } from '@/modules/inventory/hooks';
import { LoadingSkeleton } from '@/components';
import { INVENTORY_TYPE_LABELS } from '@/modules/inventory/types';
import type { InventoryTypeCode } from '@/modules/inventory/types';

const ACCENT = '#8B5CF6';
const inputCls = 'h-9 w-full rounded-lg border border-default bg-elevated px-3 text-[13px] text-text-default placeholder:text-text-muted focus:border-[#8B5CF6] focus:outline-none';
const selectCls = 'h-9 w-full appearance-none rounded-lg border border-default bg-elevated px-3 text-[13px] text-text-default focus:border-[#8B5CF6] focus:outline-none';

const INVENTORY_TYPE_OPTIONS = Object.entries(INVENTORY_TYPE_LABELS).map(([code, label]) => ({
  value: Number(code) as InventoryTypeCode,
  label: `${code} — ${label}`,
}));

export function CategoriesTab() {
  const { data: categories, isLoading } = useInventoryCategories();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [form, setForm] = useState({ name: '', inventoryType: '' as string });

  if (isLoading) return <LoadingSkeleton variant="table" />;

  const items = categories ?? [];

  const startEdit = (id: string, name: string) => {
    setEditingId(id);
    setEditName(name);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName('');
  };

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <p className="text-[13px] text-text-muted">{items.length} categories</p>
        <button
          onClick={() => { setForm({ name: '', inventoryType: '' }); setDrawerOpen(true); }}
          className="flex h-8 items-center gap-1.5 rounded-lg border px-3 text-[13px] font-medium hover:bg-card"
          style={{ borderColor: ACCENT, color: ACCENT }}
        >
          <Plus size={14} />
          Add Category
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg bg-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-default">
                {['Category', 'Inventory Type', 'Active Products', ''].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-text-muted">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map(cat => {
                const isEditing = editingId === cat.id;
                return (
                  <tr key={cat.id} className="border-b border-default transition-colors hover:bg-card-hover">
                    <td className="px-4 py-2">
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <input
                            value={editName}
                            onChange={e => setEditName(e.target.value)}
                            className={inputCls}
                            style={{ maxWidth: 180 }}
                            autoFocus
                            onKeyDown={e => { if (e.key === 'Escape') cancelEdit(); }}
                          />
                          <button onClick={cancelEdit} className="text-text-muted hover:text-text-default"><X size={13} /></button>
                          <button onClick={cancelEdit} className="text-[13px] font-medium" style={{ color: ACCENT }}>Save</button>
                        </div>
                      ) : (
                        <span className="text-[13px] font-medium text-text-default">{cat.name}</span>
                      )}
                    </td>
                    <td className="px-4 py-2 text-[13px] text-text-muted">
                      <span className="mr-2 font-mono text-text-muted/60">{cat.inventoryType}</span>
                      {INVENTORY_TYPE_LABELS[cat.inventoryType]}
                    </td>
                    <td className="px-4 py-2 text-[13px] tabular-nums text-text-default">{cat.activeProducts}</td>
                    <td className="px-4 py-2 text-right">
                      <button onClick={() => startEdit(cat.id, cat.name)} className="text-text-muted hover:text-text-default" title="Edit">
                        <Pencil size={13} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {!items.length && (
          <div className="py-12 text-center text-sm text-text-muted">No categories found.</div>
        )}
      </div>

      {/* Add Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
          <div className="flex h-full w-full max-w-md flex-col border-l border-default bg-card shadow-2xl">
            <div className="flex items-center justify-between border-b border-default px-6 py-4">
              <h3 className="text-sm font-semibold text-text-default">Add Category</h3>
              <button onClick={() => setDrawerOpen(false)} className="text-text-muted hover:text-text-default">
                <X size={16} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-xs text-text-muted">Category Name <span style={{ color: ACCENT }}>*</span></label>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Flower" className={inputCls} />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-text-muted">Inventory Type <span style={{ color: ACCENT }}>*</span></label>
                  <select value={form.inventoryType} onChange={e => setForm(f => ({ ...f, inventoryType: e.target.value }))} className={selectCls}>
                    <option value="">Select METRC type…</option>
                    {INVENTORY_TYPE_OPTIONS.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
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
                Save Category
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
