'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { useDisposals } from '@/modules/inventory/hooks';
import { LoadingSkeleton } from '@/components';
import type { DisposalReason } from '@/modules/inventory/types';

const ACCENT = '#8B5CF6';

const REASON_CONFIG: Record<DisposalReason, { label: string; bg: string; text: string }> = {
  waste:       { label: 'Waste', bg: 'rgba(100,116,139,0.15)', text: '#94A3B8' },
  overstock:   { label: 'Overstock', bg: 'rgba(59,130,246,0.15)', text: '#3B82F6' },
  damage:      { label: 'Damage', bg: 'rgba(245,158,11,0.15)', text: '#F59E0B' },
  compliance:  { label: 'Compliance', bg: 'rgba(239,68,68,0.15)', text: '#EF4444' },
  expiration:  { label: 'Expiration', bg: 'rgba(168,85,247,0.15)', text: '#A855F7' },
};

const INITIAL_FORM = {
  product: '', batchNumber: '', quantity: '', unit: 'units',
  reason: 'waste' as DisposalReason, method: '', employee: '', witness: '',
};

export function DisposalTab() {
  const { data: disposals, isLoading } = useDisposals();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [form, setForm] = useState(INITIAL_FORM);

  if (isLoading) return <LoadingSkeleton variant="table" />;

  return (
    <div className="space-y-3">
      {/* Action button row */}
      <div className="flex items-center justify-end">
        <button
          onClick={() => { setForm(INITIAL_FORM); setDrawerOpen(true); }}
          className="flex h-8 items-center gap-1.5 rounded-lg border px-3 text-[13px] font-medium hover:bg-card"
          style={{ borderColor: ACCENT, color: ACCENT }}
        >
          + Log Disposal
        </button>
      </div>

      {/* Header */}
      <div className="flex items-center gap-2">
        <p className="text-[13px] text-text-muted">{disposals?.length ?? 0} disposal record{(disposals?.length ?? 0) !== 1 ? 's' : ''}</p>
        <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[11px] font-medium text-amber-400">
          METRC Required
        </span>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg bg-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-default">
                {['Disposal ID', 'Product', 'Batch', 'Quantity', 'Unit', 'Reason', 'Method', 'Employee', 'Witness', 'Date'].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-text-muted">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(disposals ?? []).map(d => {
                const cfg = REASON_CONFIG[d.disposalReason] ?? REASON_CONFIG.waste;
                return (
                  <tr key={d.id} className="border-b border-default transition-colors hover:bg-card-hover">
                    <td className="px-4 py-2 font-mono text-[13px] text-text-muted">{d.disposalId}</td>
                    <td className="max-w-[160px] px-4 py-2 text-[13px] text-text-default"><span className="line-clamp-1">{d.productName}</span></td>
                    <td className="px-4 py-2 font-mono text-[13px] text-text-muted">{d.batchNumber}</td>
                    <td className="px-4 py-2 text-[13px] tabular-nums text-text-default">{d.quantity}</td>
                    <td className="px-4 py-2 text-[13px] text-text-muted">{d.unit}</td>
                    <td className="px-4 py-2">
                      <span className="rounded-full px-2 py-0.5 text-[11px] font-medium" style={{ backgroundColor: cfg.bg, color: cfg.text }}>
                        {cfg.label}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-[13px] text-text-muted">{d.disposalMethod}</td>
                    <td className="px-4 py-2 text-[13px] text-text-default">{d.employee}</td>
                    <td className="px-4 py-2 text-[13px] text-text-muted">{d.witness}</td>
                    <td className="px-4 py-2 text-[13px] text-text-muted">{d.date}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {!disposals?.length && <div className="py-12 text-center text-sm text-text-muted">No disposal records.</div>}
      </div>

      {/* Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm" onClick={() => setDrawerOpen(false)}>
          <div className="h-full w-full max-w-md overflow-y-auto border-l border-default bg-card p-6" onClick={e => e.stopPropagation()}>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-text-default">Log Disposal</h2>
              <button onClick={() => setDrawerOpen(false)} className="rounded p-1 text-text-muted hover:text-text-default"><X size={16} /></button>
            </div>
            <div className="space-y-4">
              {/* Product */}
              <div>
                <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-text-muted">Product *</label>
                <input
                  value={form.product} onChange={e => setForm({ ...form, product: e.target.value })}
                  placeholder="Product name"
                  className="h-9 w-full rounded-lg border border-default bg-elevated px-3 text-xs text-text-default placeholder:text-text-muted focus:border-[#8B5CF6] focus:outline-none"
                />
              </div>
              {/* Batch Number */}
              <div>
                <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-text-muted">Batch Number *</label>
                <input
                  value={form.batchNumber} onChange={e => setForm({ ...form, batchNumber: e.target.value })}
                  placeholder="Batch ID"
                  className="h-9 w-full rounded-lg border border-default bg-elevated px-3 text-xs text-text-default placeholder:text-text-muted focus:border-[#8B5CF6] focus:outline-none"
                />
              </div>
              {/* Quantity + Unit */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-text-muted">Quantity *</label>
                  <input
                    type="number" min={0} step="0.1" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })}
                    placeholder="0"
                    className="h-9 w-full rounded-lg border border-default bg-elevated px-3 text-xs text-text-default placeholder:text-text-muted focus:border-[#8B5CF6] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-text-muted">Unit *</label>
                  <input
                    value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })}
                    placeholder="units, lbs, g"
                    className="h-9 w-full rounded-lg border border-default bg-elevated px-3 text-xs text-text-default placeholder:text-text-muted focus:border-[#8B5CF6] focus:outline-none"
                  />
                </div>
              </div>
              {/* Reason */}
              <div>
                <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-text-muted">Reason *</label>
                <select
                  value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value as DisposalReason })}
                  className="h-9 w-full rounded-lg border border-default bg-elevated px-3 text-xs text-text-default focus:border-[#8B5CF6] focus:outline-none"
                >
                  <option value="waste">Waste</option>
                  <option value="overstock">Overstock</option>
                  <option value="damage">Damage</option>
                  <option value="compliance">Compliance</option>
                  <option value="expiration">Expiration</option>
                </select>
              </div>
              {/* Method */}
              <div>
                <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-text-muted">Method *</label>
                <input
                  value={form.method} onChange={e => setForm({ ...form, method: e.target.value })}
                  placeholder="On-Site Compost, Licensed Waste Hauler"
                  className="h-9 w-full rounded-lg border border-default bg-elevated px-3 text-xs text-text-default placeholder:text-text-muted focus:border-[#8B5CF6] focus:outline-none"
                />
              </div>
              {/* Employee + Witness */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-text-muted">Employee *</label>
                  <input
                    value={form.employee} onChange={e => setForm({ ...form, employee: e.target.value })}
                    placeholder="Employee name"
                    className="h-9 w-full rounded-lg border border-default bg-elevated px-3 text-xs text-text-default placeholder:text-text-muted focus:border-[#8B5CF6] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-text-muted">Witness *</label>
                  <input
                    value={form.witness} onChange={e => setForm({ ...form, witness: e.target.value })}
                    placeholder="Witness name"
                    className="h-9 w-full rounded-lg border border-default bg-elevated px-3 text-xs text-text-default placeholder:text-text-muted focus:border-[#8B5CF6] focus:outline-none"
                  />
                </div>
              </div>
              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="h-8 rounded-lg px-3 text-xs font-medium text-white"
                  style={{ backgroundColor: ACCENT }}
                >
                  Save Disposal
                </button>
                <button onClick={() => setDrawerOpen(false)} className="h-8 rounded-lg border border-default px-3 text-xs font-medium text-text-muted hover:text-text-default">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
