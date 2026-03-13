'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { useEmployeeSamples } from '@/modules/inventory/hooks';
import { LoadingSkeleton } from '@/components';
import type { SamplePurpose } from '@/modules/inventory/types';

const ACCENT = '#8B5CF6';

const PURPOSE_CONFIG: Record<SamplePurpose, { label: string; bg: string; text: string }> = {
  'quality-control': { label: 'QC', bg: 'rgba(34,197,94,0.15)', text: '#22C55E' },
  'education':       { label: 'Education', bg: 'rgba(59,130,246,0.15)', text: '#3B82F6' },
  'demo':            { label: 'Demo', bg: 'rgba(245,158,11,0.15)', text: '#F59E0B' },
};

const INITIAL_FORM = { employeeName: '', product: '', quantity: '1', purpose: 'education' as SamplePurpose, approvedBy: '' };

export function EmployeeSampleTab() {
  const { data: samples, isLoading } = useEmployeeSamples();
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
          + Log Sample
        </button>
      </div>

      {/* Count label */}
      <div className="flex items-center">
        <p className="text-[13px] text-text-muted">{samples?.length ?? 0} employee sample{(samples?.length ?? 0) !== 1 ? 's' : ''}</p>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg bg-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-default">
                {['Employee', 'Product Sampled', 'Quantity', 'Date', 'Purpose', 'Approved By'].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-text-muted">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(samples ?? []).map(s => {
                const cfg = PURPOSE_CONFIG[s.purpose] ?? PURPOSE_CONFIG.education;
                return (
                  <tr key={s.id} className="border-b border-default transition-colors hover:bg-card-hover">
                    <td className="px-4 py-2 text-[13px] font-medium text-text-default">{s.employeeName}</td>
                    <td className="max-w-[200px] px-4 py-2 text-[13px] text-text-default"><span className="line-clamp-1">{s.productSampled}</span></td>
                    <td className="px-4 py-2 text-[13px] tabular-nums text-text-default">{s.quantity}</td>
                    <td className="px-4 py-2 text-[13px] text-text-muted">{s.date}</td>
                    <td className="px-4 py-2">
                      <span className="rounded-full px-2 py-0.5 text-[11px] font-medium" style={{ backgroundColor: cfg.bg, color: cfg.text }}>
                        {cfg.label}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-[13px] text-text-muted">{s.approvedBy}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {!samples?.length && <div className="py-12 text-center text-sm text-text-muted">No employee samples logged.</div>}
      </div>

      {/* Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm" onClick={() => setDrawerOpen(false)}>
          <div className="h-full w-full max-w-md overflow-y-auto border-l border-default bg-card p-6" onClick={e => e.stopPropagation()}>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-text-default">Log Employee Sample</h2>
              <button onClick={() => setDrawerOpen(false)} className="rounded p-1 text-text-muted hover:text-text-default"><X size={16} /></button>
            </div>
            <div className="space-y-4">
              {/* Employee Name */}
              <div>
                <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-text-muted">Employee Name *</label>
                <input
                  value={form.employeeName} onChange={e => setForm({ ...form, employeeName: e.target.value })}
                  placeholder="Full name"
                  className="h-9 w-full rounded-lg border border-default bg-elevated px-3 text-xs text-text-default placeholder:text-text-muted focus:border-[#8B5CF6] focus:outline-none"
                />
              </div>
              {/* Product */}
              <div>
                <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-text-muted">Product *</label>
                <input
                  value={form.product} onChange={e => setForm({ ...form, product: e.target.value })}
                  placeholder="Product name"
                  className="h-9 w-full rounded-lg border border-default bg-elevated px-3 text-xs text-text-default placeholder:text-text-muted focus:border-[#8B5CF6] focus:outline-none"
                />
              </div>
              {/* Quantity */}
              <div>
                <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-text-muted">Quantity *</label>
                <input
                  type="number" min={1} value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })}
                  className="h-9 w-full rounded-lg border border-default bg-elevated px-3 text-xs text-text-default placeholder:text-text-muted focus:border-[#8B5CF6] focus:outline-none"
                />
              </div>
              {/* Purpose */}
              <div>
                <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-text-muted">Purpose *</label>
                <select
                  value={form.purpose} onChange={e => setForm({ ...form, purpose: e.target.value as SamplePurpose })}
                  className="h-9 w-full rounded-lg border border-default bg-elevated px-3 text-xs text-text-default focus:border-[#8B5CF6] focus:outline-none"
                >
                  <option value="education">Education</option>
                  <option value="quality-control">Quality Control</option>
                  <option value="demo">Demo</option>
                </select>
              </div>
              {/* Approved By */}
              <div>
                <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-text-muted">Approved By</label>
                <input
                  value={form.approvedBy} onChange={e => setForm({ ...form, approvedBy: e.target.value })}
                  placeholder="Manager name"
                  className="h-9 w-full rounded-lg border border-default bg-elevated px-3 text-xs text-text-default placeholder:text-text-muted focus:border-[#8B5CF6] focus:outline-none"
                />
              </div>
              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="h-8 rounded-lg px-3 text-xs font-medium text-white"
                  style={{ backgroundColor: ACCENT }}
                >
                  Save Sample
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
