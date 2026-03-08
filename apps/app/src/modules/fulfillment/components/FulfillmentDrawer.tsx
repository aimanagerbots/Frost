'use client';

import { useState, useMemo } from 'react';
import { CheckSquare, Square, FileText } from 'lucide-react';
import { DrawerPanel, StatusBadge } from '@/components';
import type { FulfillmentOrder, FulfillmentStatus } from '../types';
import { ACCENT } from '@/design/colors';


const statusVariant = (s: FulfillmentStatus) => {
  const map: Record<FulfillmentStatus, 'default' | 'info' | 'success' | 'warning' | 'muted'> = {
    queued: 'muted',
    picking: 'info',
    picked: 'default',
    packing: 'warning',
    packed: 'default',
    manifested: 'success',
    'ready-for-driver': 'success',
  };
  return map[s];
};

const priorityVariant = (p: string) => {
  const map: Record<string, 'danger' | 'warning' | 'default' | 'muted'> = {
    urgent: 'danger',
    high: 'warning',
    normal: 'default',
    low: 'muted',
  };
  return map[p] ?? 'default';
};

interface FulfillmentDrawerProps {
  order: FulfillmentOrder | null;
  open: boolean;
  onClose: () => void;
}

export function FulfillmentDrawer({ order, open, onClose }: FulfillmentDrawerProps) {
  const [pickedItems, setPickedItems] = useState<Set<string>>(new Set());
  const [localStatus, setLocalStatus] = useState<FulfillmentStatus | null>(null);

  const effectiveStatus = localStatus ?? order?.status ?? 'queued';

  // Reset local state when order changes
  const orderId = order?.id;
  const [lastOrderId, setLastOrderId] = useState<string | null>(null);
  if (orderId && orderId !== lastOrderId) {
    setLastOrderId(orderId);
    setLocalStatus(null);
    setPickedItems(new Set(order?.items.filter((i) => i.picked).map((i) => i.sku) ?? []));
  }

  const totalItems = order?.items.length ?? 0;
  const pickedCount = pickedItems.size;
  const progress = totalItems > 0 ? (pickedCount / totalItems) * 100 : 0;

  const togglePick = (sku: string) => {
    setPickedItems((prev) => {
      const next = new Set(prev);
      if (next.has(sku)) next.delete(sku);
      else next.add(sku);
      return next;
    });
  };

  const advanceStatus = () => {
    const flow: FulfillmentStatus[] = ['queued', 'picking', 'picked', 'packing', 'packed', 'manifested', 'ready-for-driver'];
    const idx = flow.indexOf(effectiveStatus);
    if (idx < flow.length - 1) {
      setLocalStatus(flow[idx + 1]);
    }
  };

  const actionLabel = useMemo(() => {
    const labels: Partial<Record<FulfillmentStatus, string>> = {
      queued: 'Start Picking',
      picking: 'Complete Pick',
      picked: 'Start Packing',
      packing: 'Complete Packing',
      packed: 'Generate Manifest',
      manifested: 'Mark Ready for Driver',
    };
    return labels[effectiveStatus];
  }, [effectiveStatus]);

  if (!order) return null;

  const showManifest = ['packed', 'manifested', 'ready-for-driver'].includes(effectiveStatus);

  return (
    <DrawerPanel
      open={open}
      onClose={onClose}
      title={`Order ${order.orderNumber}`}
      width="lg"
      footer={
        actionLabel ? (
          <button
            onClick={advanceStatus}
            className="w-full rounded-lg px-4 py-2.5 text-sm font-medium text-white transition-colors"
            style={{ backgroundColor: ACCENT }}
          >
            {actionLabel}
          </button>
        ) : undefined
      }
    >
      <div className="space-y-6">
        {/* Header info */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-text-default">{order.accountName}</span>
            <StatusBadge label={effectiveStatus.replace(/-/g, ' ')} variant={statusVariant(effectiveStatus)} />
          </div>
          <div className="flex flex-wrap gap-3 text-sm text-text-muted">
            <span>Priority: <StatusBadge label={order.priority} variant={priorityVariant(order.priority)} size="sm" /></span>
            <span>Assignee: {order.assignee}</span>
            <span>Est: {order.estimatedMinutes}m</span>
            {order.actualMinutes && <span>Actual: {order.actualMinutes}m</span>}
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-muted">Pick Progress</span>
            <span className="font-medium" style={{ color: ACCENT }}>
              {pickedCount} / {totalItems} items
            </span>
          </div>
          <div className="h-2 rounded-full bg-elevated overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{ width: `${progress}%`, backgroundColor: ACCENT }}
            />
          </div>
        </div>

        {/* Pick list */}
        <div className="space-y-1">
          <h4 className="text-sm font-medium text-text-muted mb-2">Pick List</h4>
          <div className="rounded-lg border border-default overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-elevated text-text-muted">
                  <th className="px-3 py-2 text-left w-8"></th>
                  <th className="px-3 py-2 text-left">Product</th>
                  <th className="px-3 py-2 text-left">SKU</th>
                  <th className="px-3 py-2 text-right">Qty</th>
                  <th className="px-3 py-2 text-left">Location</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => {
                  const isPicked = pickedItems.has(item.sku);
                  return (
                    <tr
                      key={item.sku}
                      className="border-t border-default hover:bg-accent-hover cursor-pointer transition-colors"
                      onClick={() => togglePick(item.sku)}
                    >
                      <td className="px-3 py-2">
                        {isPicked ? (
                          <CheckSquare className="h-4 w-4" style={{ color: ACCENT }} />
                        ) : (
                          <Square className="h-4 w-4 text-text-muted" />
                        )}
                      </td>
                      <td className={`px-3 py-2 ${isPicked ? 'line-through text-text-muted' : 'text-text-default'}`}>
                        {item.productName}
                      </td>
                      <td className="px-3 py-2 text-text-muted font-mono text-xs">{item.sku}</td>
                      <td className="px-3 py-2 text-right text-text-default">{item.quantity}</td>
                      <td className="px-3 py-2 text-text-muted text-xs">{item.shelfLocation}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Manifest section */}
        {showManifest && (
          <div className="rounded-xl border border-default bg-elevated p-4 space-y-2">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" style={{ color: ACCENT }} />
              <h4 className="text-sm font-medium text-text-default">Manifest</h4>
            </div>
            <p className="text-sm text-text-muted">
              Manifest #: <span className="font-mono text-text-default">{order.manifestNumber ?? 'MAN-2024-XXXX'}</span>
            </p>
            <button className="text-sm underline" style={{ color: ACCENT }}>
              View Manifest Document
            </button>
          </div>
        )}
      </div>
    </DrawerPanel>
  );
}
