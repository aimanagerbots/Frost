'use client';

import { useState } from 'react';
import { X, Save } from 'lucide-react';
import { useBackorders } from '@/modules/inventory/hooks';
import { LoadingSkeleton } from '@/components';
import { InvStatusBadge } from '../InventoryStatusBadge';
const ACCENT = '#8B5CF6';

const PRIORITY_LABELS: Record<string, string> = {
  'fifo': 'FIFO',
  'newest-first': 'Newest First',
  'highest-qa': 'Highest QA',
  'lowest-qa': 'Lowest QA',
};

const FILTER_TABS: { key: string; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'partial', label: 'Partial' },
  { key: 'fulfilled', label: 'Fulfilled' },
];

const inputCls = 'h-9 w-full rounded-lg border border-default bg-elevated px-3 text-[13px] text-text-default placeholder:text-text-muted focus:border-[#8B5CF6] focus:outline-none';
const selectCls = 'h-9 w-full appearance-none rounded-lg border border-default bg-elevated px-3 text-[13px] text-text-default focus:border-[#8B5CF6] focus:outline-none';

function rowBg(status: string, qtyAvailable: number): React.CSSProperties | undefined {
  if (qtyAvailable === 0 && status !== 'fulfilled') return { backgroundColor: 'rgba(239,68,68,0.04)' };
  if (status === 'partial') return { backgroundColor: 'rgba(139,92,246,0.04)' };
  return undefined;
}

export function BackordersTab() {
  const { data: backorders, isLoading } = useBackorders();
  const [filterTab, setFilterTab] = useState('all');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [form, setForm] = useState({ orderNumber: '', client: '', product: '', qtyOrdered: '', priority: '' });

  if (isLoading) return <LoadingSkeleton variant="table" />;

  const filtered = (backorders ?? []).filter(bo => filterTab === 'all' || bo.status === filterTab);

  return (
    <div className="space-y-3">
      {/* Action button row */}
      <div className="flex items-center justify-between">
        <p className="text-[13px] text-text-muted">{filtered.length} backorders</p>
        <button
          onClick={() => setDrawerOpen(true)}
          className="flex h-8 items-center gap-1.5 rounded-lg border px-3 text-[13px] font-medium hover:bg-card"
          style={{ borderColor: ACCENT, color: ACCENT }}
        >
          + Add Backorder
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1 overflow-x-auto rounded-lg border border-default bg-base p-1">
          {FILTER_TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilterTab(tab.key)}
              className="rounded-md px-3 py-1.5 text-[13px] font-medium whitespace-nowrap transition-colors"
              style={filterTab === tab.key
                ? { backgroundColor: ACCENT + '20', color: ACCENT }
                : { color: 'var(--color-text-muted)' }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg bg-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-default">
                {['Order #', 'Client', 'Product', 'Qty Ordered', 'Qty Available', 'Priority', 'Created', 'Expected Fulfillment', 'QA Status', 'Status'].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-text-muted">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(bo => (
                <tr key={bo.id} className="border-b border-default transition-colors hover:bg-card-hover" style={rowBg(bo.status, bo.qtyAvailable)}>
                  <td className="px-4 py-2 font-mono text-[13px] text-text-muted">{bo.orderNumber}</td>
                  <td className="px-4 py-2 text-[13px] font-medium text-text-default">{bo.clientName}</td>
                  <td className="max-w-[200px] px-4 py-2 text-[13px] text-text-default">
                    <span className="line-clamp-1">{bo.productName}</span>
                  </td>
                  <td className="px-4 py-2 text-right text-[13px] tabular-nums text-text-default">{bo.qtyOrdered}</td>
                  <td className="px-4 py-2 text-right text-[13px] tabular-nums">
                    <span style={{ color: bo.qtyAvailable > 0 ? '#22c55e' : 'var(--color-text-muted)' }}>
                      {bo.qtyAvailable}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-[13px] text-text-muted">{PRIORITY_LABELS[bo.fulfillmentPriority] ?? bo.fulfillmentPriority}</td>
                  <td className="px-4 py-2 text-[13px] text-text-muted">{bo.dateCreated}</td>
                  <td className="px-4 py-2 text-[13px] text-text-muted">{bo.expectedFulfillment}</td>
                  <td className="px-4 py-2"><InvStatusBadge status={bo.qaStatus} /></td>
                  <td className="px-4 py-2"><InvStatusBadge status={bo.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!filtered.length && (
          <div className="py-12 text-center text-sm text-text-muted">No backorders found.</div>
        )}
      </div>

      {/* Add Backorder Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
          <div className="flex h-full w-full max-w-md flex-col border-l border-default bg-card shadow-2xl">
            <div className="flex items-center justify-between border-b border-default px-6 py-4">
              <h3 className="text-sm font-semibold text-text-default">Add Backorder</h3>
              <button onClick={() => setDrawerOpen(false)} className="text-text-muted hover:text-text-default">
                <X size={16} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-xs text-text-muted">Order Number</label>
                  <input value={form.orderNumber} onChange={e => setForm(f => ({ ...f, orderNumber: e.target.value }))} placeholder="ORD-2026-0XXX" className={inputCls} />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-text-muted">Client</label>
                  <input value={form.client} onChange={e => setForm(f => ({ ...f, client: e.target.value }))} placeholder="Client name…" className={inputCls} />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-text-muted">Product</label>
                  <input value={form.product} onChange={e => setForm(f => ({ ...f, product: e.target.value }))} placeholder="Product name…" className={inputCls} />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-text-muted">Qty Ordered</label>
                  <input type="number" value={form.qtyOrdered} onChange={e => setForm(f => ({ ...f, qtyOrdered: e.target.value }))} placeholder="0" className={inputCls} />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-text-muted">Priority</label>
                  <select value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))} className={selectCls}>
                    <option value="">Select…</option>
                    <option value="fifo">FIFO</option>
                    <option value="newest-first">Newest First</option>
                    <option value="highest-qa">Highest QA</option>
                    <option value="lowest-qa">Lowest QA</option>
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
                Save Backorder
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
