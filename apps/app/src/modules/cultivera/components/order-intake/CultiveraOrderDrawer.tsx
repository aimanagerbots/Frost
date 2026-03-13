'use client';

import { FileDown, ArrowRight, Package, User, Hash } from 'lucide-react';
import { StatusBadge, DrawerPanel } from '@/components';
import type { OrderImport } from '../../types';

interface CultiveraOrderDrawerProps {
  order: OrderImport;
  onClose: () => void;
}

const STATUS_SEQUENCE: OrderImport['status'][] = ['new', 'reviewed', 'pushed-to-orders'];
const STATUS_LABELS: Record<OrderImport['status'], string> = {
  'new': 'New',
  'reviewed': 'Reviewed',
  'pushed-to-orders': 'Pushed to Orders',
};

function formatTimestamp(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true,
  });
}

export function CultiveraOrderDrawer({ order, onClose }: CultiveraOrderDrawerProps) {
  const total = order.lineItems.reduce((sum, li) => sum + li.qty * li.unitPrice, 0);

  return (
    <DrawerPanel open title={`Order ${order.cultiveraPONumber}`} onClose={onClose}>
      <div className="space-y-5">
        {/* Status + PO info */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <StatusBadge status={order.status === 'new' ? 'new' : order.status === 'reviewed' ? 'processing' : 'delivered'} />
            <span className="text-xs text-text-muted">{formatTimestamp(order.importedAt)}</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-elevated px-3 py-2.5">
              <div className="flex items-center gap-1.5 mb-1">
                <Hash className="h-3 w-3 text-text-muted" />
                <p className="text-xs text-text-muted">PO Number</p>
              </div>
              <p className="text-sm font-semibold text-white font-mono">{order.cultiveraPONumber}</p>
            </div>
            <div className="rounded-lg bg-elevated px-3 py-2.5">
              <div className="flex items-center gap-1.5 mb-1">
                <User className="h-3 w-3 text-text-muted" />
                <p className="text-xs text-text-muted">License</p>
              </div>
              <p className="text-sm font-semibold text-white font-mono">{order.retailerLicense}</p>
            </div>
          </div>

          <div className="rounded-lg border border-default bg-card px-4 py-3">
            <p className="text-xs text-text-muted mb-0.5">Retailer</p>
            <p className="text-base font-bold text-white">{order.retailerName}</p>
          </div>
        </div>

        {/* Line items */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Package className="h-4 w-4 text-text-muted" />
            <h3 className="text-sm font-semibold text-white">Line Items</h3>
            <span className="text-xs text-text-muted">({order.lineItems.length})</span>
          </div>

          <div className="rounded-xl border border-default overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-card-hover border-b border-default">
                  <th className="text-left px-3 py-2.5 font-semibold text-text-muted uppercase tracking-wide">Product</th>
                  <th className="text-left px-3 py-2.5 font-semibold text-text-muted uppercase tracking-wide">SKU</th>
                  <th className="text-right px-3 py-2.5 font-semibold text-text-muted uppercase tracking-wide">Qty</th>
                  <th className="text-right px-3 py-2.5 font-semibold text-text-muted uppercase tracking-wide">Unit</th>
                  <th className="text-right px-3 py-2.5 font-semibold text-text-muted uppercase tracking-wide">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.lineItems.map((li, i) => (
                  <tr key={i} className="border-b border-default last:border-0">
                    <td className="px-3 py-2.5 text-white font-medium">{li.product}</td>
                    <td className="px-3 py-2.5 text-text-muted font-mono">{li.sku}</td>
                    <td className="px-3 py-2.5 text-right text-white">{li.qty}</td>
                    <td className="px-3 py-2.5 text-right text-text-muted">${li.unitPrice.toFixed(2)}</td>
                    <td className="px-3 py-2.5 text-right text-white font-semibold">
                      ${(li.qty * li.unitPrice).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-default bg-card-hover">
                  <td colSpan={4} className="px-3 py-3 text-right text-sm font-bold text-white">Total</td>
                  <td className="px-3 py-3 text-right text-sm font-bold text-white">${total.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2 pt-2">
          <a
            href={order.pdfUrl}
            className="flex items-center justify-center gap-2 w-full rounded-lg px-4 py-2.5 text-sm font-semibold border border-default text-white hover:bg-card-hover transition-colors"
          >
            <FileDown className="h-4 w-4" />
            Download PDF
          </a>

          {order.status !== 'pushed-to-orders' && (
            <button className="flex items-center justify-center gap-2 w-full rounded-lg px-4 py-2.5 text-sm font-semibold transition-all hover:opacity-90 active:scale-95 bg-[#22D3EE] text-[#0A1628]">
              <ArrowRight className="h-4 w-4" />
              Push to Orders
            </button>
          )}
        </div>

        {/* Status progression */}
        <div className="pt-2 border-t border-default">
          <p className="text-xs text-text-muted mb-3">Status progression</p>
          <div className="flex items-center gap-2 flex-wrap">
            {STATUS_SEQUENCE.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                  order.status === s
                    ? 'bg-[#22D3EE]/15 text-[#22D3EE]'
                    : STATUS_SEQUENCE.indexOf(order.status) > i
                    ? 'bg-green-500/10 text-green-400'
                    : 'bg-white/[0.06] text-text-text-muted'
                }`}>
                  {STATUS_LABELS[s]}
                </div>
                {i < STATUS_SEQUENCE.length - 1 && (
                  <ArrowRight className="h-3 w-3 text-text-muted flex-shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </DrawerPanel>
  );
}
