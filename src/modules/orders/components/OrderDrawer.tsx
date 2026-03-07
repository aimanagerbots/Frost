'use client';

import { DrawerPanel, StatusBadge, TimelineView } from '@/components';
import { useOrder } from '@/modules/orders/hooks/useOrder';
import type { OrderStatus, PaymentStatus } from '@/modules/orders/types';
import {
  Package, CreditCard, FileText,
  CheckCircle, Truck, Clock,
} from 'lucide-react';

interface OrderDrawerProps {
  orderId: string | null;
  open: boolean;
  onClose: () => void;
}

const STATUS_VARIANT: Record<OrderStatus, 'muted' | 'info' | 'warning' | 'success' | 'danger'> = {
  pending: 'muted',
  confirmed: 'info',
  'in-production': 'warning',
  packaged: 'info',
  fulfilled: 'warning',
  shipped: 'warning',
  delivered: 'success',
  paid: 'success',
};

const PAYMENT_VARIANT: Record<PaymentStatus, 'muted' | 'success' | 'danger'> = {
  pending: 'muted',
  received: 'success',
  overdue: 'danger',
};

export function OrderDrawer({ orderId, open, onClose }: OrderDrawerProps) {
  const { data: order } = useOrder(orderId);

  if (!order) return null;

  const timelineItems = [
    { id: 'created', timestamp: order.createdAt, icon: FileText, title: 'Order Created', description: `Order ${order.orderNumber} placed` },
    order.confirmedAt && { id: 'confirmed', timestamp: order.confirmedAt, icon: CheckCircle, iconColor: '#3B82F6', title: 'Order Confirmed', description: 'Order accepted and queued for production' },
    order.fulfilledAt && { id: 'fulfilled', timestamp: order.fulfilledAt, icon: Package, iconColor: '#F59E0B', title: 'Order Fulfilled', description: 'All items picked and packed' },
    order.deliveredAt && { id: 'delivered', timestamp: order.deliveredAt, icon: Truck, iconColor: '#22C55E', title: 'Delivered', description: `Delivered to ${order.accountName}` },
    order.paidAt && { id: 'paid', timestamp: order.paidAt, icon: CreditCard, iconColor: '#059669', title: 'Payment Received', description: `$${order.total.toLocaleString()} via ${order.paymentMethod.toUpperCase()}` },
  ].filter(Boolean) as { id: string; timestamp: string; icon: typeof Clock; iconColor?: string; title: string; description: string }[];

  return (
    <DrawerPanel open={open} onClose={onClose} title={`Order ${order.orderNumber}`} width="lg">
      <div className="space-y-5">
        {/* Header */}
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge variant={STATUS_VARIANT[order.status]} label={order.status.replace(/-/g, ' ')} />
          <StatusBadge variant={PAYMENT_VARIANT[order.paymentStatus]} label={`Payment: ${order.paymentStatus}`} />
          <span className="text-xs text-muted">
            {order.paymentMethod.toUpperCase()}
          </span>
        </div>

        {/* Account & Rep */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-xs font-semibold uppercase text-muted tracking-wider">Account</h4>
            <p className="mt-1 text-sm text-bright">{order.accountName}</p>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase text-muted tracking-wider">Sales Rep</h4>
            <p className="mt-1 text-sm text-default">{order.assignedRep}</p>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase text-muted tracking-wider">Created</h4>
            <p className="mt-1 text-sm text-default">
              {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase text-muted tracking-wider">Total</h4>
            <p className="mt-1 text-sm font-semibold text-bright">${order.total.toLocaleString()}</p>
          </div>
        </div>

        {/* Line Items */}
        <div>
          <h4 className="mb-2 text-xs font-semibold uppercase text-muted tracking-wider">Line Items ({order.items.length})</h4>
          <div className="rounded-lg border border-default overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-default bg-elevated">
                  <th className="px-3 py-2 text-left text-muted font-medium">Product</th>
                  <th className="px-3 py-2 text-right text-muted font-medium">Qty</th>
                  <th className="px-3 py-2 text-right text-muted font-medium">Unit</th>
                  <th className="px-3 py-2 text-right text-muted font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((li) => (
                  <tr key={li.id} className="border-b border-default last:border-0">
                    <td className="px-3 py-2">
                      <span className="text-default">{li.productName}</span>
                      {li.batchNumber && (
                        <span className="ml-1 text-[10px] text-muted">({li.batchNumber})</span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-right text-default">{li.quantity}</td>
                    <td className="px-3 py-2 text-right text-muted">${li.unitPrice}</td>
                    <td className="px-3 py-2 text-right text-bright font-medium">${li.lineTotal.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-elevated">
                  <td colSpan={3} className="px-3 py-2 text-right text-muted font-medium">Subtotal</td>
                  <td className="px-3 py-2 text-right text-default">${order.subtotal.toLocaleString()}</td>
                </tr>
                <tr className="bg-elevated">
                  <td colSpan={3} className="px-3 py-2 text-right text-muted font-medium">Tax</td>
                  <td className="px-3 py-2 text-right text-default">${order.tax.toLocaleString()}</td>
                </tr>
                <tr className="bg-elevated border-t border-default">
                  <td colSpan={3} className="px-3 py-2 text-right text-bright font-semibold">Total</td>
                  <td className="px-3 py-2 text-right text-bright font-semibold">${order.total.toLocaleString()}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Notes */}
        {order.notes && (
          <div>
            <h4 className="text-xs font-semibold uppercase text-muted tracking-wider">Notes</h4>
            <p className="mt-1 text-sm text-default">{order.notes}</p>
          </div>
        )}

        {/* Timeline */}
        <div>
          <h4 className="mb-2 text-xs font-semibold uppercase text-muted tracking-wider">Timeline</h4>
          <TimelineView items={timelineItems} />
        </div>
      </div>
    </DrawerPanel>
  );
}
