'use client';

import {
  Search,
  Filter,
  Clock,
  CheckCircle2,
  Truck,
  AlertCircle,
  Package,
  ChevronRight,
} from 'lucide-react';

const ORDERS = [
  { id: 'PO-2026-0847', items: 12, total: '$3,420.00', status: 'shipped', date: 'Mar 8, 2026', eta: 'Mar 10' },
  { id: 'PO-2026-0846', items: 8, total: '$2,180.00', status: 'processing', date: 'Mar 7, 2026', eta: 'Mar 11' },
  { id: 'PO-2026-0841', items: 15, total: '$4,890.00', status: 'delivered', date: 'Mar 5, 2026', eta: '—' },
  { id: 'PO-2026-0838', items: 6, total: '$1,640.00', status: 'delivered', date: 'Mar 3, 2026', eta: '—' },
  { id: 'PO-2026-0835', items: 20, total: '$5,200.00', status: 'delivered', date: 'Mar 1, 2026', eta: '—' },
  { id: 'PO-2026-0829', items: 10, total: '$2,750.00', status: 'delivered', date: 'Feb 27, 2026', eta: '—' },
  { id: 'PO-2026-0824', items: 14, total: '$3,920.00', status: 'delivered', date: 'Feb 24, 2026', eta: '—' },
  { id: 'PO-2026-0818', items: 9, total: '$2,430.00', status: 'issue', date: 'Feb 20, 2026', eta: '—' },
];

const STATUS_CONFIG: Record<string, { icon: typeof Clock; className: string; bgClass: string; label: string }> = {
  processing: { icon: Clock, className: 'text-warning', bgClass: 'bg-warning/10', label: 'Processing' },
  shipped: { icon: Truck, className: 'text-info', bgClass: 'bg-info/10', label: 'Shipped' },
  delivered: { icon: CheckCircle2, className: 'text-success', bgClass: 'bg-success/10', label: 'Delivered' },
  issue: { icon: AlertCircle, className: 'text-danger', bgClass: 'bg-danger/10', label: 'Issue' },
};

const TABS = ['All', 'Processing', 'Shipped', 'Delivered'] as const;

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-bright font-display">Orders</h1>
        <p className="text-sm text-text-muted mt-1">Track and manage your purchase orders</p>
      </div>

      {/* Filters bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative flex-1 w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search orders..."
            className="w-full rounded-lg border border-border-default bg-elevated pl-9 pr-4 py-2.5 text-sm text-text-default placeholder:text-text-muted outline-none focus:border-accent-primary/50"
          />
        </div>
        <div className="flex gap-1.5">
          {TABS.map((tab) => (
            <button
              key={tab}
              className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                tab === 'All'
                  ? 'bg-accent-primary/10 text-accent-primary'
                  : 'text-text-muted hover:bg-white/[0.04] hover:text-text-default'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <button className="ml-auto flex items-center gap-1.5 rounded-lg border border-border-default px-3 py-2 text-xs text-text-muted hover:bg-card-hover transition-colors">
          <Filter className="h-3.5 w-3.5" />
          Filters
        </button>
      </div>

      {/* Orders table */}
      <div className="rounded-xl border border-border-default bg-card overflow-hidden">
        {/* Header */}
        <div className="hidden sm:grid grid-cols-[1fr_80px_120px_120px_100px_32px] gap-4 px-5 py-3 border-b border-border-default text-xs font-medium text-text-muted uppercase tracking-wider">
          <span>Order</span>
          <span>Items</span>
          <span>Total</span>
          <span>Date</span>
          <span>Status</span>
          <span />
        </div>
        <div className="divide-y divide-border-default">
          {ORDERS.map((order) => {
            const cfg = STATUS_CONFIG[order.status];
            const StatusIcon = cfg.icon;
            return (
              <div
                key={order.id}
                className="grid grid-cols-1 sm:grid-cols-[1fr_80px_120px_120px_100px_32px] gap-2 sm:gap-4 px-5 py-4 hover:bg-card-hover transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.04]">
                    <Package className="h-4 w-4 text-text-muted" />
                  </div>
                  <span className="text-sm font-medium text-text-default font-mono">{order.id}</span>
                </div>
                <span className="text-sm text-text-muted self-center">{order.items}</span>
                <span className="text-sm font-semibold text-text-bright self-center">{order.total}</span>
                <span className="text-sm text-text-muted self-center">{order.date}</span>
                <span className={`flex items-center gap-1 text-xs font-medium self-center ${cfg.className}`}>
                  <StatusIcon className="h-3.5 w-3.5" />
                  {cfg.label}
                </span>
                <ChevronRight className="h-4 w-4 text-text-muted self-center opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
