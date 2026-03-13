'use client';

import { useState } from 'react';
import { X, Save, Plus, Trash2 } from 'lucide-react';
import { useProductTags } from '@/modules/inventory/hooks';
import { LoadingSkeleton } from '@/components';

const ACCENT = '#8B5CF6';
const inputCls = 'h-9 w-full rounded-lg border border-default bg-elevated px-3 text-[13px] text-text-default placeholder:text-text-muted focus:border-[#8B5CF6] focus:outline-none';

const COLOR_PRESETS = ['#8B5CF6', '#22C55E', '#F59E0B', '#3B82F6', '#EC4899', '#EF4444', '#06B6D4', '#F97316'];

export function ProductTagTab() {
  const { data: tags, isLoading } = useProductTags();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [removedIds, setRemovedIds] = useState<Set<string>>(new Set());
  const [form, setForm] = useState({ name: '', color: ACCENT });

  if (isLoading) return <LoadingSkeleton variant="table" />;

  const items = (tags ?? []).filter(t => !removedIds.has(t.id));

  const removeTag = (id: string) => {
    setRemovedIds(prev => new Set(prev).add(id));
  };

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <p className="text-[13px] text-text-muted">{items.length} tags</p>
        <button
          onClick={() => { setForm({ name: '', color: ACCENT }); setDrawerOpen(true); }}
          className="flex h-8 items-center gap-1.5 rounded-lg border px-3 text-[13px] font-medium hover:bg-card"
          style={{ borderColor: ACCENT, color: ACCENT }}
        >
          <Plus size={14} />
          Add Tag
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg bg-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-default">
                {['Tag Name', 'Color', 'Assigned Products', ''].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-text-muted">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map(tag => (
                <tr key={tag.id} className="border-b border-default transition-colors hover:bg-card-hover">
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: tag.color }} />
                      <span className="text-[13px] font-medium text-text-default">{tag.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <span className="rounded border border-default px-2 py-0.5 font-mono text-[11px] text-text-muted">{tag.color}</span>
                  </td>
                  <td className="px-4 py-2 text-[13px] tabular-nums text-text-default">{tag.assignedProducts}</td>
                  <td className="px-4 py-2 text-right">
                    <button onClick={() => removeTag(tag.id)} className="text-text-muted hover:text-red-400" title="Remove tag">
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!items.length && (
          <div className="py-12 text-center text-sm text-text-muted">No tags found.</div>
        )}
      </div>

      {/* Add Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
          <div className="flex h-full w-full max-w-md flex-col border-l border-default bg-card shadow-2xl">
            <div className="flex items-center justify-between border-b border-default px-6 py-4">
              <h3 className="text-sm font-semibold text-text-default">Add Tag</h3>
              <button onClick={() => setDrawerOpen(false)} className="text-text-muted hover:text-text-default">
                <X size={16} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-xs text-text-muted">Tag Name <span style={{ color: ACCENT }}>*</span></label>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Staff Pick" className={inputCls} />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-text-muted">Color</label>
                  <div className="flex flex-wrap gap-2">
                    {COLOR_PRESETS.map(c => (
                      <button
                        key={c}
                        onClick={() => setForm(f => ({ ...f, color: c }))}
                        className="h-8 w-8 rounded-lg transition-transform"
                        style={{
                          backgroundColor: c,
                          outline: form.color === c ? `2px solid ${c}` : 'none',
                          outlineOffset: 2,
                          transform: form.color === c ? 'scale(1.1)' : 'scale(1)',
                        }}
                      />
                    ))}
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="h-6 w-6 rounded" style={{ backgroundColor: form.color }} />
                    <input
                      value={form.color}
                      onChange={e => setForm(f => ({ ...f, color: e.target.value }))}
                      className={inputCls}
                      style={{ maxWidth: 120 }}
                      placeholder="#RRGGBB"
                    />
                  </div>
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
                Save Tag
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
