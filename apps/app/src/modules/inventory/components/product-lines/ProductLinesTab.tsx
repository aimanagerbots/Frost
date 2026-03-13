'use client';

import { useState, Fragment } from 'react';
import { ChevronRight, ChevronDown, X, Save, Plus, Pencil, Trash2 } from 'lucide-react';
import { useProductLines } from '@/modules/inventory/hooks';
import { LoadingSkeleton } from '@/components';

const ACCENT = '#8B5CF6';
const inputCls = 'h-9 w-full rounded-lg border border-default bg-elevated px-3 text-[13px] text-text-default placeholder:text-text-muted focus:border-[#8B5CF6] focus:outline-none';

export function ProductLinesTab() {
  const { data: lines, isLoading } = useProductLines();
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [form, setForm] = useState({ name: '', subLines: '' });

  if (isLoading) return <LoadingSkeleton variant="table" />;

  const items = lines ?? [];

  const toggle = (id: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

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
        <p className="text-[13px] text-text-muted">{items.length} product lines</p>
        <button
          onClick={() => { setForm({ name: '', subLines: '' }); setDrawerOpen(true); }}
          className="flex h-8 items-center gap-1.5 rounded-lg border px-3 text-[13px] font-medium hover:bg-card"
          style={{ borderColor: ACCENT, color: ACCENT }}
        >
          <Plus size={14} />
          Add Product Line
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg bg-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-default">
                <th className="w-10 px-4 py-2.5" />
                <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-text-muted">Product Line</th>
                <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-text-muted">Sub-Lines</th>
                <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-text-muted">Active Products</th>
                <th className="px-4 py-2.5 text-right text-[11px] font-semibold uppercase tracking-wider text-text-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map(line => {
                const isExpanded = expanded.has(line.id);
                const isEditing = editingId === line.id;
                return (
                  <Fragment key={line.id}>
                    <tr className="border-b border-default transition-colors hover:bg-card-hover">
                      <td className="px-4 py-2">
                        <button onClick={() => toggle(line.id)} className="text-text-muted hover:text-text-default">
                          {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                        </button>
                      </td>
                      <td className="px-4 py-2">
                        {isEditing ? (
                          <div className="flex items-center gap-2">
                            <input
                              value={editName}
                              onChange={e => setEditName(e.target.value)}
                              className={inputCls}
                              style={{ maxWidth: 200 }}
                              autoFocus
                              onKeyDown={e => { if (e.key === 'Escape') cancelEdit(); }}
                            />
                            <button onClick={cancelEdit} className="text-text-muted hover:text-text-default"><X size={13} /></button>
                            <button onClick={cancelEdit} className="text-[13px] font-medium" style={{ color: ACCENT }}>Save</button>
                          </div>
                        ) : (
                          <span className="text-[13px] font-medium text-text-default">{line.name}</span>
                        )}
                      </td>
                      <td className="px-4 py-2 text-[13px] tabular-nums" style={{ color: ACCENT }}>{line.subLines.length}</td>
                      <td className="px-4 py-2 text-[13px] tabular-nums text-text-default">{line.activeProducts}</td>
                      <td className="px-4 py-2 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => startEdit(line.id, line.name)} className="text-text-muted hover:text-text-default" title="Edit">
                            <Pencil size={13} />
                          </button>
                          <button className="text-text-muted hover:text-red-400" title="Delete">
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {isExpanded && line.subLines.map((sub, i) => (
                      <tr key={`${line.id}-sub-${i}`} className="border-b border-default bg-elevated/50">
                        <td className="px-4 py-2" />
                        <td className="px-4 py-2 pl-12">
                          <span className="text-[13px] text-text-muted">{sub}</span>
                        </td>
                        <td className="px-4 py-2" />
                        <td className="px-4 py-2" />
                        <td className="px-4 py-2" />
                      </tr>
                    ))}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
        {!items.length && (
          <div className="py-12 text-center text-sm text-text-muted">No product lines found.</div>
        )}
      </div>

      {/* Add Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
          <div className="flex h-full w-full max-w-md flex-col border-l border-default bg-card shadow-2xl">
            <div className="flex items-center justify-between border-b border-default px-6 py-4">
              <h3 className="text-sm font-semibold text-text-default">Add Product Line</h3>
              <button onClick={() => setDrawerOpen(false)} className="text-text-muted hover:text-text-default">
                <X size={16} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-xs text-text-muted">Product Line Name <span style={{ color: ACCENT }}>*</span></label>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Premium Flower" className={inputCls} />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-text-muted">Sub-Lines <span className="text-text-muted/60">(comma-separated)</span></label>
                  <input value={form.subLines} onChange={e => setForm(f => ({ ...f, subLines: e.target.value }))} placeholder="e.g. Sativa, Indica, Hybrid" className={inputCls} />
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
                Save Product Line
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

