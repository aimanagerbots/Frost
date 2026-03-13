'use client';

import { useState } from 'react';
import { Bot, Play, Search, Download, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { StatusBadge } from '@/components';
import { useOrderIntake } from '../../hooks/useOrderIntake';
import { useCultiveraStore } from '../../store';
import { CultiveraOrderDrawer } from './CultiveraOrderDrawer';
import type { OrderImport } from '../../types';

const ACCENT = '#22D3EE';

type StatusFilter = 'all' | OrderImport['status'];

function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  const today = new Date();
  const isToday = d.toDateString() === today.toDateString();
  const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  if (isToday) return `Today ${time}`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' ' + time;
}

export function OrderIntake() {
  const { data, isLoading } = useOrderIntake();
  const { selectedOrderId, selectOrder } = useCultiveraStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [isRunning, setIsRunning] = useState(false);

  function handleRunNow() {
    if (isRunning) return;
    setIsRunning(true);
    setTimeout(() => setIsRunning(false), 3000);
  }

  if (isLoading || !data) {
    return <div className="h-64 rounded-xl bg-card animate-pulse" />;
  }

  const { botStatus, orders } = data;
  const selectedOrder = orders.find((o) => o.id === selectedOrderId) ?? null;

  const filtered = orders.filter((o) => {
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    const matchSearch = !search || o.retailerName.toLowerCase().includes(search.toLowerCase()) || o.cultiveraPONumber.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="space-y-4">
      {/* Bot Status Card */}
      <div className="rounded-xl border bg-card p-5" style={{ borderColor: `${ACCENT}30` }}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl"
              style={{ background: `${ACCENT}15`, color: ACCENT }}
            >
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white">Order Intake Bot</h2>
                <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                  isRunning
                    ? 'bg-[#22D3EE]/15 text-[#22D3EE]'
                    : botStatus.state === 'idle'
                    ? 'bg-white/[0.06] text-text-text-muted'
                    : 'bg-red-500/15 text-red-400'
                }`}>
                  {isRunning ? (
                    <><span className="h-1.5 w-1.5 rounded-full bg-[#22D3EE] animate-ping inline-block" />Running</>
                  ) : botStatus.state === 'idle' ? (
                    <><CheckCircle className="h-3 w-3" />Idle</>
                  ) : (
                    <><AlertCircle className="h-3 w-3" />Error</>
                  )}
                </span>
              </div>
              <p className="text-xs text-text-muted mt-0.5">
                Last run: {formatTimestamp(botStatus.lastRun)} · Next run: {formatTimestamp(botStatus.nextRun)}
              </p>
            </div>
          </div>
          <button
            onClick={handleRunNow}
            disabled={isRunning}
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all hover:opacity-90 active:scale-95 disabled:opacity-60"
            style={{ background: ACCENT, color: '#0A1628' }}
          >
            <Play className={`h-3.5 w-3.5 ${isRunning ? 'animate-pulse' : ''}`} />
            {isRunning ? 'Running...' : 'Run Now'}
          </button>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-default">
          <div className="text-center">
            <p className="text-xl font-bold text-white">{botStatus.ordersImportedToday}</p>
            <p className="text-xs text-text-muted mt-0.5">Imported today</p>
          </div>
          <div className="text-center border-x border-default">
            <p className="text-xl font-bold text-white">{botStatus.ordersImportedThisWeek}</p>
            <p className="text-xs text-text-muted mt-0.5">This week</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold" style={{ color: botStatus.pendingReview > 0 ? '#F59E0B' : undefined }}>
              {botStatus.pendingReview}
            </p>
            <p className="text-xs text-text-muted mt-0.5">Pending review</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-muted" />
          <input
            type="text"
            placeholder="Search retailer or PO#..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-default bg-card pl-9 pr-3 py-2 text-sm text-white placeholder:text-text-muted focus:outline-none focus:border-[#22D3EE]/50"
          />
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-default bg-card p-1">
          {(['all', 'new', 'reviewed', 'pushed-to-orders'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`rounded-md px-3 py-1 text-xs font-semibold transition-colors ${
                statusFilter === s ? 'text-[#0A1628]' : 'text-text-muted hover:text-white'
              }`}
              style={statusFilter === s ? { background: ACCENT } : undefined}
            >
              {s === 'all' ? 'All' : s === 'new' ? 'New' : s === 'reviewed' ? 'Reviewed' : 'Pushed'}
            </button>
          ))}
        </div>
      </div>

      {/* Orders table */}
      <div className="rounded-xl border border-default bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-default bg-card-hover">
              <th className="text-left px-5 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">PO Number</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">Retailer</th>
              <th className="text-right px-5 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">Items</th>
              <th className="text-right px-5 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">Total</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">Imported</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">Status</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((order) => (
              <tr key={order.id} className="border-b border-default last:border-0 hover:bg-card-hover transition-colors cursor-pointer" onClick={() => selectOrder(order.id)}>
                <td className="px-5 py-3.5">
                  <span className="text-xs font-mono text-white">{order.cultiveraPONumber}</span>
                </td>
                <td className="px-5 py-3.5">
                  <span className="text-sm font-medium text-white">{order.retailerName}</span>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <span className="text-xs text-text-muted">{order.lineItems.length} SKU{order.lineItems.length !== 1 ? 's' : ''}</span>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <span className="text-sm font-semibold text-white">${order.subtotal.toLocaleString()}</span>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-1.5 text-xs text-text-muted">
                    <Clock className="h-3 w-3" />
                    {formatTimestamp(order.importedAt)}
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <StatusBadge
                    status={order.status === 'new' ? 'new' : order.status === 'reviewed' ? 'processing' : 'delivered'}
                  />
                </td>
                <td className="px-5 py-3.5">
                  <button
                    onClick={(e) => { e.stopPropagation(); selectOrder(order.id); }}
                    className="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium border border-default text-text-muted hover:text-white hover:bg-card-hover transition-colors"
                  >
                    <Download className="h-3 w-3" />
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-sm text-text-muted">No orders match your filters.</p>
          </div>
        )}
      </div>

      {/* Order Drawer */}
      {selectedOrder && (
        <CultiveraOrderDrawer order={selectedOrder} onClose={() => selectOrder(null)} />
      )}
    </div>
  );
}
