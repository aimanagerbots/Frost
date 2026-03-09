'use client';

import {
  ShoppingCart,
  Package,
  TrendingUp,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle2,
  Truck,
  AlertCircle,
} from 'lucide-react';

const STATS = [
  { label: 'Monthly Revenue', value: '$48,230', change: '+12.4%', up: true, icon: DollarSign },
  { label: 'Active Orders', value: '23', change: '+3', up: true, icon: ShoppingCart },
  { label: 'Products Listed', value: '156', change: '+8', up: true, icon: Package },
  { label: 'Avg. Order Value', value: '$2,097', change: '-2.1%', up: false, icon: TrendingUp },
];

const RECENT_ORDERS = [
  { id: 'PO-2026-0847', customer: 'Green Dreams Dispensary', items: 12, total: '$3,420', status: 'shipped', date: 'Mar 8' },
  { id: 'PO-2026-0846', customer: 'Green Dreams Dispensary', items: 8, total: '$2,180', status: 'processing', date: 'Mar 7' },
  { id: 'PO-2026-0841', customer: 'Green Dreams Dispensary', items: 15, total: '$4,890', status: 'delivered', date: 'Mar 5' },
  { id: 'PO-2026-0838', customer: 'Green Dreams Dispensary', items: 6, total: '$1,640', status: 'delivered', date: 'Mar 3' },
  { id: 'PO-2026-0835', customer: 'Green Dreams Dispensary', items: 20, total: '$5,200', status: 'delivered', date: 'Mar 1' },
];

const TOP_PRODUCTS = [
  { name: 'Blue Dream Pre-Roll 5pk', category: 'Preroll', sold: 342, revenue: '$5,130' },
  { name: 'Frost Bite Live Resin 1g', category: 'Concentrate', sold: 218, revenue: '$8,720' },
  { name: 'Glacier Mint Gummies 10pk', category: 'Edible', sold: 186, revenue: '$3,720' },
  { name: 'Northern Lights 3.5g', category: 'Flower', sold: 164, revenue: '$5,740' },
  { name: 'Frost Fizz Lemon Seltzer', category: 'Beverage', sold: 128, revenue: '$1,920' },
];

const STATUS_CONFIG: Record<string, { icon: typeof Clock; className: string; label: string }> = {
  processing: { icon: Clock, className: 'text-warning', label: 'Processing' },
  shipped: { icon: Truck, className: 'text-info', label: 'Shipped' },
  delivered: { icon: CheckCircle2, className: 'text-success', label: 'Delivered' },
  issue: { icon: AlertCircle, className: 'text-danger', label: 'Issue' },
};

const CATEGORY_COLORS: Record<string, string> = {
  Flower: 'bg-[#22C55E]/15 text-[#22C55E]',
  Concentrate: 'bg-[#F59E0B]/15 text-[#F59E0B]',
  Preroll: 'bg-[#F97316]/15 text-[#F97316]',
  Edible: 'bg-[#8B5CF6]/15 text-[#8B5CF6]',
  Beverage: 'bg-[#14B8A6]/15 text-[#14B8A6]',
};

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-text-bright font-display">Dashboard</h1>
        <p className="text-sm text-text-muted mt-1">Welcome back, Green Dreams Dispensary</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-xl border border-border-default bg-card p-5 hover:bg-card-hover transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-primary/10">
                  <Icon className="h-[18px] w-[18px] text-accent-primary" />
                </div>
                <span className={`flex items-center gap-0.5 text-xs font-medium ${stat.up ? 'text-success' : 'text-danger'}`}>
                  {stat.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-text-bright font-display">{stat.value}</p>
              <p className="text-xs text-text-muted mt-1">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Recent orders — wider */}
        <div className="lg:col-span-3 rounded-xl border border-border-default bg-card">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border-default">
            <h2 className="text-sm font-semibold text-text-bright">Recent Orders</h2>
            <span className="text-xs text-accent-primary hover:underline cursor-pointer">View all</span>
          </div>
          <div className="divide-y divide-border-default">
            {RECENT_ORDERS.map((order) => {
              const statusCfg = STATUS_CONFIG[order.status];
              const StatusIcon = statusCfg.icon;
              return (
                <div key={order.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-card-hover transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-default font-mono">{order.id}</p>
                    <p className="text-xs text-text-muted mt-0.5">{order.items} items · {order.date}</p>
                  </div>
                  <span className="text-sm font-semibold text-text-bright">{order.total}</span>
                  <span className={`flex items-center gap-1 text-xs font-medium ${statusCfg.className}`}>
                    <StatusIcon className="h-3.5 w-3.5" />
                    {statusCfg.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top products — narrower */}
        <div className="lg:col-span-2 rounded-xl border border-border-default bg-card">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border-default">
            <h2 className="text-sm font-semibold text-text-bright">Top Products</h2>
            <span className="text-xs text-accent-primary hover:underline cursor-pointer">View all</span>
          </div>
          <div className="divide-y divide-border-default">
            {TOP_PRODUCTS.map((product, i) => (
              <div key={product.name} className="flex items-center gap-3 px-5 py-3.5 hover:bg-card-hover transition-colors">
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-white/[0.04] text-xs font-bold text-text-muted">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-default truncate">{product.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${CATEGORY_COLORS[product.category] ?? 'bg-white/10 text-text-muted'}`}>
                      {product.category}
                    </span>
                    <span className="text-xs text-text-muted">{product.sold} sold</span>
                  </div>
                </div>
                <span className="text-sm font-semibold text-text-bright">{product.revenue}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
