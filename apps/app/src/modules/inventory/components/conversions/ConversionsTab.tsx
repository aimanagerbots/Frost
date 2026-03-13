'use client';

import { useState } from 'react';
import { X, Save } from 'lucide-react';
import { useConversions } from '@/modules/inventory/hooks';
import { LoadingSkeleton } from '@/components';

const ACCENT = '#8B5CF6';

const inputCls = 'h-9 w-full rounded-lg border border-default bg-elevated px-3 text-[13px] text-text-default placeholder:text-text-muted focus:border-[#8B5CF6] focus:outline-none';

export function ConversionsTab() {
  const { data: conversions, isLoading } = useConversions();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [toggledIds, setToggledIds] = useState<Set<string>>(new Set());
  const [form, setForm] = useState({ fromProduct: '', toProduct: '', ratio: '', active: true });

  if (isLoading) return <LoadingSkeleton variant="table" />;

  const items = conversions ?? [];

  function startEdit(id: string, currentRatio: number) {
    setEditingId(id);
    setEditValue(String(currentRatio));
  }

  function commitEdit() {
    setEditingId(null);
  }

  function toggleActive(id: string) {
    setToggledIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function isActive(id: string, originalActive: boolean) {
    return toggledIds.has(id) ? !originalActive : originalActive;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-[13px] text-text-muted">{items.length} conversion rules</p>
        <button
          onClick={() => setDrawerOpen(true)}
          className="flex h-8 items-center gap-1.5 rounded-lg border px-3 text-[13px] font-medium hover:bg-card"
          style={{ borderColor: ACCENT, color: ACCENT }}
        >
          + Add Rule
        </button>
      </div>

      <div className="overflow-hidden rounded-lg bg-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-default">
                {['From Product', 'To Product', 'Conversion Ratio', 'Unit', 'Active'].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-text-muted">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map(c => {
                const active = isActive(c.id, c.active);
                return (
                  <tr key={c.id} className="border-b border-default transition-colors hover:bg-card-hover">
                    <td className="px-4 py-2 text-[13px] text-text-default">{c.fromProduct}</td>
                    <td className="px-4 py-2 text-[13px] text-text-default">{c.toProduct}</td>
                    <td className="px-4 py-2">
                      {editingId === c.id ? (
                        <input
                          autoFocus
                          type="number"
                          step="0.01"
                          value={editValue}
                          onChange={e => setEditValue(e.target.value)}
                          onBlur={commitEdit}
                          onKeyDown={e => { if (e.key === 'Enter') commitEdit(); }}
                          className="h-7 w-28 rounded border border-default bg-elevated px-2 text-[13px] tabular-nums font-semibold focus:border-[#8B5CF6] focus:outline-none"
                          style={{ color: ACCENT }}
                        />
                      ) : (
                        <button
                          onClick={() => startEdit(c.id, c.conversionRatio)}
                          className="cursor-pointer text-[13px] tabular-nums font-semibold hover:underline"
                          style={{ color: ACCENT }}
                          title="Click to edit"
                        >
                          {c.conversionRatio}x
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-2 text-[13px] text-text-muted">{c.unit}</td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => toggleActive(c.id)}
                        className="rounded-full px-2 py-0.5 text-[11px] font-medium transition-colors"
                        style={active
                          ? { backgroundColor: '#22c55e20', color: '#22c55e' }
                          : { backgroundColor: 'rgba(255,255,255,0.06)', color: 'var(--color-text-muted)' }}
                        title="Click to toggle"
                      >
                        {active ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {!items.length && (
          <div className="py-12 text-center text-sm text-text-muted">No conversion rules found.</div>
        )}
      </div>

      {/* Add Rule Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
          <div className="flex h-full w-full max-w-md flex-col border-l border-default bg-card shadow-2xl">
            <div className="flex items-center justify-between border-b border-default px-6 py-4">
              <h3 className="text-sm font-semibold text-text-default">Add Conversion Rule</h3>
              <button onClick={() => setDrawerOpen(false)} className="text-text-muted hover:text-text-default">
                <X size={16} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-xs text-text-muted">From Product <span style={{ color: ACCENT }}>*</span></label>
                  <input value={form.fromProduct} onChange={e => setForm(f => ({ ...f, fromProduct: e.target.value }))} placeholder="Source product…" className={inputCls} />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-text-muted">To Product <span style={{ color: ACCENT }}>*</span></label>
                  <input value={form.toProduct} onChange={e => setForm(f => ({ ...f, toProduct: e.target.value }))} placeholder="Target product…" className={inputCls} />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-text-muted">Conversion Ratio <span style={{ color: ACCENT }}>*</span></label>
                  <input type="number" step="0.01" value={form.ratio} onChange={e => setForm(f => ({ ...f, ratio: e.target.value }))} placeholder="1.0" className={inputCls} />
                </div>
                <label className="flex cursor-pointer items-center gap-2">
                  <div
                    onClick={() => setForm(f => ({ ...f, active: !f.active }))}
                    className="flex h-4 w-4 items-center justify-center rounded border-2 transition-colors"
                    style={{
                      borderColor: form.active ? ACCENT : 'var(--color-border-default)',
                      backgroundColor: form.active ? ACCENT : 'transparent',
                    }}
                  >
                    {form.active && <span className="text-[10px] text-white">✓</span>}
                  </div>
                  <span className="text-xs text-text-default">Active</span>
                </label>
              </div>
            </div>
            <div className="flex items-center gap-2 border-t border-default px-6 py-4">
              <button
                onClick={() => setDrawerOpen(false)}
                className="flex h-9 items-center gap-1.5 rounded-lg px-4 text-xs font-medium text-white"
                style={{ backgroundColor: ACCENT }}
              >
                <Save size={14} />
                Save Rule
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
