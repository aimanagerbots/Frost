'use client';

import { useState } from 'react';
import { X, Save, Plus } from 'lucide-react';
import { useCatalogGroups } from '@/modules/inventory/hooks';
import { LoadingSkeleton } from '@/components';

const ACCENT = '#8B5CF6';
const inputCls = 'h-9 w-full rounded-lg border border-default bg-elevated px-3 text-[13px] text-text-default placeholder:text-text-muted focus:border-[#8B5CF6] focus:outline-none';

export function CatalogGroupsTab() {
  const { data: groups, isLoading } = useCatalogGroups();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toggledIds, setToggledIds] = useState<Set<string>>(new Set());
  const [form, setForm] = useState({ groupName: '', catalogName: '', active: true });

  if (isLoading) return <LoadingSkeleton variant="table" />;

  const items = groups ?? [];

  const isActive = (g: { id: string; active: boolean }) =>
    toggledIds.has(g.id) ? !g.active : g.active;

  const toggleActive = (id: string) => {
    setToggledIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <p className="text-[13px] text-text-muted">{items.length} catalog groups</p>
        <button
          onClick={() => { setForm({ groupName: '', catalogName: '', active: true }); setDrawerOpen(true); }}
          className="flex h-8 items-center gap-1.5 rounded-lg border px-3 text-[13px] font-medium hover:bg-card"
          style={{ borderColor: ACCENT, color: ACCENT }}
        >
          <Plus size={14} />
          Add Group
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg bg-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-default">
                {['Group Name', 'Catalog Name', 'Products', 'Active', ''].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-text-muted">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map(g => {
                const active = isActive(g);
                return (
                  <tr key={g.id} className="border-b border-default transition-colors hover:bg-card-hover">
                    <td className="px-4 py-2 text-[13px] font-medium text-text-default">{g.groupName}</td>
                    <td className="px-4 py-2 text-[13px] text-text-muted">{g.catalogName}</td>
                    <td className="px-4 py-2 text-[13px] tabular-nums text-text-default">{g.productCount}</td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => toggleActive(g.id)}
                        className="rounded-full px-2 py-0.5 text-[11px] font-medium transition-colors"
                        style={active
                          ? { backgroundColor: '#22c55e20', color: '#22c55e' }
                          : { backgroundColor: 'rgba(255,255,255,0.06)', color: 'var(--color-text-muted)' }}
                      >
                        {active ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-4 py-2 text-right">
                      <button className="text-[11px] text-text-muted hover:text-text-default">Edit</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {!items.length && (
          <div className="py-12 text-center text-sm text-text-muted">No catalog groups found.</div>
        )}
      </div>

      {/* Add Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
          <div className="flex h-full w-full max-w-md flex-col border-l border-default bg-card shadow-2xl">
            <div className="flex items-center justify-between border-b border-default px-6 py-4">
              <h3 className="text-sm font-semibold text-text-default">Add Catalog Group</h3>
              <button onClick={() => setDrawerOpen(false)} className="text-text-muted hover:text-text-default">
                <X size={16} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-xs text-text-muted">Group Name <span style={{ color: ACCENT }}>*</span></label>
                  <input value={form.groupName} onChange={e => setForm(f => ({ ...f, groupName: e.target.value }))} placeholder="e.g. Retail Catalog" className={inputCls} />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-text-muted">Catalog Name <span style={{ color: ACCENT }}>*</span></label>
                  <input value={form.catalogName} onChange={e => setForm(f => ({ ...f, catalogName: e.target.value }))} placeholder="e.g. Main Retail" className={inputCls} />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="active-check"
                    checked={form.active}
                    onChange={e => setForm(f => ({ ...f, active: e.target.checked }))}
                    className="h-4 w-4 rounded border-default accent-[#8B5CF6]"
                  />
                  <label htmlFor="active-check" className="text-xs text-text-default">Active</label>
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
                Save Group
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
