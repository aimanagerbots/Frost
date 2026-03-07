'use client';

import { useState } from 'react';
import { DrawerPanel, StatusBadge } from '@/components';
import type { PackagingOrder } from '../types';

const ACCENT = '#84CC16';

const STATUS_MAP: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
  queued: 'default',
  'in-progress': 'info',
  completed: 'success',
  'blocked-material': 'danger',
};

const PRIORITY_MAP: Record<string, 'danger' | 'warning' | 'info' | 'muted'> = {
  critical: 'danger',
  high: 'warning',
  medium: 'info',
  low: 'muted',
};

interface PackagingDrawerProps {
  order: PackagingOrder | null;
  open: boolean;
  onClose: () => void;
}

export function PackagingDrawer({ order, open, onClose }: PackagingDrawerProps) {
  const [localStatus, setLocalStatus] = useState<string | null>(null);

  if (!order) return null;

  const status = localStatus ?? order.status;

  return (
    <DrawerPanel open={open} onClose={() => { onClose(); setLocalStatus(null); }} title={order.product} width="lg">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-wrap gap-2">
          <StatusBadge variant={STATUS_MAP[status] ?? 'default'} label={status} size="sm" dot pulse={status === 'in-progress'} />
          <StatusBadge variant={PRIORITY_MAP[order.priority] ?? 'muted'} label={order.priority} size="sm" />
          <span className="inline-flex items-center rounded-full bg-elevated px-2.5 py-0.5 text-xs text-muted">
            {order.sku}
          </span>
          <span className="inline-flex items-center rounded-full bg-elevated px-2.5 py-0.5 text-xs text-muted">
            {order.category}
          </span>
        </div>

        {/* Quantity */}
        <div className="rounded-lg border border-default bg-base p-3">
          <div className="text-xs text-muted">Quantity</div>
          <div className="text-lg font-bold text-bright">{order.quantity} units</div>
        </div>

        {/* Cannabis Materials */}
        <div>
          <h3 className="text-xs font-medium text-muted mb-2">Cannabis Materials</h3>
          <div className="rounded-lg border border-default overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-default bg-base">
                  <th className="px-3 py-2 text-left text-xs font-medium text-muted">Material</th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-muted">Required</th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-muted">Available</th>
                  <th className="px-3 py-2 text-center text-xs font-medium text-muted">Status</th>
                </tr>
              </thead>
              <tbody>
                {order.cannabisMaterials.map((m, i) => {
                  const short = m.available < m.required;
                  return (
                    <tr key={i} className="border-b border-default/50">
                      <td className="px-3 py-2 text-default">{m.name}</td>
                      <td className="px-3 py-2 text-right text-default">{m.required} {m.unit}</td>
                      <td className="px-3 py-2 text-right text-default">{m.available} {m.unit}</td>
                      <td className="px-3 py-2 text-center">
                        {short ? (
                          <span className="text-danger">&#10007;</span>
                        ) : (
                          <span className="text-success">&#10003;</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Non-Cannabis Materials */}
        <div>
          <h3 className="text-xs font-medium text-muted mb-2">Non-Cannabis Materials</h3>
          <div className="rounded-lg border border-default overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-default bg-base">
                  <th className="px-3 py-2 text-left text-xs font-medium text-muted">Material</th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-muted">Required</th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-muted">Available</th>
                  <th className="px-3 py-2 text-center text-xs font-medium text-muted">Status</th>
                </tr>
              </thead>
              <tbody>
                {order.nonCannabisMaterials.map((m, i) => (
                  <tr key={i} className="border-b border-default/50">
                    <td className="px-3 py-2 text-default">{m.name}</td>
                    <td className="px-3 py-2 text-right text-default">{m.required} {m.unit}</td>
                    <td className="px-3 py-2 text-right text-default">{m.available} {m.unit}</td>
                    <td className="px-3 py-2 text-center">
                      {!m.inStock ? (
                        <StatusBadge variant="danger" label="Shortage" size="sm" />
                      ) : (
                        <span className="text-success">&#10003;</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Assignment */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-muted mb-1">Assigned To</div>
            <div className="text-sm text-bright">{order.assignee}</div>
          </div>
          <div>
            <div className="text-xs text-muted mb-1">Estimated Time</div>
            <div className="text-sm text-bright">{order.estimatedMinutes} min</div>
          </div>
        </div>

        {/* Linked Order */}
        {order.linkedOrderId && (
          <div>
            <div className="text-xs text-muted mb-1">Linked Order</div>
            <span className="rounded-md bg-elevated px-2 py-0.5 text-xs text-default">{order.linkedOrderId}</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="mt-6 flex gap-2">
        {status === 'queued' && (
          <button
            onClick={() => setLocalStatus('in-progress')}
            className="rounded-lg px-4 py-2 text-sm font-medium text-bright transition-colors"
            style={{ backgroundColor: ACCENT }}
          >
            Start
          </button>
        )}
        {status === 'in-progress' && (
          <>
            <button
              onClick={() => setLocalStatus('completed')}
              className="rounded-lg bg-success/20 px-4 py-2 text-sm font-medium text-success transition-colors hover:bg-success/30"
            >
              Complete
            </button>
            <button
              onClick={() => setLocalStatus('blocked-material')}
              className="rounded-lg bg-danger/20 px-4 py-2 text-sm font-medium text-danger transition-colors hover:bg-danger/30"
            >
              Flag Shortage
            </button>
          </>
        )}
      </div>
    </DrawerPanel>
  );
}
