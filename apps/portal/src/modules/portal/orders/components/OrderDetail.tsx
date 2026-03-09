'use client';

import { ArrowLeft, Calendar, Hash } from 'lucide-react';
import type { PortalOrder } from '@/modules/portal/shared/types';
import type { PipelineExtension } from '@/modules/portal/shared/mock-data';
import { PortalStatusBadge } from '@/modules/portal/shared/components/PortalStatusBadge';
import { OrderPipelineTracker } from './OrderPipelineTracker';
import { OrderBottleneckAlert } from './OrderBottleneckAlert';
import { OrderDeliveryTracker } from './OrderDeliveryTracker';
import { OrderLineItemStatuses } from './OrderLineItemStatuses';
import { OrderLineItems } from './OrderLineItems';
import { OrderInvoiceSection } from './OrderInvoiceSection';
import { OrderStatusTimeline } from './OrderStatusTimeline';
import { OrderReorderButton } from './OrderReorderButton';

interface OrderDetailProps {
  order: PortalOrder;
  pipelineData: PipelineExtension | null | undefined;
  onBack: () => void;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export function OrderDetail({
  order,
  pipelineData,
  onBack,
}: OrderDetailProps) {
  const isOutForDelivery =
    pipelineData?.pipelineStep === 'out-for-delivery' ||
    pipelineData?.pipelineStep === 'picked-packed';

  return (
    <div className="space-y-6">
      {/* Back button */}
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-sm text-text-muted transition-colors hover:text-text-default"
      >
        <ArrowLeft className="h-4 w-4" />
        All Orders
      </button>

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold text-text-bright">
              {order.orderNumber}
            </h1>
            <PortalStatusBadge status={order.status} />
          </div>
          <div className="mt-1.5 flex items-center gap-4 text-sm text-text-muted">
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {formatDate(order.orderDate)}
            </span>
            {order.invoiceId && (
              <span className="inline-flex items-center gap-1">
                <Hash className="h-3.5 w-3.5" />
                Invoice {order.invoiceId}
              </span>
            )}
          </div>
        </div>
        <OrderReorderButton order={order} />
      </div>

      {/* Pipeline section (if pipeline data exists) */}
      {pipelineData && (
        <div className="space-y-4">
          {/* Full-size pipeline tracker */}
          <div className="rounded-xl border border-border-default bg-card p-5">
            <h2 className="mb-4 text-sm font-semibold text-text-bright">
              Order Pipeline
            </h2>
            <OrderPipelineTracker
              currentStep={pipelineData.pipelineStep}
              timestamps={pipelineData.pipelineStepTimestamps}
            />
          </div>

          {/* Bottleneck alert */}
          {pipelineData.bottleneckItem && (
            <OrderBottleneckAlert bottleneck={pipelineData.bottleneckItem} />
          )}

          {/* Delivery tracker (if out-for-delivery) */}
          {isOutForDelivery &&
            pipelineData.assignedDriver &&
            pipelineData.manifestNumber &&
            pipelineData.estimatedDeliveryDate && (
              <OrderDeliveryTracker
                driver={pipelineData.assignedDriver}
                manifestNumber={pipelineData.manifestNumber}
                estimatedDelivery={pipelineData.estimatedDeliveryDate}
              />
            )}

          {/* Line item statuses */}
          {pipelineData.lineItemStatuses.length > 0 && (
            <div>
              <h2 className="mb-3 text-sm font-semibold text-text-bright">
                Line Item Status
              </h2>
              <OrderLineItemStatuses
                lineItems={pipelineData.lineItemStatuses}
              />
            </div>
          )}
        </div>
      )}

      {/* Financial line items */}
      <div>
        <h2 className="mb-3 text-sm font-semibold text-text-bright">
          Order Items
        </h2>
        <OrderLineItems
          items={order.items}
          subtotal={order.subtotal}
          discount={order.discount}
          tax={order.tax}
          total={order.total}
        />
      </div>

      {/* Invoice & payment */}
      <OrderInvoiceSection order={order} />

      {/* Status timeline */}
      <div className="rounded-xl border border-border-default bg-card p-5">
        <h2 className="mb-3 text-sm font-semibold text-text-bright">
          Status History
        </h2>
        <OrderStatusTimeline history={order.statusHistory} />
      </div>

      {/* Notes */}
      {order.notes && (
        <div className="rounded-xl border border-border-default bg-card p-5">
          <h2 className="mb-2 text-sm font-semibold text-text-bright">
            Notes
          </h2>
          <p className="text-sm text-text-muted">{order.notes}</p>
        </div>
      )}
    </div>
  );
}
