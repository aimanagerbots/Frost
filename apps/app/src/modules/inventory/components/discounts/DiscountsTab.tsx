'use client';

import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { useDiscounts } from '@/modules/inventory/hooks';
import { LoadingSkeleton } from '@/components';
import type { Discount } from '@/modules/inventory/types';

const ACCENT = '#8B5CF6';

function AddDiscountDrawer({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({
    name: '', fromDate: '', toDate: '', discountType: 'percent' as 'percent' | 'amount',
    discountAmount: '', description: '', appliesToAllProducts: false, appliesToAllClients: false,
  });

  const set = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-default bg-card p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-text-default">Add Discount</h3>
          <button onClick={onClose} className="text-text-muted hover:text-text-default">
            <X size={16} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-xs text-text-muted">Name</label>
            <input
              value={form.name}
              onChange={e => set('name', e.target.value)}
              placeholder="Discount name\u2026"
              className="h-9 w-full rounded-lg border border-default bg-elevated px-3 text-xs text-text-default placeholder:text-text-muted focus:border-[#8B5CF6] focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs text-text-muted">Description</label>
            <textarea
              value={form.description} onChange={e => set('description', e.target.value)}
              rows={2} placeholder="Optional description\u2026"
              className="w-full resize-none rounded-lg border border-default bg-elevated px-3 py-2 text-xs text-text-default placeholder:text-text-muted focus:border-[#8B5CF6] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs text-text-muted">From Date</label>
              <input type="date" value={form.fromDate} onChange={e => set('fromDate', e.target.value)}
                className="h-9 w-full rounded-lg border border-default bg-elevated px-3 text-xs text-text-default focus:border-[#8B5CF6] focus:outline-none" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-text-muted">To Date</label>
              <input type="date" value={form.toDate} onChange={e => set('toDate', e.target.value)}
                className="h-9 w-full rounded-lg border border-default bg-elevated px-3 text-xs text-text-default focus:border-[#8B5CF6] focus:outline-none" />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs text-text-muted">Discount Type</label>
            <div className="flex gap-4">
              {(['percent', 'amount'] as const).map(t => (
                <label key={t} className="flex cursor-pointer items-center gap-2">
                  <div
                    onClick={() => set('discountType', t)}
                    className="flex h-4 w-4 items-center justify-center rounded-full border-2 transition-colors"
                    style={{
                      borderColor: form.discountType === t ? ACCENT : 'var(--color-border-default)',
                      backgroundColor: form.discountType === t ? ACCENT : 'transparent',
                    }}
                  >
                    {form.discountType === t && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                  </div>
                  <span className="text-xs capitalize text-text-default">{t}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs text-text-muted">
              Amount {form.discountType === 'percent' ? '(%)' : '($)'}
            </label>
            <input
              type="number" value={form.discountAmount} onChange={e => set('discountAmount', e.target.value)}
              placeholder={form.discountType === 'percent' ? '10' : '5.00'}
              className="h-9 w-full rounded-lg border border-default bg-elevated px-3 text-xs text-text-default placeholder:text-text-muted focus:border-[#8B5CF6] focus:outline-none"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-lg border border-default px-4 py-2 text-xs text-text-muted hover:text-text-default">
            Cancel
          </button>
          <button
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-xs font-medium text-white"
            style={{ backgroundColor: ACCENT }}
          >
            Save Discount
          </button>
        </div>
      </div>
    </div>
  );
}

export function DiscountsTab() {
  const { data: discounts, isLoading } = useDiscounts();
  const [showAdd, setShowAdd] = useState(false);
  const [showExpired, setShowExpired] = useState(false);

  if (isLoading) return <LoadingSkeleton variant="table" />;

  const filtered = showExpired
    ? discounts
    : (discounts ?? []).filter(d => d.status !== 'expired');

  return (
    <div className="space-y-3">
      {showAdd && <AddDiscountDrawer onClose={() => setShowAdd(false)} />}

      {/* Action buttons */}
      <div className="flex items-center justify-end">
        <button
          onClick={() => setShowAdd(true)}
          className="flex h-8 items-center gap-1.5 border rounded-lg px-3 text-[13px] font-medium hover:bg-card"
          style={{ borderColor: ACCENT, color: ACCENT }}
        >
          <Plus size={14} />
          Add Discount
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center">
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={showExpired}
            onChange={e => setShowExpired(e.target.checked)}
            className="h-3.5 w-3.5 rounded border-default accent-[#8B5CF6]"
          />
          <span className="text-[13px] text-text-muted">View Expired Discounts</span>
        </label>
      </div>

      {/* Simplified Cultivera columns: Name | Description | From Date | To Date | Discount */}
      <div className="overflow-hidden rounded-lg bg-card">
        <table className="w-full">
          <thead>
            <tr className="border-b border-default">
              {['Name', 'Description', 'From Date', 'To Date', 'Discount'].map(h => (
                <th key={h} className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-text-muted">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(filtered ?? []).map((d: Discount) => (
              <tr key={d.id} className="border-b border-default transition-colors hover:bg-card-hover">
                <td className="px-4 py-2 text-[13px] font-medium text-text-default">{d.name}</td>
                <td className="max-w-[300px] px-4 py-2 text-[13px] text-text-muted">
                  <span className="line-clamp-1">{d.description}</span>
                </td>
                <td className="px-4 py-2 text-[13px] tabular-nums text-text-muted">{d.fromDate}</td>
                <td className="px-4 py-2 text-[13px] tabular-nums text-text-muted">{d.toDate}</td>
                <td className="px-4 py-2 text-[13px] tabular-nums text-text-default">
                  {d.discountType === 'percent' ? d.discountAmount + '%' : '$' + d.discountAmount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!filtered?.length && (
          <div className="py-12 text-center text-sm text-text-muted">No discounts configured.</div>
        )}
      </div>
    </div>
  );
}
